FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7

RUN mkdir -p /opt/app-root/app
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/app/node_modules/.bin/:/opt/app-root/app/app.npm-global/bin/:/opt/app-root/app/app/bin:/opt/app-root/app/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# RUN set -x \

RUN npm install -g npm

# Create app directory

WORKDIR /opt/app-root/app

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

ENV NODE_PATH /home/nodejs/app/sources


VOLUME /home/nodejs/app

EXPOSE 3001

CMD ["npm", "run", "deploy_run"]

#ENTRYPOINT [ "npm", "run", "docker_start" ]

#CMD [ "npm", "run", "watch" ]
#ENTRYPOINT /usr/bin/tail -f /dev/null
