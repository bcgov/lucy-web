# invasives BC - Invasive species management tools (ISMT) - API


This is the application source code for the Restful API of the invasive species database.

-----

## Table of Contents

* [Setting Up](#Setting-Up)
* [Installing Node and NPM](#installing-node-and-npm)
* [Running the Application](#Running-the-Application)
* [Closing the Application](#closing-the-application)
* [Schema documentation](SchemaAndDatabaseController.md)
* [Deployment to OpenShift](#Deployment-to-OpenShift)
* [Clean Remote Instance of the application](#Clean-Remote-Instance-of-the-application)
* [Running Tests and SonarQube Analysis](#Running-Tests-and-SonarQube-Analysis)
* [SchemaSpy](#SchemaSpy)
* [Database Backup and Restoration](#Database-Backup-and-Restoration)
* [Cloud Script: Change User role](#Cloud-Script:-Change-user-role)

-----

## Setting Up
### Requirements

If you wish to use the Makefile commands to run the project with Docker, there are no additional requirements required for local development.

To run locally without Docker, you will need to install Node and NPM.

## Installing Node and NPM

*For Mac OSX:*

1. Install Xcode from the App Store

2. Install Homebrew following the instructions here: https://brew.sh/

3. Install Node (Note: This will also install the Command Line Tools for Xcode)  
`brew install node`

*For Windows:*

1. Select the appropriate installer (32-bit or 64-bit) from here: https://nodejs.org/en/download/

2. Run the installer and follow its prompts

3. Restart your computer

*Validate install:*

You can test your installation by running `node -v` and `npm -v` which should produce output indicating which version has been installed.

### Setting Up Env

* Make a copy of the example file `env.example` to create a `env.local` file
* Create an empty `.env` file in the root dir `/api`
* Update the app secret values in `env.local` (env.local is .gitignored and will not be committed)

## Running the Application

*Run App in Local env*

* Run app: `make run-local`
* Debug app: `make local-debug`

*Clean the Local App*

Note: the database has a persistant volume when run with Docker. If you need to rebuild this, run `make clean-local`

## Closing the Application

Run `make close-local`

## Deployment to OpenShift

Use command `oc` for local OpenShift build and deployment options.

The command `make deploy-remote` may also be run to build and deploy remote containers using our Jenkins pipelines.

## Clean Remote Instance of the application

The clean script can be run against each persistent environment.

`make clean-remote PR={PR_NUM | static deployment name like dev/test/prod} ENV={dev | test | prod}`

*Examples*

* make clean-remote PR=99 ENV=dev
* make clean-remote PR=dev ENV=dev

*Warning*: Do *NOT* run against `test` or `prod`. It will cause *PERMANENT* deletion of all objects including `PVC`! be warned!

## Running Tests and SonarQube Analysis

To run tests locally, run `npm test` or `npm test:all` to execute tests via [Mocha](https://www.npmjs.com/package/ts-mocha).

For local analysis with [SonarQube](https://www.sonarqube.org/), run `make sonarqube`

To run tests and SonarQube analysis against a remote instance, run `make test-remote-api`

## SchemaSpy

To re-generate database documentation using SchemaSpy, run `make schema-spy-run`

## Database Backup and Restoration

 Database backup and restoration is very important aspect of application maintenance and consistency. InvasivesBC application supports automated continuous backup of existing database.
 The backup action is performed by systematic schedular (Cron Job Container) deployed in OpenShift. We used an existing [Schedular Application](https://github.com/BCDevOps/backup-container). Automated backup command is integrated with our Jenkins pipeline. But DevOps can use following tools/techniques to manage backup and restoration of DB.

### Run Backup Manually

  1. Login into OpenShift in terminal app. Change to /api dir.

  2. Run __make remote-backup ENV=#ENV_NAME__

  3. Check number of backup listing __make remote-backup-ls ENV=#ENV_NAME__

### Restore Database

  Please check **Restore** section of README.md of [Schedular Application](https://github.com/BCDevOps/backup-container)

## Cloud Script: Change user role

A cloud script __scripts/admin.ops.ts__ is added.
**Usage Local** :

  1. Shell into api container ( cd /api, make api)

  2. Run __ts-node scripts/admin.ops.ts -e #UserEmail -r #RoleCode__. Options:
    - e | email : User email
    - i | idr : User idr
    - b | bcid : User bcid
    - r | role : User new role (ADM, DAV, DAE, I_OFFICER, I_ADM)  

**Usage Remote** :

    - Open terminal of any remote deployment pod. Then run cmd

    - In terminal login into OpenShift project. Run __oc exec <POD_ID> -c ts-node scripts/admin.ops.ts -e #UserEmail -r #RoleCod__

    - In terminal login into OpenShift project. Shell into remote pod container oc rsh. Then run cmd
