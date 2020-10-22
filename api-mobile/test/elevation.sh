# Request an elevation value
curl -X GET "localhost:3002/api/context/elevation?lon=-132.34&lat=45.12" \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer '${1} \
