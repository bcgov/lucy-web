#!/bin/sh
CURRENTPATH=$PWD
docker run -v "${PWD}/dist:/output" -v "${PWD}/config:/config"  schemaspy/schemaspy:latest -configFile /config/schemaspy.properties  -noimplied -nopages -l &&
chmod -R o=rwx ./dist/* &&
cd dist &&
tar -czvf "schemaspy.tar.gz" . && 
chmod o=rwx schemaspy.tar.gz &&
cd .. &&
cp ./dist/schemaspy.tar.gz ../../../api_sources/resources/archives/schemaspy.tar.gz &&
rm ./dist/schemaspy.tar.gz &&
rm -rf ./dist
