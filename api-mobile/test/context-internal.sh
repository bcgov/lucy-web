# Request which IPMA region this point is in.
curl -X GET "localhost:3002/api/context/internal/ipma?lon=-125.848&lat=53.643" \
--header "Content-Type: application/json" \
--header 'Authorization: Bearer '${1} \
