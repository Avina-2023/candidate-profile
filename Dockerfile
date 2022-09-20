### STAGE 1: Build ###
FROM node:10.20.1 AS build
WORKDIR /usr/src/app

COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/ 
RUN npm install


COPY . .
#RUN ng serve

#RUN npm run build:${PORT}
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/skillsProfile /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
