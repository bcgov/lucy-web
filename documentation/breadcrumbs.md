# BreadCrumbs

A list of all the major pieces which can be used as a reference to identify the pieces that were planned to be developed but are either partially done or not done yet

## Web application
- Login/Logout
  - Business BCeID
  - Fix bug where users can’t log out of app
- Add entry
  - Observation
    - Add treatments from the view page
    - All fields are currently set to required - some of these need to be made optional
    - Animal Observation
    - Follow up treatment
    - Follow up monitoring
  - Treatment
    - Creation of new species (when the species is not listed)
    - Filtering observations based on location
    - View/Edit
    - Chemical
    - Implement herbicide mix calculations
  - Monitoring
    - Filtering observations based on location
    - Chemical Monitoring
    - View/Edit
  - Biological records
  - Deletion of records
  - Upload data file
  - Add statuses indicating user action for all records i.e, Needs treatment/Needs Monitoring etc
  - Location
    - Pick points/polygon from the map rather than typing the coordinates
    - Edit waypoint geometry points directly on the map
    - Display plots (rectangles) and circles on map
    - Implement multi-point selection & display on map
    - Update dropdown list of geometry capture method options
    - Implement ability to add any data layer from the BC Data Warehouse and add it to the map with a custom-selected colour
    - At bottom of map-preview component, list all wells within a 30m radius of the selected point, not just the nearest well
    - Address conversion bug that appears when navigating between UTM and lat/long coordinate input
- View database
  - Advanced search
    - Filter section
      - Web view
      - Mobile view (should be a modal)
    - Metabase implementation
    - Queries (save/load)
    - Backend integration
  - Observations
    - Toggle between plant and animal observation
    - Navigation from observation page to different treatment and monitor sections
  - Export
    - .kml format
- Workflow
  - Implement UI changes based on workflow identified by UX research
- Profile page
  - Show information about the logged in user
  - Information management
- Admin tools
  - Delete user account
  - Change account status (active/inactive)
  - Implement ability of admins to update certain code tables/dropdown lists (e.g., treatment contractors, herbicides, etc.)

## API
- Treatment
  - Animal
  - Biological
- Monitoring
  - Chemical
  - Animal
  - Biological
- Record deletion (hard deletion - once a record is deleted it is irretrievable)
- Add statuses to each record indicating the follow up
- Upload record from data file
- Advanced search
  - Queries
  - A new table to store queries saved by each user
- PostGIS integration
- User
  - Delete account
  - Modify account status  

## Pipeline
The pipeline is a task management and scheduling application. The main purpose of this is to run continuous integration and deployment process. 

For the behavioral aspect of the pipeline application, please check (here)[https://github.com/bcgov/lucy-web/blob/dev/PIPELINE.md].

The application source code resides in /api/.pipeline (api, db and tools)and /app/.pipeline (app) directory. 

### Various Features of the application
- Build API (Build API Image in OpenShift Tool Namespace)
- Build APP (Build APP Image in OpenShift Tool Namespace)
- Build Tools (Schemaspy, DB Backup tools in OpenShift Tool Namespace)
- Pull DB image (To OpenShift Tool Namespace)
- Run DB Backup (All ENV)
- Deploy DB (All ENV)
- Setup DB (Run DB migration process) (All ENV)
- Seed DB (For Test and Dev Env) 
- Test API (Dev Only)
- Deploy API (All ENV)
- Deploy APP (All ENV)
- Deploy Tools (All ENV)
