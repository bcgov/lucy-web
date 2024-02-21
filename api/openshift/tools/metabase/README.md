# Metabase

This folder contains the OpenShift templates required in order to build and deploy an instance of Metabase onto OpenShift. These templates were designed with the assumption that you will be building and deploying the Metabase application within the same project. We will be running with the assumption that this Metabase instance will be co-located in the same project as the database it is expecting to poll from.

## Build Metabase

While Metabase does provide a Docker image [here](https://hub.docker.com/r/metabase/metabase), it is not compatible with OpenShift due to the image assuming it has root privileges. Instead, we build a simple Java image based off of Alpine JDK 8 where the metabase application can execute without needing privilege escalation. In order to build a Metabase image in your project, process and create the build config template using the following command (replace anything in angle brackets with the correct value):

``` sh
export BASE_URL="https://raw.githubusercontent.com/bcgov/lucy-web/tree/dev/api/openshift/tools/metabase"
export NAMESPACE=<YOURNAMESPACE>
export METABASE_VERSION=v0.35.3

oc process -n $NAMESPACE -f $BASE_URL/metabase.bc.yaml -p METABASE_VERSION=$METABASE_VERSION -o yaml | oc apply -n $NAMESPACE -f -
```

This will create an ImageStream called `metabase`. This image is built on top of Alpine OpenJDK, and will have Metabase installed on it.

## Deploy Metabase

Once your metabase image has been successfully built, you can then deploy it in your project by using the following command (replace anything in angle brackets with the correct value):

``` sh
export ADMIN_EMAIL=Micheal.W.Wells@gov.bc.ca
export NAMESPACE=<YOURNAMESPACE>

oc process -n $NAMESPACE -f $BASE_URL/metabase.dc.yaml ADMIN_EMAIL=$ADMIN_EMAIL NAMESPACE=$NAMESPACE -o yaml | oc apply -n $NAMESPACE -f -
```

This will create a new Secret, Service, Route, Persistent Volume Claim, and Deployment Configuration. This Deployment Config has liveliness and readiness checks built in, and handles image updates via Recreation strategy. A rolling update cannot work because the H2 database is locked by the old running pod and prevents the newer instance of Metabase from starting up.

## Initial Setup

Once Metabase is up and functional (this will take between 3 to 5 minutes), you will have to do initial setup manually. We suggest you populate the email account and password as whatever the `metabase-secret` secret contains in the `admin-email` and `admin-password` fields respectively. You may be asked to connect to your existing Postgres (or equivalent) database during this time, so you will need to refer to your other secrets or other deployment secrets in order to ensure Metabase can properly connect to it via JDBC connection.

## Notes

In general, Metabase should generally take up very little CPU (<0.01 cores) and float between 700 to 800mb of memory usage during operation. The template has some reasonable requests and limits set for both CPU and Memory, but you may change it should your needs be different. For some more documentation references, you may refer [here](https://github.com/loneil/domo-metabase-viewer/tree/master/docs) for historical templates and tutorials, or inspect the official Metabase documentation [here](https://www.metabase.com/docs/latest/).
