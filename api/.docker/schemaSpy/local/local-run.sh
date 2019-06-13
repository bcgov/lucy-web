#!/bin/sh
docker run -v "${PWD}/output:/output" -v "${PWD}/config:/config"  schemaspy/schemaspy:latest -configFile /config/schemaspy.properties  -noimplied -nopages -l