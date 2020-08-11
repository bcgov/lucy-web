echo $1
curl --location --request POST 'localhost:3002/api/activity' \
-d @./observation-fake.json
--header 'Authorization: Bearer '${1} \
--header 'Content-Type: application/json' \