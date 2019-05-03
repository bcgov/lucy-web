#!/bin/bash
docker-compose -f docker-compose.yml run api python manage.py recreate-db && docker-compose -f docker-compose.yml run api python manage.py seed-db