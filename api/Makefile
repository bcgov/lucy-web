#!make
# ------------------------------------------------------------------------------
# Makefile -- SEISM API
# ------------------------------------------------------------------------------

include .env

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')

define deployTag
"${PROJECT}-${GIT_LOCAL_BRANCH}-${DEPLOY_DATE}"
endef

#ifndef BUILD_TARGET
#$(error The BUILD_TARGET variable is missing.)
#endif

DIR := ${CURDIR}

all 		: help
.DEFAULT 	: help
.PHONY	    : local database close-local clean-local close-production  print-status

# ------------------------------------------------------------------------------
# Task Aliases
# ------------------------------------------------------------------------------

local:      |  close-local build-local run-local         ## Task-Alias -- Run the steps for a local-build.
local-debug: | close-local build-local run-debug


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

local-env:   ## -- Target : Sets up the local .env options
	@echo "+\n++ Preparing project for local development ...\n+"
	@cp env_config/.env.local app/.env

build-local: ## -- Target : Builds the local development containers.
	@echo "+\n++ Make: Building local Docker image ...\n+"
	@docker-compose -f docker-compose.yml build 

setup-local: ## -- Target : Prepares the environment variables for local development.
	@echo "+\n++ Make: Preparing project for local development ...\n+"
	@cp env_config/.env.dev .env
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

pod:
	@echo "+\n++ Make: Creating Pod ...\n+"
	@oc new-app  -e POSTGRESQL_USER=$(DB_USER) -e POSTGRESQL_PASSWORD=$(DB_PASS) -e POSTGRESQL_DATABASE=$(DB_DATABASE) centos/postgresql-95-centos7



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

help:  ## ** Display this help screen.
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'