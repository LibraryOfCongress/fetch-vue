# develop stage
FROM node:18-alpine as develop-stage

WORKDIR /app

COPY package*.json ./

RUN npm -g install @quasar/cli

COPY . .

# build stage
FROM develop-stage as build-stage

RUN npm install

# if you need to change env reference just change the "ENVIRONMENT=STRING"
RUN ENVIRONMENT=dev quasar build -m pwa

# production stage
FROM nginx:1.17.5-alpine as production-stage

COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
