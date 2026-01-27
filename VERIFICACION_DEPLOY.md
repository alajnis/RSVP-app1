# ✅ Checklist de Verificación Post-Deploy

## 🎯 URLs para Probar

Abre estas URLs en tu navegador:

### Opción 1: Puerto por defecto
```
http://76.13.166.122/login-v3.html
```

### Opción 2: Puerto 8000 directo
```
http://76.13.166.122:8000/login-v3.html
```

> **Nota**: Usa la que funcione. Depende de cómo Dokploy haya configurado los puertos.

---

## 🔍 Paso 1: Verificar Página de Login

### ✅ Lo que DEBERÍAS ver:
- Página de login con el título "Bienvenido"
- Texto "Events Boutique" en rosado
- Campo de input para "INGRESA TU CLAVE"
- Botón "INGRESAR"

### ❌ Si ves un error:
- **404 Not Found** → Dokploy no desplegó correctamente o el path es incorrecto
- **ERR_CONNECTION_REFUSED** → El servidor no está corriendo o el puerto está bloqueado
- Página en blanco → Posible error de JavaScript

---

## 🔍 Paso 2: Verificar Consola del Navegador

1. Presiona **F12** (o clic derecho → "Inspeccionar")
2. Ve a la pestaña **Console**
3. Recarga la página (F5)

### ✅ Logs que DEBERÍAS ver:
```
🚀 Supabase configurado para: production
📡 URL: http://76.13.166.122:8000
🔧 Inicializando Supabase Client...
✅ Detectada librería Supabase en window.supabase
✅ Cliente Supabase inicializado correctamente
🌍 Ambiente: production
```

### ❌ Si ves errores:
| Error | Significa | Solución |
|-------|-----------|----------|
| `config.js no está cargado` | El archivo no se desplegó | Verifica en Dokploy que config.js existe |
| `Failed to fetch` | No puede conectar con Supabase | Verifica que Docker esté corriendo en el VPS |
| `CORS error` | Problema de permisos | Revisar configuración de Kong |

---

## 🔍 Paso 3: Probar el Login

1. En el campo de clave, escribe: `admin`
2. Click en "INGRESAR"

### ✅ Debería:
- Redirigir a `dashboard.html`
- Mostrar la pantalla de dashboard

### ❌ Si falla:
- Revisar consola para errores
- Verificar que la base de datos tenga datos (ejecutar db_seed.sql)

---

## 🔍 Paso 4: Verificar Docker en el VPS

Conéctate al VPS por SSH:

```bash
ssh usuario@76.13.166.122
```

### Verificar containers corriendo:
```bash
docker ps
```

**Deberías ver**:
- supabase-kong (puerto 8000)
- supabase-db
- supabase-auth
- supabase-rest
- supabase-storage

### Si los containers no están corriendo:
```bash
cd /ruta/de/tu/proyecto
docker-compose up -d
```

### Ver logs de Kong (API Gateway):
```bash
docker logs supabase-kong --tail 50
```

---

## 🔍 Paso 5: Verificar Firewall

El puerto 8000 debe estar abierto:

```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 8000

# CentOS/RHEL
sudo firewall-cmd --list-ports
sudo firewall-cmd --add-port=8000/tcp --permanent
sudo firewall-cmd --reload
```

---

## 🔍 Paso 6: Verificar Archivos Desplegados

En el VPS, verifica que los archivos nuevos existen:

```bash
cd /ruta/de/tu/proyecto

# Verificar que config.js existe
ls -la config.js

# Ver el contenido
cat config.js | grep SUPABASE_URL
```

**Deberías ver**:
```javascript
SUPABASE_URL: 'http://76.13.166.122:8000',
```

---

## 🎯 Resultados Esperados

### ✅ TODO FUNCIONA si:
1. La página de login carga sin errores
2. La consola muestra los logs de Supabase en verde (✅)
3. Puedes hacer login con "admin"
4. Te redirige al dashboard
5. El dashboard muestra las bodas o "Bienvenido a Events Boutique"

### 🔧 HAY PROBLEMAS si:
- La página no carga (error 404, 502, o similar)
- La consola muestra errores rojos
- El login no funciona
- No redirige al dashboard

---

## 📞 Si Hay Problemas

### 1. Revisa Dokploy
- Ve al dashboard de Dokploy
- Verifica el estado del deployment
- Revisa los logs del build
- Asegúrate que el puerto esté mapeado correctamente

### 2. Tool de Debug
Prueba abrir:
```
http://76.13.166.122/debug_connection.html
```

Click en "EJECUTAR DIAGNÓSTICO" y reporta los resultados.

### 3. Información para Debugging

Si necesitas ayuda, reporta:
- ¿Qué URL probaste?
- ¿Qué error aparece en pantalla?
- ¿Qué dice la consola del navegador? (screenshot)
- ¿Qué muestra `docker ps` en el VPS?

---

## 🚀 Próximo Paso: Configurar Dominio

Cuando `boutique-rsvp.com` esté listo:

1. Edita `config.js` línea 22
2. Descomenta: `SUPABASE_URL: 'http://boutique-rsvp.com:8000',`
3. Comenta la línea de la IP
4. Git push
5. Dokploy redeploy automático

---

**Ahora prueba las URLs y reporta qué ves!** 🎯
