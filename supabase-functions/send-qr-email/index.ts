// Supabase Edge Function: send-qr-email
//
// Envía (directo, SIN pasar por drafts) un mail de confirmación de RSVP con el
// código QR de acceso embebido inline en el cuerpo del mail, usando la cuenta
// de Gmail elegida ("Enviado por"), autorizada vía OAuth. Pensado para el
// flujo de corporate-rsvp.html: el QR se genera en el cliente (librería
// `qrcode`) y se manda ya resuelto como data URL; esta función solo lo
// re-empaqueta como parte inline de un mail multipart/related.
//
// Basado directamente en supabase-functions/budget-drafts/index.ts (mismo
// manejo de CORS, mismos helpers de base64/UTF-8, mismo patrón de refresh
// token por senderKey). Diferencias:
//   - Usa users/me/messages/send (envío directo) en vez de users/me/drafts.
//   - El QR se adjunta inline vía multipart/related + Content-ID, igual que
//     budget-drafts hace con la firma, pero el QR viaja en el body del
//     request (no por URL pública) porque es distinto por cada invitado.
//
// Deploy: guardar este archivo en /volumes/functions/send-qr-email/index.ts
// en el VPS (mismo mount point que /volumes/functions/hello/index.ts) y
// reiniciar/redeploy el contenedor supabase-edge-functions. Esto lo hace el
// usuario manualmente en Dokploy -- este archivo solo queda listo en el repo.
//
// Variables de entorno necesarias (las mismas que ya usa budget-drafts,
// compartidas entre ambas funciones -- no hace falta configurar nada nuevo):
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN_SOFIA       (refresh token de sofia@sfeventsboutique.com)
//   GOOGLE_REFRESH_TOKEN_GUADALUPE   (refresh token de guadalupe.alberti@sfeventsboutique.com)
//   GOOGLE_REFRESH_TOKEN_LUZ         (refresh token de luz.adaro@sfeventsboutique.com)
//
// Request body esperado (JSON):
// {
//   "senderKey": "sofia" | "guadalupe" | "luz",
//   "to": "invitado@email.com",
//   "guestName": "Juan Pérez",
//   "eventName": "Evento Corporativo Acme 2026",
//   "qrDataUrl": "data:image/png;base64,iVBORw0KG..."
// }
//
// Response:
// { "success": true, "messageId": "..." }  o  { "error": "..." }

import { serve } from 'https://deno.land/std@0.177.1/http/server.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!

// Mismas 3 casillas ya conocidas (ver supabase-functions/budget-drafts/index.ts).
const SENDER_REFRESH_TOKENS: Record<string, string | undefined> = {
  sofia: Deno.env.get('GOOGLE_REFRESH_TOKEN_SOFIA'),
  guadalupe: Deno.env.get('GOOGLE_REFRESH_TOKEN_GUADALUPE'),
  luz: Deno.env.get('GOOGLE_REFRESH_TOKEN_LUZ'),
}

const DEPLOY_VERSION = 'v1-send-qr-email-2026-10-13'

// Intercambia el refresh token de la cuenta elegida por un access token de corta duración.
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
function utf8Binary(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return binary
}

function toBase64(str: string): string {
  return btoa(utf8Binary(str))
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Saca el prefijo "data:image/png;base64," (o cualquier variante de mime/
// encoding) de un data URL y deja solo el base64 puro, listo para meter en
// una parte MIME.
function stripDataUrlPrefix(dataUrl: string): string {
  const match = /^data:[^;]+;base64,(.*)$/s.exec(dataUrl.trim())
  if (!match) {
    throw new Error('qrDataUrl no tiene el formato esperado (data:image/png;base64,...)')
  }
  return match[1]
}

// Arma el HTML del cuerpo del mail con el QR referenciado por Content-ID (cid:qr).
// eventDateLabel y venue son opcionales: si el evento no tiene lugar cargado,
// la línea de "te esperamos el [fecha] en [lugar]" se arma solo con lo que haya.
function buildHtmlBody(guestName: string, eventName: string, eventDateLabel?: string, venue?: string): string {
  const safeName = escapeHtml(guestName || 'Invitado/a')
  const safeEvent = escapeHtml(eventName || 'el evento')

  const parts: string[] = []
  if (eventDateLabel) parts.push(`el ${escapeHtml(eventDateLabel)}`)
  if (venue) parts.push(`en ${escapeHtml(venue)}`)
  const whenWhere = parts.length > 0 ? `Te esperamos ${parts.join(' ')}.` : '¡Te esperamos!'

  return `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#1a1a1a; line-height:1.5;">
<p style="margin:0 0 16px 0;">Hola ${safeName},</p>
<p style="margin:0 0 16px 0;">Confirmamos tu asistencia a <strong>${safeEvent}</strong>. Este es tu código de acceso — mostralo al llegar al evento.</p>
<div style="margin:24px 0; text-align:center;">
  <img src="cid:qr" alt="Código QR de acceso" style="width:220px; height:220px; display:inline-block;">
</div>
<p style="margin:0; color:#555;">${whenWhere}</p>
</body></html>`
}

// Codifica un mensaje multipart/related (HTML + imagen inline por Content-ID)
// en el formato base64url que espera la Gmail API. Mismo patrón que
// buildRawMessage + la firma inline de budget-drafts, pero generalizado para
// una imagen que viaja en el body del request en vez de por URL pública.
function buildRawMessage(to: string, subject: string, htmlBody: string, qrBase64: string): string {
  const boundary = `boundary_qr_${crypto.randomUUID().replace(/-/g, '')}`

  const headers = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${toBase64(subject)}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary="${boundary}"`,
  ].join('\r\n')

  // Nota: Content-Transfer-Encoding: base64 exige líneas de máximo 76
  // caracteres (RFC 2045) — sin este wrap, Gmail puede no decodificar bien
  // la parte (mismo problema ya visto y corregido antes en budget-drafts).
  const wrap76 = (b64: string) => b64.replace(/(.{76})/g, '$1\r\n')

  const htmlPart = [
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(toBase64(htmlBody)),
  ].join('\r\n')

  const imagePart = [
    `--${boundary}`,
    'Content-Type: image/png',
    'Content-Transfer-Encoding: base64',
    'Content-ID: <qr>',
    'Content-Disposition: inline; filename="qr.png"',
    '',
    wrap76(qrBase64),
  ].join('\r\n')

  const message = `${headers}\r\n\r\n${htmlPart}\r\n${imagePart}\r\n--${boundary}--\r\n`
  return toBase64(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sendGmailMessage(accessToken: string, to: string, subject: string, htmlBody: string, qrBase64: string): Promise<string> {
  const raw = buildRawMessage(to, subject, htmlBody, qrBase64)

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
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

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ version: DEPLOY_VERSION }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { senderKey, to, guestName, eventName, eventDateLabel, venue, qrDataUrl } = await req.json()

    if (!senderKey || !to || !qrDataUrl) {
      return new Response(JSON.stringify({ error: 'Faltan senderKey, to o qrDataUrl' }), {
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

    const qrBase64 = stripDataUrlPrefix(qrDataUrl)
    const accessToken = await getAccessToken(senderKey)
    const subject = `Tu código de acceso — ${eventName || 'Evento'}`
    const htmlBody = buildHtmlBody(guestName, eventName, eventDateLabel, venue)

    const messageId = await sendGmailMessage(accessToken, to, subject, htmlBody, qrBase64)

    return new Response(JSON.stringify({ success: true, messageId }), {
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
