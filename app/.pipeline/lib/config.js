'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const config = require('../../../.config/config.json');
const changeId = options.pr || `${Math.floor((Date.now() * 1000)) / 60.0}` //aka pull-request
const version = config.version || '1.0.0';
const name = (config.module || {}).app || 'lucy-app';
const apiName = (config.module || {}).api || 'lucy-api';

const staticBranches = config.staticBranches || [];
const staticUrls = config.staticUrls || {};
const staticUrlsAPI = config.staticUrlsAPI || {};
const deployType = options.type || '';

const isStaticDeployment = () => {
  return  deployType === 'static';
};
const isProduction = () => options.env === 'prod';

const deployChangeId  = isStaticDeployment() ? 'deploy' : changeId;
const defaultHost = 'invasivebc-8ecbmv-dev.pathfinder.gov.bc.ca';
const defaultHostAPI = 'invasivebc-8ecbmv-api.dev.pathfinder.gov.bc.ca'

// Get SSO_Info
const sso = config.sso;

const branch = isStaticDeployment() && !isProduction() ? options.branch : undefined;
const tag = isStaticDeployment() && !isProduction() ? `build-${version}-${changeId}-${branch}` : `build-${version}-${changeId}`;

const phases = {
  build: {
    namespace:'8ecbmv-tools'    ,
    name: `${name}`, 
    phase: 'build'  , 
    changeId:changeId, 
    suffix: `-build-${changeId}`  , 
    instance: `${name}-build-${changeId}`  , 
    version:`${version}-${changeId}`, 
    tag: tag,
    env: 'build',
    branch: branch
  },
  dev: {
    namespace:'8ecbmv-dev'    , 
    name: `${name}`, 
    phase: 'dev'  , 
    changeId:deployChangeId, 
    suffix: `-dev-${deployChangeId}`  , 
    instance: `${name}-dev-${deployChangeId}`  , 
    version:`${version}-${deployChangeId}`, 
    tag:`dev-${version}-${deployChangeId}`, 
    host: isStaticDeployment() ? staticUrls['dev'] || defaultHost : `${name}-${changeId}-8ecbmv-dev.pathfinder.gov.bc.ca`, 
    apiHost: isStaticDeployment() ? staticUrlsAPI['dev'] || defaultHostAPI : `${apiName}-${changeId}-8ecbmv-dev.pathfinder.gov.bc.ca`,
    env: 'dev',
    sso: sso.dev,
    replicas: 1
  },
  test: {
    namespace:'8ecbmv-test'    , 
    name: `${name}`, 
    phase: 'test'  , 
    changeId: deployChangeId, 
    suffix: `-test`  , 
    instance: `${name}-test`  , 
    version:`${version}`, 
    tag:`test-${version}`, 
    host: staticUrls['staging'],
    apiHost: staticUrlsAPI['staging'] || defaultHostAPI,
    env: 'test',
    sso: sso.test,
    replicas: 3
  },
  prod: {
    namespace:'8ecbmv-prod'    , 
    name: `${name}`,
    phase: 'prod'  , 
    changeId: deployChangeId,
    suffix: `-prod`  , 
    instance: `${name}-prod`  , 
    version:`${version}`, 
    tag:`prod-${version}`, 
    host: staticUrls['prod'],
    apiHost: staticUrlsAPI['prod'] || defaultHostAPI,
    env: 'prod',
    sso: sso.prod,
    replicas: 3
  }
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options, staticBranches};