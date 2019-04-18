FROM nginx:1.15.0-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

RUN rm /etc/nginx/conf.d/default.conf
COPY /dev.conf /etc/nginx/conf.d


