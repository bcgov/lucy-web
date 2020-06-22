# Make file combining all load test comments
load-test-api-read:
	@echo "+\n Load Testing API with read with value DURATION = $$DURATION, RATE = $$RATE, URL = $$URL ...\n+"
	@npx artillery run --overrides '{"config": {"phases": [{"duration": ${TIME}, "arrivalRate": ${RATE} }]}}' -v '{"url": "${URL}"}' ./tests/api.yml
load-test-app:
	@echo "+\n Load test app or web app front end with DURATION = $$DURATION, RATE = $$RATE...\n+"
	@npx artillery quick -d $$DURATION -r $$RATE -k https://test-invasivesbc.pathfinder.gov.bc.ca
