#!/bin/sh

: ${MONGO_HOST:=mongo}
: ${MONGO_PORT:=27017}

until nc -z -n $MONGO_HOST -p $MONGO_PORT
do
    echo "Waiting for Mongo ($MONGO_HOST:$MONGO_PORT) to start..."
    sleep 0.5
done

>&2 echo "Mongo is up - executing command"
exec $cmd