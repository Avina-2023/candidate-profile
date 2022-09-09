### STAGE 1: Build ###
FROM node:10.20.1 AS build
WORKDIR /usr/src/app
ARG environment
ENV PORT=$environment
RUN echo "Oh dang look at port ${PORT}"

COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/ 
RUN npm install
RUN npm install @types/core-js --save-dev
RUN npm install ng2-charts@2.2.3

COPY . .
#RUN ng serve

#RUN npm run build:${PORT}
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/lxpfrontend /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY ./bundle.crt /etc/ssl/certs/
COPY ./lntiggnite.key /etc/ssl/certs/