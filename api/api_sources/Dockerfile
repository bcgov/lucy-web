FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7

# RUN mkdir -p /opt/app-root/app
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ENV PORT 3001

# RUN set -x \

RUN npm install -g npm

# Create app directory

WORKDIR /opt/app-root/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./ .

RUN npm install
# If you are building your code for production
# RUN npm install --only=production


# Cleaning any existing generated file
RUN rm -rf ./dist-server

# Building App
RUN npm run build

ENV NODE_PATH /opt/app-root/src

RUN ls -a


VOLUME /opt/app-root/src

EXPOSE 3001

CMD ["npm", "run", "deploy_run"]

#ENTRYPOINT [ "npm", "run", "docker_start" ]

#CMD [ "npm", "run", "watch" ]
#ENTRYPOINT /usr/bin/tail -f /dev/null
