# Fase de construcción
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json (si existe)
COPY package.json package-lock.json ./

# Instalar dependencias y usar la caché de Docker
RUN npm install --force

# Copiar todo el código fuente después de instalar las dependencias
COPY . .

# Argumento de construcción
ARG BUILD

# Construir la aplicación
RUN npm run build-${BUILD}

# Fase de producción
FROM nginx:alpine AS prod-stage

# Copiar los archivos de la construcción al contenedor Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuraciones de Nginx y certificados
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY localhost.key /usr/share/nginx/
COPY localhost.crt /usr/share/nginx/

# Exponer los puertos
EXPOSE 80 443

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
