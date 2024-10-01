FROM node:12-alpine3.15 AS build
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
RUN npm install --force react-scripts
ARG BUILD
RUN npm run build-${BUILD}

# production environment
FROM nginx:alpine3.18 as prod-stage
COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY localhost.key /usr/share/nginx/
COPY localhost.crt /usr/share/nginx/
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]