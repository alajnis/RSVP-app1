# 🚀 Deploy a Dokploy - LISTO

## ✅ Configuración Actual

Tu `config.js` está configurado para:
- **IP del VPS**: `76.13.166.122:8000`
- **Ambiente**: PRODUCTION
- **Dominio futuro**: `boutique-rsvp.com` (cuando el DNS esté listo)

---

## 📤 Pasos para Deploy

### 1. Commit y Push

```bash
git add config.js supabase-client.js login-v3.html dashboard.html wedding.html debug_connection.html README_CONFIGURACION.md DEPLOY_DOKPLOY.md

git commit -m "Fix: Configuración centralizada apuntando a VPS producción"

git push origin main
```

### 2. Verificar en Dokploy

1. Ve a tu panel de Dokploy
2. El proyecto debería hacer auto-deploy
3. Espera 1-2 minutos a que termine

### 3. Probar la App

Abre en tu navegador:
```
http://76.13.166.122/login-v3.html
```

O si Dokploy usa un puerto específico:
```
http://76.13.166.122:PUERTO/login-v3.html
```

---

## 🌐 Migrar al Dominio (Cuando esté listo)

Cuando `boutique-rsvp.com` apunte correctamente al VPS:

1. Abre `config.js`
2. Cambia la línea 22:
   ```javascript
   // De:
   SUPABASE_URL: 'http://76.13.166.122:8000',
   
   // A:
   SUPABASE_URL: 'http://boutique-rsvp.com:8000',
   ```
3. Commit y push de nuevo

---

## ✅ Checklist

- [x] `config.js` configurado con IP: 76.13.166.122
- [x] Ambiente en PRODUCTION
- [ ] Git commit hecho
- [ ] Git push realizado
- [ ] Dokploy hizo deploy
- [ ] App accesible desde http://76.13.166.122

---

## 🔍 Troubleshooting

### Puerto 8000 no accesible
```bash
# En el VPS, verificar firewall
sudo ufw allow 8000
sudo ufw status
```

### Docker no corriendo
```bash
# SSH al VPS
ssh usuario@76.13.166.122

# Verificar containers
docker ps | grep supabase

# Si no están corriendo
cd /ruta/de/tu/app
docker-compose up -d
```

### Ver logs
```bash
docker logs supabase-kong --tail 100
docker logs supabase-db --tail 100
```

---

## 📝 Nota sobre el Dominio

Tu dominio `boutique-rsvp.com` está en el config como opción comentada. Una vez que:
1. El DNS apunte a 76.13.166.122
2. El certificado SSL esté configurado (opcional)

Solo descomenta la línea en `config.js` y haz otro push.
