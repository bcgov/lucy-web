# invasives BC - Invasive species management tools (ISMT) - API

This is the application source code for the Restful API of the invasive species database.

-----

## Table of Contents

* [Setting Up](#Setting-Up)
* [Installing Node and NPM](#installing-node-and-npm)
* [Running the Application](#Running-the-Application)
* [Closing the Application](#closing-the-application)
* [Deployment to OpenShift](#Deployment-to-OpenShift)
* [Clean Remote Instance of the application](#Clean-Remote-Instance-of-the-application)
* [Running Tests and SonarQube Analysis](#Running-Tests-and-SonarQube-Analysis)
* [SchemaSpy](#SchemaSpy)
* [Modifying the Database Model & Schema](#Modifying-the-Database-Model--Schema)
* [Database Backup and Restoration](#Database-Backup-and-Restoration)

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

## Modifying the Database Model & Schema

To create a new database schema (or to update an existing schema), follow these steps:

1. **Create/modify the .yaml file for the schema.** The .yaml file should specify all the columns (both raw data and relational data) that will be inserted into the database table for the schema. This file is also used to indicate which other tables the schema references.
  * If modifying an existing schema, the .yaml file can be located inside the [api/api_sources/schema-files](https://github.com/bcgov/lucy-web/tree/dev/api/api_sources/schema-files) directory
  * To create a new schema, you can begin with a template by running the command `ts-node scripts/create.schema.ts -s <SchemaName>` from within the "api/api_sources" directory. This generates a bare-bones .yaml file with the desired schema name, and places it inside the correct directory.   
    * If you haven't already, this step will require you to install [ts-node](https://www.npmjs.com/package/ts-node) by running `npm install ts-node -g`  
    * If your schema references other schemas, there are two ways to indicate this in the .yaml file. Either method can be used:
      * `includes:` specifies the dependent schema's .yaml filename
      * `externalTables:` specifies the name of the schema's table in the database   
    * The following code block is required in the .yaml file if you want to auto-generate a controller for the schema (step 3).
    ```yaml
    meta:
        resource: true
    ```

2. **Create/update the Handler class for the schema.** The purpose of this handler is to match the schema class (as it is named in our Typescript code) to the schema's .yaml file created in step 1. This is done very simply by using the `getYAMLFilePath()` method, and passing the name of the schema's .yaml file. The handler class should extend `RecordTableSchema` if the schema is for a record that will be created by the user; if the schema is for a code table, the handler class should extend `CodeTableSchema`.

  * If modifying an existing schema, the handler class for the schema can be found inside the [api/api_sources/sources/database/database-schema](https://github.com/bcgov/lucy-web/tree/dev/api/api_sources/sources/database/database-schema) directory.
  * If creating a new schema, create a new file within the above directory, or simply append the handler class to an existing file within the directory.
  * If the schema class is being used to import data from a data file, the schema class requires an additional function:
  ```typescript
  get hasDefaultValues(): boolean {
        return true;
  }
  ```

3. **Create a model and an SQL file for the schema.**
  * If creating a new schema, first create a new (empty) sub-directory inside the "api/api_sources/schema-migration-sql/" directory. This sub-directory must exactly match the name you've assigned to the schema.
  * From within the "api/api_sources" directory, run the command `ts-node scripts/schema.manager.ts -s <SchemaName> -m`.
  * The schema-manager script will generate an SQL file inside the "api/api_sources/schema-migration-sql/<SchemaName>" directory with the code to create and configure the schema's table in the database. The schema-manager script also generates a Typescript file inside "api/api_sources/sources/database/models/". In some cases, this generated Typescript file may benefit from re-factoring (typically, it contains some unnecessary imports).
  * Add the generated controller and model to the list of exports in [api/api_sources/sources/database/models/index.ts](https://github.com/bcgov/lucy-web/blob/INS-623-ChemicalApplicationSchema/api/api_sources/sources/database/models/index.ts).


4. **If importing data from a CSV or other data file, add the import entry in the .yaml file for the schema, then run the schema-manager script again.** Otherwise, you can skip this step.

  * The import entry is specified by adding the following codeblock at the first child level within the schema.

  ```yaml
  imports:
    init:
      fileName: <filename>.csv
      allColumns: true
  ```
  * The `allColumns` key indicates that all columns in the CSV file should be imported into the schema. Alternatively, you can use the `entryColumns` key and specify which columns should be selected from the data file for import.
  * Running the schema-manager script won't duplicate files that have already been created, but will create a new SQL file that inserts the CSV data into the schema's table in the database.


5. **Run the typeorm migration creation script.**

  * If not already, shell into the Docker container for the backend.
  * If you are creating a new schema, you *must* create a new empty directory named after the name of your new schema, and place it within the [api/api_sources/schema-migration-sql](https://github.com/bcgov/lucy-web/tree/INS-623-ChemicalApplicationSchema/api/api_sources/schema-migration-sql) directory. If you skip this step, the migration script in the next step will fail with a "File Not Found" error.
  * Execute command `typeorm migration:create -n <nameOfMigrationFile>`. This script generates a migration SQL file, which creates or alters the database table for your schema. It also generates a template for a Typescript file with the same name in [api/api_sources/database/migrations](https://github.com/bcgov/lucy-web/tree/INS-623-ChemicalApplicationSchema/api/api_sources/sources/database/migrations).

    Your chosen name of the migration file (both the SQL file and the Typescript file) will be prefixed with a string of digits, representing the timestamp for the creation of the file. This is in accordance with TypeORM's naming convention for creating migration files, and is used to indicate which order the migration files should be run in.

    This Typescript file requires some minor modifications:
    * the class should extend AppDBMigrator
    * declare an instance of the schema within the class
    * override the `setup()` method; if creating a new schema, within the setup() method create an instance of the schema and add the init version of the schema to the migrator using `this.addSchemaInitVersion(this.<SchemaName>);`. If also migrating a data file into the schema, add another line to the setup() method with `this.addDataImportMigration(this.<SchemaName>, 'init');
`. If modifying an existing schema, add the updated version of the schema using `   this.addSchemaVersion(this.schema, <versionName>);`. The version name used here must match the version name as specified in the .yaml file for the schema
    * complete the `up()` and `down()` methods to specify the desired process for upgrading and downgrading the schema in the database
  * Add the revised migration file and link it to the schema.


6. **Run the migration script to update the database schema.**

  * If not already, shell into the Docker container for the backend.
  * Execute the command `npm run migration`. If any errors occur, you can view the debug log for the script by running the command `npm DB_LOG=yes run migration`


7. **Write unit tests for the schema.** Unit tests for the schemas and controllers are located within the [api/api_sources/sources/database/\_\_tests\_\_](https://github.com/bcgov/lucy-web/tree/INS-623-ChemicalApplicationSchema/api/api_sources/sources/database/__tests__) directory. Here are some tips for writing unit tests:

  * remember to write a unit test to assert that the schema's table you just created/modified can be fetched from the database
  * to randomly select an element from a table with pre-populated data in it, use `<controllerName>.shared.random()`
  * the `ModelSpecFactory` can be used to create an instance of a dependent object that is required to test the target object
  * to run the unit tests:
    * make sure you have re-built the backend code (`make local-debug`),
    * then shell into the Docker container for the backend,
    * then run `npm run test:all` to run all unit test files, or `npm test sources/database/__tests__/<filename>.spec.ts` to only run the unit tests located in one specific file.

## Database Backup and Restoration

 Database backup and restoration is very important aspect of application maintenance and consistency. InvasivesBC application supports automated continuous backup of existing database.
 The backup action is performed by systematic schedular (Cron Job Container) deployed in OpenShift. We used an existing [Schedular Application](https://github.com/BCDevOps/backup-container). Automated backup command is integrated with our Jenkins pipeline. But DevOps can use following tools/techniques to manage backup and restoration of DB.

### Run Backup Manually

  1. Login into OpenShift in terminal app. Change to /api dir.

  2. Run __make remote-backup ENV=#ENV_NAME__

  3. Check number of backup listing __make remote-backup-ls ENV=#ENV_NAME__

### Restore Database

  Please check **Restore** section of README.md of [Schedular Application](https://github.com/BCDevOps/backup-container)
