#!/bin/sh
docker run -v "${PWD}/../../../api_sources/schemaspy:/output" -v "${PWD}/config:/config"  schemaspy/schemaspy:latest -configFile /config/schemaspy.properties  -noimplied -nopages -l