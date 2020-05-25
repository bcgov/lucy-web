
# Schema documentation
The purpose of this document is to capture all the major pieces used in the backend Node application and to serve as a gloassary for all those pieces

----
## Table of contents

* [Folder Structure](#folder-structure)
* [Schema](#schema)
* [Data Controller](#generic-data-model-controller)
* [Route Controller](#route-controller)

----

## Folder structure
The content related to the backend application are placed under the folder `api`. The following is the list of important pieces along with its purpose

- `.docker` - Contains all the docker files for local development
- `.pipeline` - Includes the scripts which are required for the pipeline related activities
- `openshift` - This folder contains the yaml files for all the pods used in the application
- `env_config` - The environment variables required for local development
- `api_sources`
  - `.build` - contains the docker files for local deployment
  - `resources` - Source of truth for all the resources such as csv, json and favicon which are used throughout the app
  - `schema-files` - Directory where all the schema files are stored in yaml format
  - `schema-migration-sql` - Contains all the SQL files needed to be run as a migration for differenct schemas
  - `scripts` - Various scripts each with a different purpose that are used in the application are stored here
  - `source-templates` - A convention is followed in the entire application based on the `ts` templates defined here
  - `sources`
    - `app-constants` - Constants that are used in the application are stored in this folder
    - `AppConfig` - Serves as the source for different configurations used
    - `application-manager` - A piece that holds the state of the application 
    - `Applogger` - Handles the logging for the application
    - `integrations` - External services required by the application
    - `test-helpers` - Includes all the helper functions used for testing
    - `test-resources` - Resources which are required for testing
    - `libs` - Includes various library functions for handling database, models, some utility functions, etc
    - `database` - Contains the database configuration files
      - `__tests__` - A directory for all the test files 
      - `database-schema` - The schema handlers for different schemas are stored in this folder
      - `factory` - Factory files used in testing for different schemas
      - `initial-data` - Contains different data that needs to be seeded initially
      - `migrations` - Includes all the migrations files that are generated so far
      - `models` - A directory that contains the model file and controllers for all the schemas
    - `server`
      - `core` - A folder which has the core functionalities such as middlewares, validators, base controller, etc
      - `initializers` - Contains the application root file and routes
      - `logger` - The root logger class defined in this folder
      - `modules` - Application sub modules are defined in this directory


Inheritance is applied widely in the framework wherever it is possible, the following are the different inheritance structure used in the application

## Schema

Throughout the application, various schemas are being used and all of them will basically extend either one or another common schema class

### BaseSchema
BaseSchema is at the top of the inheritance tree and has the following variables(including static variables) and functions

1. Variables generated from the schema file
  - `shareInstance` - An instance of the schema
  - `table` - Variable which has all the information related to any particular table and it includes the following variables
    - `name` - The name of the table
    - `columnsDefinition` - List of all the columns which also factors in the columns defined in different versions
    - `initialColumns` - The columns that are defined initially and not any columns included in versions
    - `description` - A short description about the table
    - `meta` - Some additional info about the table
    - `layout` - Layout defined in the schema file which will be used by the front end application to determine what and how different fields should be presented
    - `displayLayout` - Display names for different fields
    - `computedFields` - Defines any fields that needs to be computed based off other fields in the table
    - `relations` - All external relations to other tables
    - `modelName` - Name of the model
    - `versions` - Includes all the column updates. For ex, adding/modifying/deleting a column
    - `importOptions` - contains the options to import data through migration. For ex, inserting data for code tables
    - `batchImportOptions` - contains the options to seed the table without a migration, used ideally for large data imports
    - `initialSqlCommands` - List of sql commands that need to be run initially

2. Variables/methods that a subclass should override
  - `csvFieldTransformer` - should return an object for transforming the csv fields
  - `csvData` - subclass must load the csv file and return data
  - `additionalColumns` - specify the columns that need to be added in addition to the columns specified in the schema yaml file
  - `createAuditColumns` - subclass must define the audit fields that need to be added
  - `createDataEntry` - Function to load csv data and generate sql entry commands for each record
  - `migrateFilePath` - define the file path to store the generated sql-migration file
  - `migrationSQL` - return the filename for the generated sql-migration file
  - `defineTable` - to create a new application table
  - `defineJoinTable` - to create a join table association with a table

3. Variables/members common to all the subclasses
  - `timestampColumns` - The timestamp columns to be included in each schema subclass
  - `createMigrationFile` - A function that generates a migration file for the schema
  - `config` - A method that returns the config based on the table schema which will then be used by the front end to display form fields
  - `createTimestampsColumn` - Method used generate timestamp columns to be included the migration file
  - `createComments` - Function to generate comment statements for each field in the table
  - `createTable` - Includes the functionality to generate table creation query statements


### BaseTableSchema
BaseTableSchema extends the BaseSchema and overrides few methods/variables from the BaseSchema

### BaseRecordSchema
The schema files that are generated so far extends either one of the following schemas, new schemas can be introduced if needed in the `api/api_sources/sources/database/database-schema/base.record.schema.ts`

1. RecordTableSchema
The table schemas for which a user will be allowed to do CRUD extends this schema. It adds the following three audit columns to the target schema
  - createdBy
  - updatedBy
  - deletedAt

2. CodeTableSchema
All the static tables where a user will not do any CRUD should extend this schema instead. It adds the following two additional columns to the target schema
  - description
  - activeIndicator

## Generic Data Model Controller
BaseDataModelController implements a list of methods defined in BaseDataController which could be used by the subclasses to perform certain database operations

1. Variables/methods that a subclass should override
  - `connection` - A variable that holds the connection to db
  - `factory` - Variable pointing the schema factory
  - `exportKeyMapper` - Defines the key mapping for export
  - `exportKeyPriorities` - Should return an object specifying the priorities of each field
  - `schemaDataMapper` - a method to process the data and map it to match the schema

2. Variables/methods common to all the subclasses
  - `schema` - Table variable from the BaseSchema
  - `schemaObject` - An instance of a specific schema object
  - `findById` - To find a record by ID
  - `fetchOne` - Find a record matching the query
  - `remove` - Remove a particular record from the table
  - `removeById` - Remove a record by its ID
  - `all` - fetch all the records for a particular table
  - `create` - create a new model object for the entity
  - `saveInDB` - To store a record in the table
  - `random` - fetch a random record from the table
  - `createNewObject` - create a new object and save it in the table
  - `updateObject` - Update an existing record and save it in the table
  - `checkObject` - Validate an object w.r.t corresponding schema
  - `getIdValue` - Get the value of ID field from the object
  - `validate` - Validate the given data
  - `export` - Function to export all the records

### DataModelController
DataModelController extends the BaseModelController and overrides the `connection` method to establish the DB connection using SharedDBManager class. All the other controllers that are specific to each module extends this controller

## Route Controller
A base class that provides common functionality such as handling the response messages, errors and logs. The following are the subclasses which uses the RouteController to perform different things

### BaseRouteController
A controller class which is used by some sub controllers to create an instance of itself and to include all the members and variables declared in the RouteController

### SecureRouteController
A subclass of the BaseRouteController which is used to make certain routes secure that it can only be accessed by users with valid permissions. The following are the different subclasses that extends SecureRouteController

- BaseAdminRouteController - A controller to allow only admin users to access certain routes
- WriterRouteController - Only users with write access are allowed access