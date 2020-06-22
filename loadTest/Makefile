# Make File to run various comment

deploy-remote: 
	@echo "+\n Deploying Load Test Pod in Env = $$ENV and Branch = $$BRANCH...\n+"
	@cd ./.pipeline && DEBUG=* npm run deploy -- --env=$$ENV --branch=$$BRANCH
build-remote:
	@echo "+\n Building Image for Load Testing app with Branch = $$BRANCH ....\n++"
	@cd ./.pipeline && DEBUG=* npm run build -- --env=build --pr=0 --branch=$$BRANCH
load-app:
	@echo "+\n Shell into remote load test app pod in project (env, 8ecbmv-tools, 8ecbmv-dev) $$PROJECT"
	@oc project $$PROJECT && oc rsh invasivesbc-load-test