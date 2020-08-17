echo $1
curl --location --request POST 'localhost:3002/api/activity' \
--header 'Authorization: Bearer '${1} \
--header 'Content-Type: application/json' \
--data-raw '
  {
    "type": "Observation",
    "subType": "Invasive Terrestrial Plant",
    "date" : "2014-01-01T23:28:56.782Z",
    "locationAndGeometry": {
        "test": "banana"
    },
    "activityTypeData": { 
          "date": "12-2020-21",
          "key activity species name": "bla"
      },
      "activitySubTypeData": { 
        "pokyness": 11,
        "smells": "ok"
        }
 }
'
