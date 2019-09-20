FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7


ENV PORT 3001
ENV HOME /opt/app-root/src/app

# Creating HOME
RUN mkdir -p ${HOME}
RUN chmod 777 ${HOME}
RUN chown -R 1001:1001 ${HOME}
USER 1001

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/app-root/src/app/node_modules/.bin:/opt/app-root/src/app/app.npm-global/bin

# Print NODE Version
#RUN node -v

# Print NPM Version
#RUN npm -v

# Setting Default user
# USER 1001

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

# Setting NODE_PATH
ENV NODE_PATH ${HOME}


# Showing Dir Struct
RUN ls -a

# Allow all user and app to update few folders
RUN chmod 777 ${HOME}/node_modules
RUN mkdir -p ${HOME}/.config
RUN chmod -R 766 ${HOME}/.config

# Application VOLUME
VOLUME ${HOME}

# Application Port
EXPOSE 3001

# Logging in Build Console Build DONE
RUN echo ' --- BUILD SUCCESS: DONE --- '

CMD ["npm", "run", "deploy_run"]
