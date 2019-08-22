'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const config = require('../../../.config/config.json');
const changeId = options.pr || 'dev' //aka pull-request
const version = config.version || '1.0.0';
const name = (config.module || {}).app || 'lucy-app';
const apiName = (config.module || {}).api || 'lucy-api';

const staticBranches = config.staticBranches || [];
const staticUrls = config.staticUrls || {};
const staticUrlsAPI = config.staticUrlsAPI || {};
const isStaticDeployment = () => {
  return staticBranches.includes(changeId);
};
const deployChangeId  = isStaticDeployment() ? 'deploy' : changeId;
const defaultHost = 'seism-8ecbmv-dev.pathfinder.gov.bc.ca';
const defaultHostAPI = 'seism-8ecbmv-api.dev.pathfinder.gov.bc.ca'

const phases = {
  build: {
    namespace:'8ecbmv-tools'    ,
    name: `${name}`, 
    phase: 'build'  , 
    changeId:changeId, 
    suffix: `-build-${changeId}`  , 
    instance: `${name}-build-${changeId}`  , 
    version:`${version}-${changeId}`, 
    tag:`build-${version}-${changeId}`},
  dev: {
    namespace:'8ecbmv-dev'    , 
    name: `${name}`, 
    phase: 'dev'  , 
    changeId:deployChangeId, 
    suffix: `-dev-${deployChangeId}`  , 
    instance: `${name}-dev-${deployChangeId}`  , 
    version:`${version}-${deployChangeId}`, 
    tag:`dev-${version}-${deployChangeId}`, 
    host: isStaticDeployment() ? staticUrls[changeId] || defaultHost : `${name}-${changeId}-8ecbmv-dev.pathfinder.gov.bc.ca`, 
    apiHost:isStaticDeployment() ? staticUrlsAPI[changeId] || defaultHostAPI : `${apiName}-${changeId}-8ecbmv-dev.pathfinder.gov.bc.ca`},
  test: {
    namespace:'8ecbmv-test'    , 
    name: `${name}`, 
    phase: 'test'  , 
    changeId:changeId, 
    suffix: `-test`  , 
    instance: `${name}-test`  , 
    version:`${version}`, 
    tag:`test-${version}`, 
    host: `${name}-8ecbmv-dev.pathfinder.gov.bc.ca/${changeId}`},
  prod: {
    namespace:'8ecbmv-prod'    , 
    name: `${name}`, phase: 'prod'  , 
    changeId:changeId, suffix: `-prod`  , 
    instance: `${name}-prod`  , 
    version:`${version}`, 
    tag:`prod-${version}`, 
    host: `${name}--8ecbmv-dev.pathfinder.gov.bc.ca/${changeId}`},
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options, staticBranches};