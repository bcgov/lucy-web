# Invasive Mussels BC

This API currently supports the [Invasives Mussels BC iOS app](https://github.com/bcgov/invasivesBC-mussels-iOS/tree/inspect-272-update-readme) only. A new InvasivesBC inventory and database for the creation, treatment, and report on BC Invasive plants and animals can be found [here](https://github.com/bcgov/invasivesbc).

## Introduction

Invasive species are non-native plants and animals whose introduction and spread in British Columbia cause significant economic, social or environmental damage. This application tracks the observation, treatment, and monitoring of invasive Quagga and Zebra mussels in the Province of British Columbia.
This project is part of the Species and Ecosystems Information System Modernization (SEISM) program.

## Table of Contents

1. [Audience](#audience)
1. [Getting Help or Reporting an Issue](#getting-help-or-reporting-an-issue)
1. [How to Contribute](#how-to-contribute)
1. [Architecture](#architecture)
1. [Project Structure](#project-structure)
1. [Documentation](#documentation)
1. [Requirements](#requirements)
1. [Setup Instructions](#setup-instructions)
1. [Running the Application](#running-the-application)
1. [License](#license)

## Audience

This API is intended to be used by the Inspect iOS app where Inspection Officers and Admins can submit Shifts and Watercraft Inspections. Users with a valid IDIR can login to the Inspect iOS app, but only users with the following roles can access and submit data:
- `inspectAppOfficer`
- `inspectAppAdmin`
- `admin`

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/lucy-web/issues) or contact the [Sustainment Team](mailto:sustainment.team@gov.bc.ca).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## Architecture

This application uses PostgreSQL (with PostGIS) and TypeORM. Containers are built using Jenkins pipelines and Docker. Our environments run on an OpenShift container platform cluster.

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

* [Client README](app/README.md)
* [Server README](api/README.md)
* [Form Framework Tool README](FormFrameworkREADME.md)
* [Migrations Demo README](MigrationsREADME.md)
* [Jenkins README](.jenkins/README.md)
* [Pipeline](PIPELINE.md)
* Our database is documented using [SchemaSpy](http://schemaspy.org/)
* [Load Test](loadTest/README.md)

## Requirements

* [Docker](https://store.docker.com/search?type=edition&offering=community) installed.
* The ability to run Makefile commands, using a command line tool such as [GMAKE](https://www.gnu.org/software/make/)

On Windows, you may require a tool like [Visual Studio Code](https://code.visualstudio.com/) or [Cygwin](http://www.cygwin.com/) in order to use the Makefile.

## Setup Instructions

Begin by cloning the repository to create a local copy.

```
git clone git@github.com:bcgov/lucy-web.git
```
> *Note: the default branch is* `dev` - *more information about [branches and deployment here](api/README.md#deployment-to-openshift)*


Create initial local environment files:

1. Create an empty `.env` file at the `api` directory root
1. Within `api/env_config` create a `env.local` file, using `env.example` as a reference
1. Update the app secret values in `env.local`

Note: these files are `.gitignored`.

## Running the Application

*Using Docker:*

To run all of the backend containers, use the following commands:

1. `cd` into the `api` directory

2. Run the application containers  

```
make local
```

or run the application containers in debug mode 

```
make local-debug
```

This will print additional logging statements to the console, which may be useful when debugging the backend.  

## Closing the Application

To close and clean the application containers  
```
make clean-local
```

This will close and remove the containers and images created by either of the above commands.

> *Note: See the* `Makefile` *for the full list of commands.* 

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
