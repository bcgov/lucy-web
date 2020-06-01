# Major pieces
This document covers all the different major pieces in web application, API, pipeline and inspect app

## API
The root of the application lives under the folder `api/api_sources/sources` and it includes major pieces such as bootstrapping the application, handling different routes, database configuration, etc. The following is the complete list of all the major components in the application,

- AppConfig - Contains all the configurations which are required by various parts of the application
- ApplicationManager - Maintains the state of the application
- AppLogger - A helper class for handling different logs
- Integrations - Includes all the third party integration services such as the WFS service, etc.
- Test helpers and resources - Provides the helper functions and the resources that are required for the testing
- Libs - Libs is a collection of reusable and basic application functionality for handling database, models
  1. The core database functions all the major components such as the BaseSchema, DBMigrator, Table Exporter etc
  2. The transformer included the common transformers for different DB data types
  3. The utilities folder includes several helper classes such as GeoMap, LocationConverter, logger, date utilities etc
- Database - The database folder contains application-specific database elements
  1. The database-schema folder defines the schema handlers for all the schemas which will be used for the following,
      * Create/Update SQL query creation for managing database tables.
      * Generate and link the ORM model with the database table.
      * Generate the test objects. i.e configure the model factory.
      * Generate express api validation of resource CRUD operation request object
  2. The factory contains all the model factories used in testing the application
  3. Initial-data contains the data that needs to be loaded into the database initially
  4. All the database migrations are kept in the migrations folder
  5. The models folder includes both the model and controller for all the schemas
- Server - Includes the logic such as bootstrapping the application, initializing different modules and their corresponding routes, etc
  1. The core folder has the core functionalities such as middlewares, validators, base controller, etc
  2. The initializer contains the root application and the basic routes used in the application
  3. The root logger is defined in the logger folder
  4. Each module is a feature and are stored in the modules folder. See below for the complete list of features
  Apart from these, some other significant features which are kept under the `api/api_sources` folder are as follows,
- schema-files - The collection of yaml files for different schemas used in the system
- schema-migration-sql - The SQL files that are used in the migrations are stored in this folder
- scripts - Contains all the major scripts used in the system such as generating schema from a yaml file, handling migration, seed database, etc.

### List of features
- Authentication
  - Middleware
  - Session handling
  - Role-based authentication
- Logger
- Database
  - Migrations
  - Seeder
- Base  controller
  - CRUD
  - Export
  - Search/Filter
- Testing
  - Model factory
    - Generic
    - Schema-specific
- Integrations
  - Wells data
  - WFS service
- Modules
  - Observation
    - Plant
    - Animal
  - Treatment
    - Mechanical
    - Chemical
  - Monitor
    - Mechanical
    - Chemical
  - BC GeoData
  - Mussel
    - Watercraft Risk Assessment
    - Watercraft Journey
    - Workflow
  - Location
  - Request Access
- Processing YAML to generate
  - Model
  - Controller
  - SQL Data

## Pipeline

- `.pipeline` - this folder contains the building blocks of pipeline action items. 
  - The libs folder inside the pipeline folder contains the necessary scripts to run a particular pod in OpenShift. 
  - The package.json file contains the scripts which basically just pass the required values to the script in the libs folder
- `openshift` - contains the different pods and its configurations

## Web Application
The web application lives under the folder `app/lucy/src/app`, the following is the list of all significant pieces in the angular application

- Components - All the basic components used in the application such as the form framework components, input fields, and some utility components such as modal, toast, etc
- Services - Includes all the major services used across the application such as the login, wells data and some helpers such as Location converter, validation, etc
- Directives - Contains all the directives used in the application such as the click-away directive and element focus directive
- Libraries - Additionally, some third party libraries are also for different purposes
  - Styling - NgBootstrap, Angular material
  - Map - Leaflet
  - Time utilities - Moment
  - Animation - Lottie
- Testing - Karma framework is being used for testing several parts of the application

### List of features
- Login
  - IDIR
  - BCeID
  - Initial login confirm details
- Profile page
  - Request for elevated access (Data viewer)
  - View basic information
- About page
  - Basic information about the web app and contacts
- Admin page
  - Respond to access requests
  - List of all users and access requests
  - Modify the access level of users
  - Export inspect data
- Inventory page
  - View the list of all observations
    - Table
    - Map
  - Export the observations
    - CSV
  - Basic search
- Add entry page
  - Create/View/Edit/Review different records
  - Record types
    - Observation
      - Plant
      - Animal
    - Treatment
      - Mechanical
      - Chemical
    - Monitor
      - Mechanical
      - Chemical

## Inspect App

### List of Features:
- Login with IDIR
- Login with BCeID
- Initial Data Sync
- Home Screen - List of Inspections by Conservation Officer logged in
- Shift Overview
- Start New Shift Modal
- Watercraft Risk Assessment:
  - Passport (y/n) Screen
  - Passport (n) > Full inspection
  - Passport (y) Assessment Information
  - Passport (y) "Boat launched within 30 days outside of BC" (y) trigger full inspection
  - Full inspection - High Risk Inspection fields trigger High Risk Modal and Form
  - High Risk Assessment Modal
  - High Risk Assessment Form
- End of Shift Screen


