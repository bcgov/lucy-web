# invasives BC - Invasive species management tools (ISMT) - Web App

This is the application source code for the client web app of the invasive species project.

This client was initially generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.2.

To get help on Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Setting Up
### Requirements

If you wish to use the Makefile commands to run the project with Docker, there are no additional requirements required for local development.

If you wish to run the application locally without Docker, you will need to install [Angular CLI](https://github.com/angular/angular-cli).

## Running the Application

Run `make build-local` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `make run-local` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Closing the Application

Run `make close-local` or close the current process on the command line.

## Deployment to OpenShift

Use command `oc` for local OpenShift build and deployment options.

## Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

Run `ng build-storybook` followed by `ng storybook` to build and run tests via [Storybook](https://storybook.js.org/). Output is visible on port 6006.

## Code Analysis with SonarQube

Run `ng sonar-analysis` to see output from [SonarQube](https://www.sonarqube.org/).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.