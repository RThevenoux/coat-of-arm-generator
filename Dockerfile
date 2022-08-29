# Build env
FROM node:16 as build

WORKDIR /usr/app
COPY package*.json ./ 
RUN npm i
COPY ./ ./
RUN npm run build

# Prod env
FROM httpd:2.4
COPY --from=build /usr/app/dist/ /usr/local/apache2/htdocs/
EXPOSE 80