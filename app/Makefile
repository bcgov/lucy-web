#!make
# ------------------------------------------------------------------------------
# Makefile -- SEISM UI Local
# ------------------------------------------------------------------------------

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

# ------------------------------------------------------------------------------
# Task Aliases
# ------------------------------------------------------------------------------

local:      |  close-local build-local run-local

### TASKS

build-local: ## -- Target : Builds the local development containers.
	@echo "+\n++ Make: Building local Docker image ...\n+"
	@docker-compose -f docker-compose.yml build

run-local: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.yml up -d

close-local: ## -- Target : Closes the local development containers.
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.yml down