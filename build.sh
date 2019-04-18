#!/bin/bash
if [ $1 == "-c" -o $1 == '--clean' ] 
then
    echo '*** Cleaning & Building App ***' && 
    docker-compose down -v
else
    echo '*** Building & Running App ***'
fi
docker-compose build && docker-compose up -d
