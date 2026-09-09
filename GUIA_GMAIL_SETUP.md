# Guía: Conectar Gmail (sofia@sfeventsboutique.com) al módulo de Proveedores

Esto se hace UNA sola vez. Al final vas a tener 3 valores para guardar en Dokploy y todo va a
funcionar solo, sin volver a tocar Google Cloud.

## Paso 1 — Crear el proyecto en Google Cloud

1. Andá a https://console.cloud.google.com/
2. Iniciá sesión con **sofia@sfeventsboutique.com** (o con la cuenta que administre ese dominio de Google Workspace)
3. Arriba a la izquierda, click en el selector de proyecto → **"Proyecto nuevo"**
4. Nombre: `RSVP Proveedores` (o el que prefieras) → **Crear**

## Paso 2 — Activar la Gmail API

1. Con el proyecto nuevo seleccionado, andá a **"APIs y servicios" → "Biblioteca"**
2. Buscá **"Gmail API"**
3. Click en **"Habilitar"**

## Paso 3 — Configurar la pantalla de consentimiento OAuth

1. Andá a **"APIs y servicios" → "Pantalla de consentimiento de OAuth"**
2. Tipo de usuario: **Interno** (si es Google Workspace) o **Externo** si es Gmail normal
3. Completá: nombre de la app (`RSVP Proveedores`), email de soporte, email de contacto del desarrollador
4. En "Scopes" (permisos), podés dejarlo vacío por ahora — no hace falta agregarlo acá
5. Si elegiste "Externo": en la pestaña **"Público de prueba"**, agregá `sofia@sfeventsboutique.com` como test user
6. Guardar

## Paso 4 — Crear las credenciales OAuth 2.0

1. Andá a **"APIs y servicios" → "Credenciales"**
2. Click en **"+ Crear credenciales" → "ID de cliente de OAuth"**
3. Tipo de aplicación: **Aplicación web**
4. Nombre: `RSVP Proveedores Web`
5. En **"URIs de redireccionamiento autorizados"**, agregá exactamente:
   ```
   http://localhost:5500/get-google-refresh-token.html
   ```
6. Click en **Crear**
7. Google te va a mostrar un **Client ID** (termina en `.apps.googleusercontent.com`) y un
   **Client Secret** (empieza con `GOCSPX-`). **Copiá los dos**, los vas a necesitar en el paso siguiente.

## Paso 5 — Obtener el Refresh Token (una sola vez)

1. En tu compu, con el servidor local corriendo (`http-server` en el puerto 5500, como ya usamos antes),
   abrí: **http://localhost:5500/get-google-refresh-token.html**
2. Pegá el **Client ID** y el **Client Secret** del paso anterior
3. Dejá el "Redirect URI" tal cual está (`http://localhost:5500/get-google-refresh-token.html`)
4. Click en **"1. Iniciar sesión con Google"**
5. Te va a llevar a una pantalla de Google — **iniciá sesión con sofia@sfeventsboutique.com** y aceptá los permisos
   (va a decir algo como "RSVP Proveedores quiere administrar tus borradores y enviar correos en tu nombre")
6. Te va a redirigir de vuelta a la página local, con el código ya completado automáticamente
7. Click en **"2. Obtener Refresh Token"**
8. Vas a ver un texto largo — **ese es el `GOOGLE_REFRESH_TOKEN`**, copialo

## Paso 6 — Cargar las 3 variables en Dokploy

1. Andá a Dokploy → servicio **Supabase** → pestaña **Environment**
2. Agregá estas 3 variables (con los valores que obtuviste):
   ```
   GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxx
   GOOGLE_REFRESH_TOKEN=el-token-largo-que-copiaste
   ```
3. Guardá y hacé **Redeploy** (o "Reload Compose") del servicio Supabase para que tome las nuevas variables

## Paso 7 — Subir el código de la Edge Function al VPS

Esto es lo único que no podés hacer desde el navegador — necesitás que el archivo
`supabase-functions/budget-drafts/index.ts` de este proyecto quede ubicado en el VPS en
`/volumes/functions/budget-drafts/index.ts` (mismo patrón que `/volumes/functions/hello/index.ts`
que ya vimos en la configuración de Dokploy).

Avisame cuando llegues a este paso y vemos juntos la forma más simple de subirlo según el acceso
que tengas al servidor (por ejemplo, agregándolo como un "mount" de tipo archivo en Dokploy,
igual que están cargados `kong.yml` y los demás `.sql` que vimos antes en "Advanced / Docker").

## Paso 8 — Probar

Una vez hecho todo lo anterior, en `wedding.html` → tab **Proveedores** → elegí una categoría,
seleccioná uno o más proveedores, click en **"Generar Solicitud"**, revisá/editá el mensaje, y
click en **"Generar Borradores en Gmail"**. Deberías ver los borradores aparecer en la carpeta
**Borradores** de sofia@sfeventsboutique.com, listos para revisar y enviar manualmente.
