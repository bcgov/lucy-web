#!/bin/bash

file=".env"

while IFS="=" read key val
do
  # display $line or do somthing with $line
  if [ -n "$val" ]; then
    eval "$key"=$val
  fi
done < "$file"

cat << EOF
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT:$MERGE_BRANCH",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": "3000"
    }
  ],
  "Logging": "/var/log/nodejs/"
}
EOF
