# Dockerfile for client application
# Stage: 0 => Comipling and buildin g the app
FROM node:9 

# Creating WORKDIR
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copying package json to root
COPY package*.json ./

# Installing dependency
RUN npm install

# Copy all sources to root
COPY ./ .

# Configuration for prod
#ARG configuration=production

# Build App
RUN npm run build

VOLUME /usr/app/dist/www

EXPOSE 3030

#ENTRYPOINT /usr/bin/tail -f /dev/null
ENTRYPOINT ["npm", "start"]

# Stage: 1 => Deploying in nginx
#FROM nginx:1.13.3-alpine as production

# Copy file from buid stage
#COPY --from=build usr/app/dist/www/ /usr/share/nginx/html

# Expose Port
#EXPOSE 80

#ENTRYPOINT ["nginx", "-g", "daemon off;"]
