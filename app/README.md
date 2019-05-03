
Web application for LUCY:  
Inventory and database repository for the creation, treatment, and report on BC Invasive plants and animals.

## About
This application consists of:
* An Angular single page application
* A Flask API
* A PostgreSQL database
* nginx reverse proxy
* Docker-compose

## Prerequisites

You must have either Docker with Docker-compose or, for local develoment, Node and NPM installed.

### Installing Docker

*For Mac OSX:*

1. Follow the instructions here: https://docs.docker.com/docker-for-mac/install/

*For Windows:*

1. Follow the instructions here: https://docs.docker.com/docker-for-windows/install/

### Installing Docker-compose

In most cases, Docker-compose is included with the Docker desktop install. However there are some exceptions such as if you are running Linux. You can check here whether you will require an additional step to install Docker-compose:

https://docs.docker.com/compose/install/

### Installing Node and NPM

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

## Setting up the application
To run the full application you will need to:
1. Clone the repo

## Running the application (Mac OSX, Linux, Unix)
At the project root:  
1. Build the images and run application:  
`sh build.sh [ -c || --clean to clean ]`
2. Create and seed the database with test data:  
`sh setup_api.sh`

## Running the application (Windows)
At the project root, run the following:
1. Build the images:  
`docker-compose build`
2. Create the development database:  
`docker-compose -f docker-compose.yml run api python manage.py recreate-db`
3. Seed the database with test data:  
`docker-compose -f docker-compose.yml run api python manage.py seed-db`
4. Run all containers:  
`docker-compose up -d`

## Running the frontend in isolation (local development)

To run the Angular Client alone, you will need to:
1. `cd AngularApp`
2. Install the dependencies by running `npm install`
3. Start the server with `npm start`

## Running tests

*Flask API*

The Flask API tests do not require Python installed because may be run via Docker-compose once the images have been built.

1. `sh build.sh`
2. `docker-compose -f docker-compose.yml run api python manage.py test`

*Angular Client*

1. Change to ./AngularApp directory in terminal
2. Run `npm install`
3. Run `npm test`

## Viewing the application

The application will be available at http://localhost/

API endpoints will be available at:
* http://localhost/api/v1/users (POST only)
* http://localhost/api/v1/categories
* http://localhost/api/v1/species
* http://localhost/api/v1/species/\<id>

All endpoints except /users require authentication. Pass a Google Auth token in the header to view the contents.

Users are not visible in the API, but you can see what’s happening in the database with:

1. `docker-compose -f docker-compose.yml exec db psql -U postgres`
2. `\c db_dev`

## Killing the application

1. On the command line, press CTRL + C
2. If you are not on Windows you may run `sh stop.sh` or, for all systems, `docker-compose down -v`

## Design notes

* Categories are preloaded in the database and there is no API support for adding new categories. Requests referencing categories that are not already in the database will be rejected.
* There are no uniqueness constraints on species, e.g. we do not constrain the system to a single entry per Latin name
* The ID of a species is internal and may not be changed via the API. We do not validate the ID in the request body for a PUT to /api/v1/species/\<id>, we consider only the ID perovided in the URL.