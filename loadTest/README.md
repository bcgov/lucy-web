# Invasives BC Load Test

The __/loadTest__ directory under root contains all resources and source code files for Invasives BC load test application. This application provides systematic load to InvasivesBC api and app server. We used [Artillery.io](https://artillery.io/) as load test framework.

## Project Structure

    .pipeline           - Load test OpenShift build and deployment codes.
    app/                - Load test application folder
    └── Makefiele       - All make commands to run the load tests
    └── tests           - All load test related sources
    └── tests/api.yml   - Artillery test config files
    openshift           - OpenShift build, pod and jobs template.
    Makefile            - OpenShift and local env setup related make commands.

## Local Setup

1. Run **__make setup-local__**

2. Create .env file in __/app__ dir.

3. Copy content of env.example to .env file with appropriate values.

    ```java
        # Remote User Name and password
        TEST_USER=#NAME
        PASSWORD=#PWD
        # Keycloak auth details
        AUTH_URL=https://dev.loginproxy.gov.bc.ca/auth/realms
        REALM=standard
        CLIENT_ID=inspect-bc-mussels-4817
    ```

## Run test locally

1. Change to app dir.

2. Run api related load test: **__ make load-test-api-read D=10 R=10 TEST_URL=/observation/export __**
    - D: Duration of the load test in sec.
    - R: Rate, number of request per second.
    - TEST_URL: The relative API url path

3. Run front end related load Test: **__ make load-test-app D=10 R=10 __**

## Run remotely in OpenShift

1. Rum commands to build the the image.
   **__ make build-remote BRANCH=# GIT BUILD BRANCH NAME__**

2. Deploy pod
   **__ make deploy-remote ENV=#OpenShift Env (build, dev, test) BRANCH=#GIT BUILD BRANCH NAME __**

3. Shell into pod
   **__ make load-app PROJECT=#PROJECT/env NAME(7068ad-tools, 7068ad-dev) __**

4. Deploy job
   **__ make deploy-job ENV=#OpenShift Project env (build, dev) BRANCH=#GIT BUILD BRANCH NAME __**

## Reference

[Artillery documentation](https://artillery.io/docs/)
