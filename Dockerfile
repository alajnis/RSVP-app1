# Usamos una imagen base ligera de Nginx
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx (opcional, pero recomendada)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos todos los archivos estáticos de tu proyecto al directorio público de Nginx
# Nota: Copiamos todo el directorio actual (.) al html de nginx
COPY . /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Comando de inicio (por defecto en la imagen nginx)
CMD ["nginx", "-g", "daemon off;"]
