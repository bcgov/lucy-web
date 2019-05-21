FROM centos/postgresql-95-centos7

COPY ./create_postgis.sql /docker-entrypoint-initdb.d/postgis.sql

EXPOSE 5432
CMD ["postgres"]