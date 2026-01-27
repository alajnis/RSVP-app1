# 🚀 Configuración de Dokploy para RSVP App

## Problema Actual
Los archivos HTML no se están sirviendo (error 404) porque Dokploy necesita configuración específica.

## ✅ Solución

### Opción 1: Configurar Dokploy para usar Docker (RECOMENDADO)

1. **En el panel de Dokploy**:
   - Ve a tu proyecto RSVP
   - En "Build Configuration" selecciona: **Dockerfile**
   - En "Dockerfile path" pon: `Dockerfile`
   - En "Port" pon: `80`
   - Guarda y redeploy

2. **La app estará en**:
   ```
   http://76.13.166.122
   ```

### Opción 2: Si Dokploy no detecta Docker

Asegúrate que en Dokploy:
- **Build Type**: Docker
- **Dockerfile**: ./Dockerfile
- **Port Mapping**: 80:80

---

## 📝 Archivos Actualizados

- ✅ `nginx.conf` - Ahora sirve `login-v3.html` como página principal
- ✅ `Dockerfile` - Ya existe y está correcto

---

## 🔧 Comandos para Deploy Manual (Si es necesario)

Si Dokploy no lo hace automáticamente:

```bash
# SSH al VPS
ssh usuario@76.13.166.122

# Ir a la carpeta del proyecto
cd /ruta/de/tu/proyecto

# Build de la imagen Docker
docker build -t rsvp-frontend .

# Correr el container
docker run -d -p 80:80 --name rsvp-app rsvp-frontend

# Verificar que está corriendo
docker ps | grep rsvp
```

---

## 🎯 Después de Configurar

La app debería estar en:
```
http://76.13.166.122/
```

Y abrirá automáticamente `login-v3.html`.

---

## 📋 Siguiente Paso

1. Commit estos cambios
2. Push a GitHub
3. **Configurar Dokploy para usar Dockerfile**
4. Redeploy

¿Hago el commit y push?
