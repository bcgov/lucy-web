FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Print NODE Version
RUN node -v
USER 0
# Updating NPM
RUN npm install npm@6.0.1 -g
USER 1001

# Print NPM Version
RUN npm -v

# Create app directory

WORKDIR /opt/app-root/src

# Logging in Build Console
RUN echo ' --- BUILD START --- '

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY PACKAGE JSON
COPY ./package*.json ./

# INSATLL NODE DEPENDENCIES
RUN npm install

# Copy All the sources
COPY ./ .

# BUILD APP
RUN npm run build

# Logging in Build Console Build DONE
RUN echo ' --- BUILD SUCCESS: [DONE] --- '

EXPOSE 3030

# RUN APP
CMD ["npm", "run", "deploy_start"]
