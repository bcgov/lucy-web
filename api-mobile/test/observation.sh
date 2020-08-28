# TODO: Assign DB environment variables
curl -X POST -d @./observation-fake3.json "localhost:3002/api/activity" \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer '${1} \
