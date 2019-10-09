# Invasive Species BC

https://bcdevexchange.org/projects/prj-invasive-species

## Introduction

Invasive species are non-native plants and animals whose introduction and spread in British Columbia cause significant economic, social or environmental damage.

This project tracks the observation, treatment, and monitoring of invasive species in the Province of British Columbia.

## Table of Contents

1. [Project Status](#project-status)
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

This project is in active development and has not yet been released.

## Getting Help or Reporting an Issue

To report bugs/issues/features requests, please file an [issue](https://github.com/bcgov/lucy-web/issues).

## How to Contribute

If you would like to contribute, please see our [contributing](CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](CODE-OF-CONDUCT.md). By participating in this project you agree to abide by its terms.

## Architecture

This application uses PostgreSQL (with PostGIS), TypeORM, and Angular. Our environments run on an OpenShift container platform cluster.  

## Project Structure

    .github/                   - PR and Issue templates
    api/                       - TypeORM API codebase
    app/                       - Angular Client Application codebase
    openshift/                 - OpenShift-deployment specific files
    reverse-proxy/             - Reverse Proxy code
    tools/                     - Devops utilities
    └── jenkins                - Jenkins standup
    CODE-OF-CONDUCT.md         - Code of Conduct
    CONTRIBUTING.md            - Contributing Guidelines
    Jenkinsfile                - Top-level Pipeline
    Jenkinsfile.cicd           - Pull-Request Pipeline
    LICENSE                    - License

## Documentation

* [Front end Readme](app/README.md)
* [API Readme](api/README.md)
* [Openshift Readme](openshift/README.md)
* [Tools Readme](tools/README.md)

## Requirements

You must have Docker installed.

*For Mac OSX:*

1. Follow the instructions here: https://docs.docker.com/docker-for-mac/install/

*For Windows:*

1. Follow the instructions here: https://docs.docker.com/docker-for-windows/install/

You must also install GMAKE.

## Setup Instructions

Begin by cloning the repository to create a local copy. The repository on GitHub provides instructions: https://github.com/bcgov/lucy-web

All subsequent commands are run at the project root.

For example:

`git clone https://github.com/bcgov/lucy-web`

`cd lucy-web`

## Running the Application

*Using Docker:*

The backend (server) and frontend (client) of the application run in separate containers.

To run the server, execute the following commands inside the `api` directory. To run the client, execute the following commands inside the `app` directory. Both client and server may be run independently or in parallel.

The following commands are defined in the respective `Makefile` for each directory.

1. Build the application  
`make build-local`

2. Run the app container  
`make run-local`

*View the App:*

Go to http://localhost:3000/

*Quit the App:*

On the command line, run `make close-local`

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