#!make
# ------------------------------------------------------------------------------

# Makefile -- SEISM API
# ------------------------------------------------------------------------------

-include .env

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')

define deployTag
"${PROJECT}-${GIT_LOCAL_BRANCH}-${DEPLOY_DATE}"
endef

#ifndef BUILD_TARGET
#$(error The BUILD_TARGET variable is missing.,)
#endif

DIR := ${CURDIR}

all 		: help
.DEFAULT 	: help
.PHONY	    : local database close-local clean-local close-production  print-status

# ------------------------------------------------------------------------------
# Task Aliases
# ------------------------------------------------------------------------------

local:      |  setup-local close-local build-local run-local         ## Task-Alias -- Run the steps for a local-build.
local-debug: | setup-local close-local build-local run-debug

schema-spy: | close-local build-local run-local wait-for-app schema-spy-run

test: | setup-local close-local build-local run-local wait-for-app test-local close-local

deploy-remote: | remote-build remote-deploy
deploy-api: | build-remote-api deploy-remote-api
deploy-app: | build-remote-app deploy-remote-app
remote-build: | build-remote-api build-remote-app
remote-deploy: | deploy-remote-api deploy-remote-app


# ------------------------------------------------------------------------------
# Status Output
# ------------------------------------------------------------------------------

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | PROJECT:      $(PROJECT_NAME) "
	@echo " | BRANCH:       $(GIT_LOCAL_BRANCH) "
	@echo " +---------------------------------------------------------+ "
	@echo " | BUILD_TARGET: $(BUILD_TARGET) "
	@echo " +---------------------------------------------------------+ "
	@echo " | Docker-Compose Config Output "
	@echo " +---------------------------------------------------------+ "
	@docker-compose -f docker-compose.yml config


# ------------------------------------------------------------------------------
# Development Commands
# ------------------------------------------------------------------------------

build-local: ## -- Target : Builds the local development containers.
	@echo "+\n++ Make: Building local Docker image ...\n+"
	@docker-compose -f docker-compose.yml build 

setup-local: ## -- Target : Prepares the environment variables for local development.
	@echo "+\n++ Make: Preparing project for local development ...\n+"
	@cp env_config/env.local .env
	@mkdir -p ./_app_data

run-local: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.yml up -d

run-debug: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running locally for debugging...\n+"
	@mkdir -p ./_app_data
	@docker-compose -f docker-compose.yml up


close-local: ## -- Target : Closes the local development containers.
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.yml down


clean-local: ## -- Target : Closes and clean local development containers.
	@echo "+\n++ Make: Closing and cleaning local container ...\n+"
	@docker-compose -f docker-compose.yml down -v
	@rm -rf ./_app_data

test-local: ## -- Test API: Locally
	@echo "\n++ Test API locally ... \n+"
	@docker-compose exec app_api npm run test:all

pod:
	@echo "+\n++ Make: Creating Pod ...\n+"
	@oc new-app  -e POSTGRESQL_USER=$(DB_USER) -e POSTGRESQL_PASSWORD=$(DB_PASS) -e POSTGRESQL_DATABASE=$(DB_DATABASE) centos/postgresql-95-centos7
build-remote-sonarqube:
	@echo "+\n++ Make: Building Remote Sonarqube \n+"
	@cd ./.pipeline && DEBUG=* npm run build-tools -- --pr=$$PR
clean-dev:
	@echo "+\n++ Make: Clean Remote Env with pr=$$PR"
	@echo "+\n++ Cleanin API"
	@cd ./.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=dev 
	@echo "+\n++ Cleaning App"
	@cd ../app/.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=dev
clean-remote-deploy:
	@echo "+\n++ Make: Clean Remote Deployment Env with pr=$$PR env=$$ENV"
	@echo "+\n++ Cleanin API {Deploy}"
	@cd ./.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=$$ENV
	@echo "+\n++ Cleaning App {Deploy}"
	@cd ../app/.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=$$ENV
clean-remote:
	@echo "+\n++ Make: Clean Remote Env with pr=$$PR env=$$ENV"
	@echo "+\n Cleaning API {Build}"
	@cd ./.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=build
	@echo "+\n++ Cleanin API {Deploy}"
	@cd ./.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=$$ENV
	@echo "+\n++ Cleaning App {Build}"
	@cd ../app/.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=build
	@echo "+\n++ Cleaning App {Deploy}"
	@cd ../app/.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=$$ENV
clean-build:
	@echo "+\n++ Make: Clean Remote Build with pr=$$PR"
	@echo "+\n Cleaning API {Build}"
	@cd ./.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=build
	@echo "+\n++ Cleaning App {Build}"
	@cd ../app/.pipeline && DEBUG=* npm run clean -- --pr=$$PR --env=build
build-remote-api:
	@echo "+\n++ Make: Building API with ref = $$PR"
	@cd ./.pipeline && DEBUG=* npm run build -- --pr=$$PR
build-remote-app:
	@echo "+\n++ Make: Building APP with ref = $$PR"
	@cd ../app/.pipeline && DEBUG=* npm run build -- --pr=$$PR
deploy-remote-api:
	@echo "+\n++ Make: Deploying API with ref = $$PR and env=$$ENV type=$$TYPE"
	@cd ./.pipeline && DEBUG=* npm run pre-deploy -- --pr=$$PR --env=$$ENV
	@cd ./.pipeline && DEBUG=* npm run setup -- --pr=$$PR --env=$$ENV
	@cd ./.pipeline && DEBUG=* npm run test -- --pr=$$PR --env=$$ENV
	@cd ./.pipeline && DEBUG=* npm run deploy -- --pr=$$PR --env=$$ENV --type=static
deploy-remote-app:
	@echo "+\n++ Make: Deploying APP with ref = $$PR and env=$$ENV"
	@cd ../app/.pipeline && DEBUG=* npm run deploy -- --pr=$$PR --env=$$ENV --type=static
sonarqube:
	@echo "+\n Make: Sonarqube analysis"
	@mkdir -p ~/.docker-vol/sonarqube/data
	@mkdir -p ~/.docker-vol/sonarqube/logs
	@docker run -d --name sonarqube -p 9090:9000 -v ~/.docker-vol/sonarqube/data:/opt/sonarqube/data -v ~/.docker-vol/sonarqube/logs:/opt/sonarqube/logs sonarqube || echo "Sonar Container is already exists" && docker start sonarqube || "Sonar Container is running"
	@echo "\n\n Waiting for sonarqube to start .... (90 sec)"
	@sleep 30
	@echo "Waiting .... (60 sec)"
	@sleep 20
	@echo "Waiting .... (40 sec)"
	@sleep 20
	@echo "Waiting .... (20 sec)"
	@sleep 20
	@docker-compose run app_api npm run sonar-analysis
test-remote-api:
	@echo "+\n Make: Test Remote API"
	@cd ./.pipeline && DEBUG=* npm run test -- --pr=$$PR --env=$$ENV
deploy-remote-backup:
	@echo "+\n Deploy backup application in OpenShift"
	@cd ./.pipeline && DEBUG=* npm run deploy-db-backup -- --env=$$ENV --type=static --pr=$$PR
remote-backup:
	@echo "+\n Make: Run backup of remote database"
	@cd ./.pipeline && DEBUG=* npm run backup -- --env=$$ENV --backup=true
remote-backup-ls:
	@echo "+\n Make: Display listing of remote backups"
	@cd ./.pipeline && DEBUG=* npm run backup -- --env=$$ENV --listing=true
# ------------------------------------------------------------------------------
# Helper Commands
# ------------------------------------------------------------------------------
	
database: ## <Helper> :: Executes into database container.
	@echo "Make: Shelling into local database container ..."
	@export PGPASSWORD=$(DB_PASS)
	@docker-compose exec db psql -U $(DB_USER) $(DB_DATABASE)

workspace: ## <Helper> :: Executes into the workspace container.
	@echo "Shelling into local workspace ..."
	@docker-compose exec workspace bash

api: ## <Helper> :: Executes into the workspace container.
	@echo "Shelling into local workspace ..."
	@docker-compose exec app_api bash

app: ## <Helper> :: Executes into the app container.
	@echo "Shelling into local app workspace"
	@docker-compose exec app bash

help:  ## ** Display this help screen.
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

schema-spy-run:
	@echo "Running Schema Spy on local env"
	cd ./.docker/schemaSpy/local && sh local-run.sh

wait-for-app:
	@echo "Waiting 30 sec for app to start"
	sleep 60
