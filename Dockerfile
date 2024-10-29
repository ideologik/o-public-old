FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --force
COPY . .
ARG BUILD
RUN npm run build-${BUILD}

FROM nginx:alpine AS prod-stage
COPY --from=build /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY localhost.key /usr/share/nginx/
COPY localhost.crt /usr/share/nginx/
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
