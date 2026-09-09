// Supabase Edge Function: rsvp-reminder-check
//
// Se ejecuta una vez por día (disparada por pg_cron, ver add_rsvp_reminder_cron.sql).
// Para cada casamiento activo cuya fecha esté a 45 días o menos, si más del 10% de los
// invitados todavía no respondió el RSVP, se manda UN email de aviso a los novios
// (a bride_email y/o groom_email, los que estén cargados) desde sofia@sfeventsboutique.com,
// y se marca el casamiento como ya avisado (rsvp_reminder_sent_at) para no repetirlo.
//
// No requiere body ni parámetros: recorre todos los proyectos elegibles en una sola corrida.
//
// Variables de entorno necesarias (ya existen, reutiliza las del módulo de proveedores):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (para leer/escribir con permisos de servicio)
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN_SOFIA

import { serve } from 'https://deno.land/std@0.177.1/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!
const GOOGLE_REFRESH_TOKEN_SOFIA = Deno.env.get('GOOGLE_REFRESH_TOKEN_SOFIA')!

const DAYS_THRESHOLD = 45
const PENDING_PERCENT_THRESHOLD = 10 // dispara si el % sin responder es MAYOR a esto

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN_SOFIA,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`No se pudo renovar el token de Google: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token as string
}

function utf8Binary(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return binary
}

function toBase64(str: string): string {
  return btoa(utf8Binary(str))
}

// CC fijo: el remitente (sofia@sfeventsboutique.com) siempre recibe copia, para tener
// registro de que el aviso salió sin depender de la carpeta "Enviados" del propio Gmail.
const CC_ADDRESS = 'sofia@sfeventsboutique.com'

function buildRawMessage(to: string[], subject: string, body: string): string {
  const headers = [
    `To: ${to.join(', ')}`,
    `Cc: ${CC_ADDRESS}`,
    `Subject: =?UTF-8?B?${toBase64(subject)}?=`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
  ].join('\r\n')
  const message = `${headers}\r\n\r\n${body}`
  return toBase64(message).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sendReminderEmail(accessToken: string, to: string[], subject: string, body: string): Promise<void> {
  const raw = buildRawMessage(to, subject, body)
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  })
  if (!res.ok) throw new Error(`Gmail API error ${res.status}: ${await res.text()}`)
}

function daysUntil(weddingDate: string): number {
  const [y, m, d] = weddingDate.split('-').map(Number)
  const wedding = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  wedding.setHours(0, 0, 0, 0)
  return Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// Misma lógica que wedding.html: total = sum(guests_confirmed), confirmed/declined
// se cuentan por sub_guests si existen, si no por el status del guest principal.
function computeRsvpStats(guests: any[]) {
  let total = 0
  let confirmed = 0
  let declined = 0

  for (const g of guests) {
    total += g.guests_confirmed || 0

    if (g.sub_guests && g.sub_guests.length > 0) {
      confirmed += g.sub_guests.filter((sg: any) => sg.status === 'Confirmed').length
      declined += g.sub_guests.filter((sg: any) => sg.status === 'Declined').length
    } else {
      if (g.rsvp_status === 'Confirmed') confirmed += g.guests_confirmed || 0
      if (g.rsvp_status === 'Declined') declined += g.guests_confirmed || 0
    }
  }

  const notResponded = total - confirmed - declined
  const pendingPercent = total > 0 ? (notResponded / total) * 100 : 0
  return { total, confirmed, declined, notResponded, pendingPercent }
}

function buildEmail(project: any, stats: ReturnType<typeof computeRsvpStats>, days: number) {
  const names = `${project.bride_name || ''} & ${project.groom_name || ''}`.trim()
  const subject = `Cierre de confirmaciones - Boda ${names}`
  const body = `Hola ${project.bride_name || ''}${project.groom_name ? ' y ' + project.groom_name : ''}:

¿Cómo están? Les escribimos para darles una mano con la organización de los últimos detalles.

A ${days} día${days === 1 ? '' : 's'} de la boda, todavía tenemos ${stats.notResponded} invitado${stats.notResponded === 1 ? '' : 's'} sin responder su asistencia (sobre un total de ${stats.total}). Para poder cerrar los números finales con el catering, la locación y el resto de los proveedores con tiempo, sería genial acelerar un poco el cierre de las confirmaciones que faltan.

Nos ayudarían insistiendo con las personas que faltan responder, así logramos cerrar ese tema?

Cualquier cosa que necesiten de nuestro lado, estamos a disposición.

Un beso grande,
Equipo SF Events Boutique`
  return { subject, body }
}

serve(async (req: Request) => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, bride_name, groom_name, bride_email, groom_email, wedding_date')
      .is('rsvp_reminder_sent_at', null)

    if (error) throw error

    const results: any[] = []
    let accessToken: string | null = null

    for (const project of projects || []) {
      if (!project.wedding_date) continue

      const days = daysUntil(project.wedding_date)
      if (days < 0 || days > DAYS_THRESHOLD) continue

      const recipients = [project.bride_email, project.groom_email].filter(Boolean)
      if (recipients.length === 0) continue

      const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('guests_confirmed, rsvp_status, sub_guests')
        .eq('project_id', project.id)

      if (guestsError) {
        results.push({ projectId: project.id, skipped: true, reason: guestsError.message })
        continue
      }

      const stats = computeRsvpStats(guests || [])
      if (stats.total === 0 || stats.pendingPercent <= PENDING_PERCENT_THRESHOLD) continue

      try {
        if (!accessToken) accessToken = await getAccessToken()
        const { subject, body } = buildEmail(project, stats, days)
        await sendReminderEmail(accessToken, recipients, subject, body)

        const { error: updateError } = await supabase
          .from('projects')
          .update({ rsvp_reminder_sent_at: new Date().toISOString() })
          .eq('id', project.id)

        if (updateError) throw updateError

        results.push({ projectId: project.id, sent: true, days, ...stats })
      } catch (e) {
        results.push({ projectId: project.id, sent: false, error: String((e as any)?.message || e) })
      }
    }

    return new Response(JSON.stringify({ checked: (projects || []).length, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as any)?.message || e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
