# 🔧 Configuración Corregida - RSVP App

## ✅ Cambios Realizados

Se ha corregido el problema de conectividad con Supabase. Los cambios incluyen:

### 1. **Configuración Centralizada** (`config.js`)
- Creado archivo `config.js` con configuración unificada
- Permite cambiar fácilmente entre ambiente LOCAL y PRODUCCIÓN
- Elimina URLs duplicadas en múltiples archivos

### 2. **Archivos Actualizados**
- ✅ `config.js` - **NUEVO**: Configuración centralizada
- ✅ `supabase-client.js` - Refactorizado para usar `config.js`
- ✅ `login-v3.html` - Usa configuración centralizada
- ✅ `dashboard.html` - Usa configuración centralizada
- ✅ `wedding.html` - Usa configuración centralizada
- ✅ `debug_connection.html` - Usa configuración centralizada

---

## 🚀 Cómo Usar

### **OPCIÓN 1: Desarrollo Local (Recomendada para Pruebas)**

1. Abre `config.js`
2. Asegúrate que la línea 28 diga:
   ```javascript
   const SUPABASE_CONFIG = CONFIG_LOCAL;
   ```
3. Verifica que Docker esté corriendo:
   ```powershell
   docker ps | grep supabase
   ```
4. Abre `login-v3.html` en tu navegador
5. Ingresa clave "admin" y verifica que funcione

### **OPCIÓN 2: Producción con Dominio**

Si estás desplegando en un servidor con dominio:

1. Abre `config.js`
2. En la línea 18, actualiza con la IP pública del servidor:
   ```javascript
   // OPCIÓN A: Usando IP directa (RECOMENDADO si DNS no funciona)
   SUPABASE_URL: 'http://TU_IP_PUBLICA:8000',
   ```
   O si tienes SSL configurado:
   ```javascript
   // OPCIÓN B: Usando dominio con HTTPS (requiere certificado SSL)
   SUPABASE_URL: 'https://boutique-rsvp.com',
   ```
3. Cambia la línea 28 a:
   ```javascript
   const SUPABASE_CONFIG = CONFIG_PRODUCTION;
   ```

---

## 🔍 Diagnóstico

### Probar Conexión
Abre `debug_connection.html` en tu navegador y haz clic en **"EJECUTAR DIAGNÓSTICO"**.

Deberías ver:
- ✅ Conexión con el servidor de AUTH exitosa
- ✅ ¡ÉXITO! Conexión a Base de Datos establecida
- ✅ ¡ÉXITO! El servicio de Auth está funcionando

### Comandos Útiles

```powershell
# Ver contenedores de Supabase corriendo
docker ps

# Ver logs de Kong (API Gateway)
docker logs supabase-kong

# Verificar conectividad local
curl http://localhost:8000/rest/v1/

# Reiniciar servicios de Supabase
docker-compose down && docker-compose up -d
```

---

## ⚠️ Problemas Comunes

### 1. **"Failed to fetch" / CORS Error**
**Causa**: Intentaste usar HTTPS sin certificado SSL, o mixed content (HTTPS → HTTP)

**Solución**:
- Para desarrollo local: Usa `CONFIG_LOCAL` con `http://localhost:8000`
- Para producción: Configura nginx con Let's Encrypt

### 2. **"DNS to be validated"**
**Causa**: El dominio personalizado no está configurado correctamente

**Solución**:
- Usa la IP directa del servidor en lugar del dominio
- O configura correctamente los registros DNS apuntando a tu servidor

### 3. **No se cargan los datos**
**Causa**: La base de datos no tiene datos de ejemplo

**Solución**:
```bash
# Conectarse a la base de datos y ejecutar el seed
docker exec -it supabase-db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/db_seed.sql
```

---

## 📝 Próximos Pasos (Opcional)

Para configurar SSL en producción:

1. Instala nginx como reverse proxy
2. Obtén certificado SSL gratuito con Let's Encrypt:
   ```bash
   certbot --nginx -d boutique-rsvp.com
   ```
3. Configura nginx para proxy_pass a `http://localhost:8000`
4. Actualiza `config.js` a usar `https://boutique-rsvp.com`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de Docker: `docker logs supabase-kong`
2. Ejecuta `debug_connection.html` para diagnóstico
3. Verifica que `config.js` esté configurado correctamente
