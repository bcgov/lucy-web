FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7


ENV PORT 3001
ENV HOME /opt/app-root/src

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Print NODE Version
RUN node -v
# Updating NPM
RUN npm install npm@6.0.1 -g

# Print NPM Version
RUN npm -v

# Give Write permission to root
USER 1
RUN chmod a+rw /opt/app-root/src
USER 1001

# Create app directory

WORKDIR ${HOME}

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

ENV NODE_PATH ${HOME}

RUN mkdir ./schemaspy
COPY ./resources/archives/schemaspy.tar.gz ./schemaspy.tar.gz
RUN tar -zxf ./schemaspy.tar.gz -C ./schemaspy
ENV SCHEMASPY_PATH=${HOME}/schemaspy

RUN ls -a


VOLUME ${HOME}

EXPOSE 3001

# Logging in Build Console Build DONE
RUN echo ' --- BUILD SUCCESS: DONE --- '

CMD ["npm", "run", "deploy_run"]
