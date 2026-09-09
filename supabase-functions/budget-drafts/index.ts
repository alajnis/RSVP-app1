// Supabase Edge Function: budget-drafts
//
// Crea un Draft de Gmail (borrador, NO se envía) por cada proveedor recibido,
// usando la cuenta de Gmail elegida por el admin ("Enviado por"), autorizada vía OAuth.
//
// Deploy: guardar este archivo en /volumes/functions/budget-drafts/index.ts en el VPS
// (mismo mount point que /volumes/functions/hello/index.ts) y reiniciar/redeploy el
// contenedor supabase-edge-functions.
//
// Variables de entorno necesarias (Environment del servicio Supabase en Dokploy):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN_SOFIA       (refresh token de sofia@sfeventsboutique.com)
//   GOOGLE_REFRESH_TOKEN_GUADALUPE   (refresh token de guadalupe.alberti@sfeventsboutique.com)
//   GOOGLE_REFRESH_TOKEN_LUZ         (refresh token de luz.adaro@sfeventsboutique.com)
// Cada cuenta se obtiene una única vez con get-google-refresh-token.html (ver GUIA_GMAIL_SETUP.md).
// Client ID/Secret son compartidos entre cuentas (mismo proyecto de Google Cloud); el refresh
// token es específico de cada casilla.
//
// Request body esperado (JSON):
// {
//   "senderKey": "sofia" | "guadalupe" | "luz",
//   "subject": "...",
//   "body": "...",
//   "providers": [ { "id": "...", "emails": ["a@x.com", "b@x.com"] }, ... ]
// }
//
// Response:
// { "results": [ { "providerId": "...", "success": true, "draftId": "..." }, ... ] }

import { serve } from 'https://deno.land/std@0.177.1/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!

// Un refresh token por casilla de correo. Agregar acá cuando se conecte una cuenta nueva.
const SENDER_REFRESH_TOKENS: Record<string, string | undefined> = {
  sofia: Deno.env.get('GOOGLE_REFRESH_TOKEN_SOFIA'),
  guadalupe: Deno.env.get('GOOGLE_REFRESH_TOKEN_GUADALUPE'),
  luz: Deno.env.get('GOOGLE_REFRESH_TOKEN_LUZ'),
}

// Intercambia el refresh token de la cuenta elegida por un access token de corta duración.
// Se hace en cada invocación (no hay estado persistente en Edge Functions);
// el costo es una sola llamada HTTP extra por lote de proveedores.
async function getAccessToken(senderKey: string): Promise<string> {
  const refreshToken = SENDER_REFRESH_TOKENS[senderKey]
  if (!refreshToken) {
    throw new Error(`Esta cuenta aún no está conectada (falta configurar GOOGLE_REFRESH_TOKEN_${senderKey.toUpperCase()}).`)
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`No se pudo renovar el token de Google: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.access_token as string
}

// Convierte un string UTF-16 (el formato interno de JS) a bytes UTF-8 representados
// como un string "binario" (un char = un byte), el formato que espera btoa().
// Sin este paso, btoa() trata cada caracter como si fuera latin1 y rompe tildes/ñ.
function utf8Binary(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return binary
}

function toBase64(str: string): string {
  return btoa(utf8Binary(str))
}

// Codifica un mensaje de email en el formato base64url que espera la Gmail API.
// Todo el mensaje (headers de texto plano ASCII + Subject encoded-word + body UTF-8)
// se codifica UNA SOLA VEZ, al final, como el "raw" MIME completo.
function buildRawMessage(to: string[], subject: string, body: string): string {
  const headers = [
    `To: ${to.join(', ')}`,
    `Subject: =?UTF-8?B?${toBase64(subject)}?=`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
  ].join('\r\n')

  const message = `${headers}\r\n\r\n${body}`

  // base64url: reemplaza +/ por -_ y quita el padding, como exige la Gmail API
  return toBase64(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function createGmailDraft(accessToken: string, to: string[], subject: string, body: string): Promise<string> {
  const raw = buildRawMessage(to, subject, body)

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: { raw } }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gmail API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.id as string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { senderKey, subject, body, providers } = await req.json()

    if (!senderKey || !subject || !body || !Array.isArray(providers) || providers.length === 0) {
      return new Response(JSON.stringify({ error: 'Faltan senderKey, subject, body o providers' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    if (!(senderKey in SENDER_REFRESH_TOKENS)) {
      return new Response(JSON.stringify({ error: `Remitente desconocido: ${senderKey}` }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const accessToken = await getAccessToken(senderKey)

    const results = []
    for (const provider of providers) {
      const emails: string[] = provider.emails || []
      if (emails.length === 0) {
        results.push({ providerId: provider.id, success: false, error: 'Proveedor sin email' })
        continue
      }
      try {
        const draftId = await createGmailDraft(accessToken, emails, subject, body)
        results.push({ providerId: provider.id, success: true, draftId })
      } catch (e) {
        results.push({ providerId: provider.id, success: false, error: String(e?.message || e) })
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
