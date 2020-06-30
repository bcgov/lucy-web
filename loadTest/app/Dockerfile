FROM node:10

ENV HOME /opt/app-root/src/app

USER 0
RUN mkdir -p ${HOME}
RUN chmod -R 777 ${HOME}
RUN chown -R 1001 ${HOME}

USER 1001

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/app-root/src/app/node_modules/.bin:/opt/app-root/src/app/app.npm-global/bin

WORKDIR ${HOME}

COPY ./package*.json ./

RUN npm ci

# If you are building your code for production, copy all files
COPY ./ .


# Setting NODE_PATH
ENV NODE_PATH ${HOME}/node_modules

ENTRYPOINT /usr/bin/tail -f /dev/null