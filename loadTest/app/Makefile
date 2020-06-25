# Make file combining all load test comments
load-test-api-read:
	@echo "+\n Load Testing API with read with value DURATION = D = $$D, RATE = R = $$R, URL = $$URL ...\n+"
	@npx artillery run --overrides '{"config": {"phases": [{"duration": ${D}, "arrivalRate": ${R} }]}}' -v '{"url": "${URL}"}' ./tests/api.yml
load-test-app:
	@echo "+\n Load test app or web app front end with DURATION = D = $$D, RATE = R = $$R URL= $$URL ...\n+"
	@npx artillery quick -d $$D -r $$R -k https://test-invasivesbc.pathfinder.gov.bc.ca
