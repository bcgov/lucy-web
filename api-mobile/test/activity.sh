# TODO replace `{1}` with a valid JWT token string
curl -X POST \
  -d @activity-with-files.json \
  'localhost:3002/api/activity/' \
  --header "Content-Type: application/json" \
  --header 'Authorization: Bearer {1}' \
