# 🔧 Guía Paso a Paso: Reparar Supabase en Dockploy

## ⚠️ ANTES DE EMPEZAR

> [!WARNING]
> Esta operación **eliminará todos los datos actuales de Supabase**. Si tienes datos importantes, haz un backup primero.

> [!NOTE]
> Las credenciales nuevas están en el archivo `supabase-credentials-NEW.env`

---

## 📋 Paso 1: Eliminar Supabase Actual

1. Ve a Dockploy: `http://76.13.166.122:3000`
2. Login con tus credenciales
3. Navega a: **Projects → RSVP app → production → supabase**
4. Haz clic en la pestaña **"Advanced"** o **"Settings"**
5. Busca el botón **"Delete Service"** o **"Remove Service"**
6. Confirma la eliminación
7. **ESPERA** 1-2 minutos a que se eliminen todos los contenedores

✅ **Confirmación**: Los contenedores de Supabase ya no aparecen en `docker ps -a`

---

## 📋 Paso 2: Limpiar Dominios Viejos

Antes de recrear, limpia los dominios del servicio anterior:

1. En Dockploy, ve a **Projects → RSVP app → production**
2. Si ves dominios huérfanos (amarillos), elimínalos:
   - `rsvp.boutique-rsvp.com` (si está duplicado)
   - `studio.boutique-rsvp.com` (si está sin servicio)

---

## 📋 Paso 3: Recrear Supabase con Nueva Configuración

1. En Dockploy, ve a **Projects → RSVP app → production**
2. Haz clic en **"Add Service"** → **"Supabase"**
3. Nombre del servicio: `supabase-new` (o simplemente `supabase`)

### Configuración Básica:

**Variables de Entorno Requeridas** (copia desde `supabase-credentials-NEW.env`):

```env
POSTGRES_PASSWORD=rsvp_secure_2026_P@ssw0rd!
JWT_SECRET=xK9mP2vL8nQ5wR7tY4uI6oP3jH1fG9dS2aZ5xC8vB0nM4qW7eR3tY6uI9oP2lK5j
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXRpcXVlLXJzdnAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODA2MTYwMCwiZXhwIjoyMDUzNjM3NjAwfQ.cY4mT8pV2nL6wQ9sR1xK5jH3fG7dA0zB4yC6vE8uI2oP
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXRpcXVlLXJzdnAiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzM4MDYxNjAwLCJleHAiOjIwNTM2Mzc2MDB9.nQ3mT9pW4oL7xR2sY6kJ8iH5gF1dC2aB7zD9vF0uK4pM
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=Admin2026_Rsvp!
SITE_URL=https://boutique-rsvp.com
```

4. **Guarda** la configuración
5. **ESPERA** 2-3 minutos a que todos los contenedores inicien

✅ **Confirmación**: En Dockploy, el estado del servicio debe ser **"Running"** (verde)

---

## 📋 Paso 4: Configurar Dominios

### Para Kong (API):
1. En el servicio Supabase, ve a la pestaña **"Domains"**
2. Haz clic en **"Add Domain"**
3. Configura:
   - **Domain**: `rsvp.boutique-rsvp.com`
   - **Container Port**: `8000`
   - **HTTPS**: ✅ Activado
   - **Generate Certificate**: ✅ Activado (Let's Encrypt)
4. **Guarda**

### Para Studio (Dashboard):
1. Haz clic en **"Add Domain"** nuevamente
2. Configura:
   - **Domain**: `studio.boutique-rsvp.com`
   - **Container Port**: `3000`
   - **HTTPS**: ✅ Activado
   - **Generate Certificate**: ✅ Activado (Let's Encrypt)
3. **Guarda**

---

## 📋 Paso 5: Validar DNS

1. **ESPERA** 30-60 segundos después de agregar los dominios
2. En cada dominio, haz clic en el botón **"Validate"** o **"Refresh"** 
3. El estado debe cambiar de:
   - ⚠️ **Validate DNS** (amarillo)
   - ↓
   - ✅ **Active** (verde)

> [!TIP]
> Si no cambia a verde, espera 2-3 minutos más y vuelve a validar. La propagación DNS puede tardar.

---

## 📋 Paso 6: Actualizar rsvp-app

Ahora debes actualizar la configuración de la aplicación frontend:

1. En Dockploy, ve a **Projects → RSVP app → production → rsvp-app**
2. Ve a **"Environment"** o **"Environment Variables"**
3. Actualiza/agrega estas variables:

```env
SUPABASE_URL=https://rsvp.boutique-rsvp.com
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvdXRpcXVlLXJzdnAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODA2MTYwMCwiZXhwIjoyMDUzNjM3NjAwfQ.cY4mT8pV2nL6wQ9sR1xK5jH3fG7dA0zB4yC6vE8uI2oP
```

4. **Guarda** y **Redeploy** la aplicación

---

## 📋 Paso 7: Verificación Final

### Verifica cada URL:

1. **Aplicación Principal**: https://boutique-rsvp.com
   - ✅ Debe cargar sin errores de SSL
   - ✅ No debe mostrar errores de consola

2. **API (Kong)**: https://rsvp.boutique-rsvp.com
   - ✅ Debe mostrar una respuesta JSON de Supabase

3. **Studio (Dashboard)**: https://studio.boutique-rsvp.com
   - ✅ Debe mostrar el login de Supabase Studio
   - 🔑 Credenciales: `admin` / `Admin2026_Rsvp!`

### Verifica los logs:
```bash
# Si tienes acceso SSH al VPS
ssh root@76.13.166.122

# Ver contenedores corriendo
docker ps

# Ver logs de Kong (NO debe haber errores de kong.yml)
docker logs <container-kong> --tail 50

# Ver logs de la app
docker logs <container-rsvp-app> --tail 50
```

---

## ✅ Checklist de Validación

- [ ] Supabase antiguo eliminado completamente
- [ ] Supabase nuevo creado y corriendo
- [ ] Dominios agregados (rsvp y studio)
- [ ] Dominios validados (cambió a verde)
- [ ] Certificados SSL generados automáticamente
- [ ] rsvp-app actualizado con nuevas credenciales
- [ ] https://boutique-rsvp.com funciona
- [ ] https://rsvp.boutique-rsvp.com responde
- [ ] https://studio.boutique-rsvp.com muestra login
- [ ] NO hay errores en los logs de Kong
- [ ] La aplicación puede conectarse a Supabase

---

## 🆘 Si Algo Sale Mal

### Problema: Dominios no se validan (siguen amarillos)

**Solución**:
1. Verifica que los DNS en Hostinger sigan correctos
2. Espera 5 minutos más (propagación DNS)
3. Reinicia el servicio en Dockploy
4. Valida manualmente desde el VPS:
   ```bash
   nslookup rsvp.boutique-rsvp.com
   nslookup studio.boutique-rsvp.com
   ```

### Problema: Kong sigue crasheando

**Solución**:
1. Verifica que todas las variables de entorno estén correctas
2. Revisa los logs: `docker logs <kong-container>`
3. Si el problema persiste, elimina y recrea Supabase nuevamente
4. Considera usar el template oficial de Supabase en lugar del de Dockploy

### Problema: Certificados SSL no se generan

**Solución**:
1. Verifica que el puerto 80 y 443 estén abiertos en el firewall
2. Verifica que no haya otro servicio usando esos puertos
3. Manualmente genera certificados:
   ```bash
   # En el VPS
   docker exec <traefik-container> certbot certonly --manual
   ```

---

## 📞 Siguiente Paso

Una vez completado todo, avísame y te ayudaré a:
1. Migrar los datos de la base de datos antigua (si los tienes)
2. Configurar las tablas y datos de ejemplo
3. Realizar pruebas end-to-end de la aplicación
