# Base image
FROM python:3.6.5-alpine

# Install dependencies
RUN apk update && \
    apk add --virtual build-deps gcc python-dev musl-dev && \
    apk add postgresql-dev && \
    apk add netcat-openbsd

# Set working directory
RUN mkdir /usr/app
WORKDIR /usr/app

# Add and install requirements
COPY ./requirements.txt /usr/app/requirements.txt
RUN pip install -r requirements.txt

# Add entrypoint.sh
COPY ./entrypoint.sh /usr/app/entrypoint.sh
RUN chmod +x /usr/app/entrypoint.sh

# Add app
COPY . /usr/app

# Run server
CMD ["/usr/app/entrypoint.sh"]