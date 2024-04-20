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
RUN ENVIRONMENT=local quasar build

# production stage
FROM nginx:1.17.5-alpine as production-stage

COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/local.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
