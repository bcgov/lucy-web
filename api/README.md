# invasives BC - Invasive species management tools (ISMT) - API

This is the application source code for the Restful API of the invasive species database.

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

* Run app: `make local`
* Debug app: `make local-debug`

*Clean the Local App*

`make clean-local`

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