FROM node:14.21.3

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Print NODE Version
# RUN node -v
# Updating NPM
# RUN npm install npm@6.0.1 -g

# Print NPM Version
# RUN npm -v

# Create app directory

WORKDIR /opt/app-root/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY PACKAGE JSON
COPY ./package*.json ./
RUN npm install @angular/cli@15.1.0

# Copy All the sources
COPY . .

# INSATLL NODE DEPENDENCIES
RUN npm ci
# BUILD APP
RUN npm run build-prod

# RUN Sonar Analysis
# RUN npm run sonar-analysis //TODO: Uncomment this once the sonarqube properties are updated

EXPOSE 3030

# RUN APP
CMD ["npm", "run", "deploy_run"]
