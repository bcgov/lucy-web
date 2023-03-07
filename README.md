# Invasive Species BC




[![img](https://img.shields.io/badge/Lifecycle-Dormant-ff7f2a)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
Note:  In progress of being deprecated by /bcgov/invasivesbc.  API still supports /bcgov/mussels-ios

https://bcdevexchange.org/projects/prj-invasive-species

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=bcgov_lucy-web&metric=alert_status)](https://sonarcloud.io/dashboard?id=bcgov_lucy-web) ![ZAP Baseline Scan](https://github.com/bcgov/lucy-web/workflows/ZAP%20Baseline%20Scan/badge.svg)

## Introduction

Invasive species are non-native plants and animals whose introduction and spread in British Columbia cause significant economic, social or environmental damage. This application tracks the observation, treatment, and monitoring of invasive species in the Province of British Columbia.
This project is part of the Species and Ecosystems Information System Modernization (SEISM) program.

## Table of Contents

1. [Project Status](#project-status)
1. [Audience](#audience)
1. [Features](#features)
1. [Getting Help or Reporting an Issue](#getting-help-or-reporting-an-issue)
1. [How to Contribute](#how-to-contribute)
1. [Architecture](#architecture)
1. [Project Structure](#project-structure)
1. [Documentation](#documentation)
1. [Requirements](#requirements)
1. [Setup Instructions](#setup-instructions)
1. [Running the Application](#running-the-application)
1. [License](#license)

## Project Status

This application is in active development and has not yet been released.

## Audience

Anyone with a valid IDIR or BCeID login may access the application to view data that is being tracked.

In addition, the application is intended for use by:

* Surveyors who observe and record the absence, presence, and spread of invasive species
* Subject matter experts who perform a variety of duties, including to record and analyze data and create action plans
* Contractors who implement recommended treatments for observed invasive species
* Administrators who manage the application and its users

## Features

This application is anticipated to include the following main features:

1. Support for IDIR and BCeID access
1. User roles and permissions management
1. Interactive maps displaying multiple data layers
1. Observations of invasive species absence/presence
1. Recommendations, planning, and application records of treatments
1. Monitoring of treatment outcomes
1. Query and export of data
1. Auditing and reports
1. Bulk data entry and mobile device data entry

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/lucy-web/issues).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## Architecture

This application uses PostgreSQL (with PostGIS), TypeORM, and Angular. Containers are built using Jenkins pipelines and Docker. Our environments run on an OpenShift container platform cluster.

## Project Structure

    .config/                   - Whole application configuration
    .jenkins/                  - Jenkins build config
    .storybook/                - Storybook tests for the client
    .vscode/                   - IDE config for Visual Studio Code
    api/                       - TypeORM API codebase
    └── openshift              - OpenShift deployment specific files
    └── openshift/tools        - Files related to tools such as SchemaSpy
    app/                       - Angular Client Application codebase
    └── openshift              - OpenShift deployment specific files
    CODE-OF-CONDUCT.md         - Code of Conduct
    loadTest                   - Load test application
    CONTRIBUTING.md            - Contributing Guidelines
    LICENSE                    - License

## Documentation

* [Client Readme](app/README.md)
* [Server Readme](api/README.md)
* [Form Framework Tool Readme](FormFrameworkREADME.md)
* [Jenkins Readme](.jenkins/README.md)
* [Pipeline](PIPELINE.md)
* Our database is documented using [SchemaSpy](http://schemaspy.org/)
* [Load Test](loadTest/README.md)

## Requirements

* [Docker](https://store.docker.com/search?type=edition&offering=community) installed.
* The ability to run Makefile commands, using a command line tool such as [GMAKE](https://www.gnu.org/software/make/)

On Windows, you may require a tool like [Visual Studio Code](https://code.visualstudio.com/) or [Cygwin](http://www.cygwin.com/) in order to use the Makefile.

If you wish to deploy the application, you will also need to install [OpenShift CLI](https://docs.openshift.com/container-platform/3.7/cli_reference/get_started_cli.html).

## Setup Instructions

Begin by cloning the repository to create a local copy. The repository on GitHub provides instructions: https://github.com/bcgov/lucy-web

All subsequent commands are run at the project root.

For example:

`git clone https://github.com/bcgov/lucy-web`

`cd lucy-web`

Finally, create initial local environment files:

1. Create an empty `.env` file at the `api` directory root
1. Within `api/env_config` create a `env.local` file, using `env.example` as a reference
1. Update the app secret values in `env.local`

Note: these files are git-ignored.

## Running the Application

*Using Docker:*

The client (frontend app) and server(s) (backend api/api-mobile) of the application run in separate containers. To run all of the application containers, use the following commands:

* Run the appliation containers  
`make local`

* Run the application containers in debug mode  
   `make local-debug`  
   This will print additional logging statements to the console, which may be useful when debugging the backend.  

* Close and clean the application containers  
   `make clean-local`  
   This will close and remove the containers and images created by either of the above commands.

   _Note: See the `Makefile` for the full list of commands._ 

To run a subset of the application contains, refer to the `README` and `Makefile` in their respective sub-folders (ie: `./api` or `./api-mobile`).

## Acknowledgements

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/dashboard?id=bcgov_lucy-web)

## License

    Copyright 2019 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
