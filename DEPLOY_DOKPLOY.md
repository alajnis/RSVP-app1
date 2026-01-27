# 🚀 Deployment a Dokploy (VPS)

## 📋 Pasos para Deploy

### 1. Actualizar Configuración

Abre `config.js` y modifica la configuración de producción:

```javascript
// ============= CONFIGURACIÓN PRODUCCIÓN =============
const CONFIG_PRODUCTION = {
    // Reemplaza con TU IP o DOMINIO:
    SUPABASE_URL: 'http://TU_IP_PUBLICA:8000',  // ← CAMBIAR AQUÍ
    
    // O si tienes dominio:
    // SUPABASE_URL: 'http://boutique-rsvp.com:8000',
    
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzY5NDU4MDYzLCJleHAiOjIwODQ4MTgwNjN9.BLdRie7if_hl-k0kPoe6JsZuw6C-emTGLfbIqzaV6VI',
    ENVIRONMENT: 'production'
};

// ============= ACTIVAR PRODUCCIÓN =============
const SUPABASE_CONFIG = CONFIG_PRODUCTION;  // ← CAMBIAR DE CONFIG_LOCAL A CONFIG_PRODUCTION
```

### 2. Commit y Push a Git

```bash
# Agregar archivos modificados
git add config.js supabase-client.js login-v3.html dashboard.html wedding.html debug_connection.html

# Commit
git commit -m "Fix: Configuración centralizada de Supabase"

# Push al repositorio
git push origin main
```

### 3. Deploy en Dokploy

#### Opción A: Auto-deploy (si está configurado)
Dokploy debería detectar el push automáticamente y hacer redeploy.

#### Opción B: Manual desde Dokploy UI
1. Accede a tu panel de Dokploy
2. Ve a tu proyecto RSVP
3. Click en "Redeploy" o "Deploy"
4. Espera a que termine el deployment

### 4. Verificar en el VPS

```bash
# Conectarse al VPS
ssh usuario@TU_IP_VPS

# Verificar que los archivos se actualizaron
cd /ruta/a/tu/app
ls -la config.js

# Verificar Docker
docker ps | grep supabase

# Ver logs si hay problemas
docker logs supabase-kong --tail 50
```

---

## 🔍 Troubleshooting

### Si el dominio no funciona

En `docker-compose.yml`, verifica que las URLs estén configuradas correctamente:

```yaml
environment:
  SUPABASE_PUBLIC_URL: http://TU_DOMINIO_O_IP:8000
  # ... otras variables
```

### Si hay error de CORS

Agrega tu dominio a la configuración de Kong en `volumes/api/kong.yml`:

```yaml
cors:
  origins:
    - http://TU_DOMINIO
    - http://TU_IP:8000
  credentials: true
```

---

## ⚡ Deployment Rápido (Una Línea)

```bash
git add . && git commit -m "Fix Supabase config" && git push origin main
```

Dokploy hará el resto automáticamente si tienes auto-deploy habilitado.

---

## 📝 Notas Importantes

- **Puerto 8000**: Asegúrate que esté abierto en el firewall del VPS
- **HTTP vs HTTPS**: Por ahora usa HTTP. Para HTTPS necesitas certificado SSL
- **DNS**: Si usas dominio, asegúrate que apunte a la IP del VPS

---

## 🎯 Checklist Post-Deploy

- [ ] Archivos actualizados en el VPS
- [ ] Docker containers corriendo (`docker ps`)
- [ ] Puerto 8000 accesible desde internet
- [ ] Config.js apunta a IP/dominio correcto
- [ ] Login funciona desde navegador externo
