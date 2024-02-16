# Invasives Mussels BC - API

This is the application source code for the Restful API of the Invasive Mussels database.

-----

## Table of Contents

1. [Setting Up](#setting-up)
1. [Running the Application](#running-the-application)
1. [Closing the Application](#closing-the-application)
1. [Deployment to OpenShift](#deployment-to-openshift)
1. [Clean Remote Instance of the application](#clean-remote-instance-of-the-application)
1. [Running Tests](#running-tests)
1. [SchemaSpy](#schemaspy)
1. [Database Backup and Restoration](#database-backup-and-restoration)
1. [Cloud Script: Change User role](#cloud-script-change-user-role)

-----

## Setting Up
### Requirements

The default, active branch for this repo is `dev`. All pull requests merged into `dev` will create new `dev` pods in Openshift.

### Setting Up Env

* Make a copy of the example file `env.example` to create a `env.local` file
* Create an empty `.env` file in the root dir `/api`
* Update the app secret values in `env.local` (env.local is `.gitignored` and will not be committed)

## Running the Application

### Run App in Local env

* Run app: `make run-local`
* Debug app: `make local-debug`

### Clean the Local App

Note: the database has a persistent volume when run with Docker. If you need to rebuild this, run `make clean-local`

## Closing the Application

Run `make close-local`

## Deployment to OpenShift

When making a PR against the `dev` branch, any successful merges will automatically start a GitHub Action to build a new instance of the app in the Openshift **Dev** realm.

To deploy to production, you will need to merge your `dev` changes into the `prod` branch. This will start a GitHub action to deploy to production.

## Clean Remote Instance of the application

The clean script can be run against each persistent environment.

`make clean-remote PR={PR_NUM | static deployment name like dev/test/prod} ENV={dev | test | prod}`

*Examples*

* make clean-remote PR=99 ENV=dev
* make clean-remote PR=dev ENV=dev

<span style="color:red;font-weight:bold">Warning: Do NOT run against `test` or `prod`. It will cause PERMANENT deletion of all objects including `PVC`! You've been warned!</span>

## Running Tests

To run tests locally, run `npm test` or `npm test:all` to execute tests via [Mocha](https://www.npmjs.com/package/ts-mocha).

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
