FROM registry.access.redhat.com/rhscl/nodejs-8-rhel7

USER root
RUN mkdir -p /home/nodejs/app
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/home/nodejs/app/node_modules/.bin/:/home/nodejs/app.npm-global/bin/:/home/nodejs/app/bin:/home/nodejs/app/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# RUN set -x \

RUN npm install -g npm

# Create app directory

WORKDIR /home/nodejs/app

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
