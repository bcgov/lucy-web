'use strict';
const options= require('pipeline-cli').Util.parseArguments();
const config = require('../../../.config/config.json');
const changeId = options.pr || 'dev'; //aka pull-request or brach to process
const version = config.version || '1.0.0';
const name = (config.module || {}).api || 'lucy-api';
const staticBranches = config.staticBranches || [];
const staticUrlsAPI = config.staticUrlsAPI || {};
const deployType = options.type || '';

const isStaticDeployment = () => {
  return staticBranches.includes(changeId) || deployType === 'static';
};

const deployChangeId  = isStaticDeployment() ? 'deploy' : changeId;
const defaultHost = 'invasivebc-8ecbmv-api.dev.pathfinder.gov.bc.ca';

const phases = {
  build: {
    namespace:'8ecbmv-tools',
    name: `${name}`,
    phase: 'build', 
    changeId: changeId, 
    suffix: `-build-${changeId}`  ,
    instance: `${name}-build-${changeId}`  ,
    version:`${version}-${changeId}`,
    tag:`build-${version}-${changeId}`
  },
  dev: {
    namespace:'8ecbmv-dev', 
    name: `${name}`,
    phase: 'dev',
    changeId: deployChangeId,
    suffix: `-dev-${deployChangeId}`  ,
    instance: `${name}-dev-${deployChangeId}`  ,
    version:`${deployChangeId}-${changeId}`,
    tag:`dev-${version}-${deployChangeId}`, 
    host: isStaticDeployment() ? (staticUrlsAPI['dev'] || defaultHost) : `${name}-${changeId}-8ecbmv-dev.pathfinder.gov.bc.ca`},
  test: {
    namespace:'8ecbmv-test',
    name: `${name}`,
    phase: 'test',
    changeId: deployChangeId,
    suffix: `-test`, 
    instance: `${name}-test`, 
    version:`${version}`, 
    tag:`test-${version}`, 
    host: staticUrlsAPI['staging']},
  prod: {
    namespace:'8ecbmv-prod'    , 
    name: `${name}`, 
    phase: 'prod'  , 
    changeId:deployChangeId, 
    suffix: `-prod`  , 
    instance: `${name}-prod`  , 
    version:`${version}`, 
    tag:`prod-${version}`,
    host: staticUrlsAPI['prod']
  },
  schemaSpy: {
    instance: `schema-spy-${changeId}`,
    changeId: changeId,
    name: 'schema-spy'
  }
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options, staticBranches};