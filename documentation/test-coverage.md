# Test Coverage

A complete list of all the major pieces and it's test coverage indicating the items with a decent coverage and the ones that still need more testing to be done

## API
The backend application has an overall test coverage of about ~80%. See the below lists for major pieces with decent coverage and the ones that still need testing. The testing framework Mocha is used in the backend node application and Chai is used as the assertion library

### Components with decent coverage
- ApplicationManager
- Database
  - Models
- Server
  - Modules
  - Core

### Components with some coverage but needs more testing
- AppConfig
  - getEnv
  - getCurrentEnv
  - reportReceivers (update the test case for this method to check that this is not empty, as it would throw internal errors if not specified)
  - certificateUrl
  - sessionLifeTime
- Integrations (wfs service)
  - getLayer
  - getLayerInBoundingBox
- Libs
  - dbMigrator
  - queryCreator
    - _generateFieldDef
    - handleRelationColumn
  - SchemaCSVLoader
    - _validRow
    - sqlString
    - _generateSQL
    - _migrationFileNameForImport
    - _migrationFilePathForImport
    - crateMigrationForCSVImport
    - importMigrationFiles
  - SchemaHelper
    - _genColumnDef
    - _downChangeColumn
    - _genVersionMigration
    - _genVersionRevertMigration
    - _versionFileName
    - _versionRevertMigrationFileName
    - versionMigrationInfo
    - versionRevertMigrationInfo
    - _genInitialSql
    - removeAllMigrationFile
    - versionMigrationFileName
    - versionRevertMigrationFileName
  - SeedRunner
    - checkSeedStatus
    - updateSeedTable
  - Utilities
    - GeoMap
      - calculateBox
      - calculateSquare
    - helpers
      - unWrap
      - unWrapType
      - setNull
      - isEmpty
      - Key
    - JsonUtility
      - flatArrayCSV
      - formattedArrayCSV
      - getHeaderInfo
    - LocationConverter
      - getBCAlbersBoundry
      - getHexRules
      - Intersect
      - getUTMZone
      - getAngleP
      - getNeighbor
    - Mailer
      - sender
      - password
- Database
  - Database schema
    - Observation
      - Animal observation factory
      - Animal observation codes
- Server
  - Modules
    - BC GeoData

### Components with no test cases written

- AppLogger
- Test helpers
- Libs
  - ApplicationTableColumn
  - ApplicationTable
  - BaseDataController
  - BaseSchema
  - SchemaStorage
  - TableExporter

## Web Application

There are unit test cases written for some of the major pieces, however the testing is done only at the top level by making sure that the component is rendered properly without testing the functionality.. Hopefully with Cypress, more test cases are planned to be written focussing the functionality. Karma is being used as the testing framework for the frontend angular application

### Components with some coverage but needs more testing

**Components**:
- Baseform
- Input
  - Checkbox
  - Date picker
  - Date time picker
  - Dropdown
  - Field
  - Mat select
- Navbar
- Routes
  - About
  - Add entry
  - Admin tools
  - Error
  - Herbicide
  - Home
  - Inventory
  - Login
  - Profile
  - Species treated
  - Treatment details
  - User information
- Utilities
  - Add observation modal
  - Alert
  - Diff viewer
  - Map preview
  - Modal
  - Toast
  - User access modal
- Services:
  - bcDataCatalogue
  - bcgw
  - Location service
  - export
  - form
  - Toast
  - Admin
  - Alert
  - Api
  - Chemical treatment
  - Code table
  - Diff
  - Dropdown
  - Dummy
  - Error
  - Loading
  - Mechanical treatment
  - Message
  - Object validator
  - Observation
  - Roles
  - Router
  - SSO
  - User
  - Utility
  - validation
- Directives
  - Clickaway
  - Element Focus
