FROM ubuntu:16.04

MAINTAINER Pushan Mitra <pushan@freshworks.io>


#
#--------------------------------------------------------------------------
# Software's Installation
#--------------------------------------------------------------------------
#

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --allow-downgrades --allow-remove-essential \
    --allow-change-held-packages \
    ftp \
    curl \
    vim \
    nano \
    git \
    iputils-ping \
    wget \
    && apt-get clean

# Installing NVM and Node.js
ENV VERSION 0.2
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.9.0
# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
# Set up our PATH correctly so we don't have to long-reference npm, node, &c.
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH  $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Creating Working Dir
RUN mkdir -p /opt/app
# Setting Working Dir
WORKDIR /opt/app
# Creating Vloume
VOLUME /opt/app

# INSTALL TYPE ORM
RUN npm install typeorm -g -d -y
# INSTALL JEST
RUN npm install jest -g -d -y

ENTRYPOINT /usr/bin/tail -f /dev/null