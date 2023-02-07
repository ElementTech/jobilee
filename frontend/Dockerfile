### STAGE 1: Build ###
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build -- --configuration production
### STAGE 2: Run ###
FROM nginx:1.23.2-perl
COPY --from=build /usr/src/app/dist/jobilee /usr/share/nginx/html
RUN apt-get update && apt-get install -y gettext-base
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
#-----------------------------------#
# COPY default.conf /etc/nginx/conf.d
COPY nginx.conf.template /etc/nginx
#-----------------------------------#
RUN mkdir /certs
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
