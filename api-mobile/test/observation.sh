curl -X POST -d @./observation-fake.json "localhost:3002/api/activity" \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer '${1} \
