FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7

# RUN mkdir -p /opt/app-root/app
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ENV PORT 3001

# RUN set -x \

RUN npm install -g npm

# Create app directory

WORKDIR /opt/app-root/src

# Logging in Build Console
RUN echo ' --- BUILD START --- '

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# RUN npm install --only=production
COPY ./package*.json ./

RUN npm install

# If you are building your code for production, copy all files
COPY ./ .

# Cleaning any existing generated file
RUN rm -rf ./dist-server

# Building App
RUN npm run build

ENV NODE_PATH /opt/app-root/src

RUN ls -a


VOLUME /opt/app-root/src

EXPOSE 3001

# Logging in Build Console Build DONE
RUN echo ' --- BUILD SUCCESS: DONE --- '

CMD ["npm", "run", "deploy_run"]
