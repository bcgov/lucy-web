'use strict';
let options = require('pipeline-cli').Util.parseArguments();
const config = require('../../.config/config.json');

const defaultHost = 'invasivebc-7068ad-api-mobile.apps.silver.devops.gov.bc.ca';
const name = (config.module && config.module['api-mobile']) || 'lucy-api-mobile';
const dbName = (config.module && config.module['api']) || 'lucy-api';
const changeId = options.pr || `${Math.floor(Date.now() * 1000) / 60.0}`; //aka pull-request or brach to process
const version = config.version || '1.0.0';
const deployType = options.type || '';
const isStaticDeployment = deployType === 'static';
const deployChangeId = (isStaticDeployment && 'deploy') || changeId;
const branch = (isStaticDeployment && options.branch) || undefined;
const tag = (branch && `build-${version}-${changeId}-${branch}`) || `build-${version}-${changeId}`;
const staticUrlsAPIMobile = config.staticUrlsAPIMobile || {};
const staticBranches = config.staticBranches || [];

const processOptions = options => {
  const result = options;

  // Check git
  if (!result.git.url.includes('.git')) {
    result.git.url = `${result.git.url}.git`;
  }
  if (!result.git.http_url.includes('.git')) {
    result.git.http_url = `${result.git.http_url}.git`;
  }

  // Fixing repo
  if (result.git.repository.includes('/')) {
    const last = result.git.repository.split('/').pop();
    const final = last.split('.')[0];
    result.git.repository = final;
  }

  return result;
};

options = processOptions(options);

const phases = {
  build: {
    namespace: '7068ad-tools',
    name: `${name}`,
    dbName: `${dbName}`,
    phase: 'build',
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: tag,
    branch: branch
  },
  dev: {
    namespace: '7068ad-dev',
    name: `${name}`,
    dbName: `${dbName}`,
    phase: 'dev',
    changeId: deployChangeId,
    suffix: `-dev-${deployChangeId}`,
    instance: `${name}-dev-${deployChangeId}`,
    version: `${deployChangeId}-${changeId}`,
    tag: `dev-${version}-${deployChangeId}`,
    host:
      (isStaticDeployment && (staticUrlsAPIMobile.dev || defaultHost)) ||
      `${name}-${changeId}-7068ad-dev.apps.silver.devops.gov.bc.ca`,
    env: 'dev',
    certificateURL: config.certificateURL.dev,
    migrationInfo: config.migrationInfo.dev,
    replicas: 1,
    maxReplicas: 2
  },
  test: {
    namespace: '7068ad-test',
    name: `${name}`,
    dbName: `${dbName}`,
    phase: 'test',
    changeId: deployChangeId,
    suffix: `-test`,
    instance: `${name}-test`,
    version: `${version}`,
    previousVersion: config.previousVersion || 'NA',
    tag: `test-${version}`,
    host: staticUrlsAPIMobile.staging,
    env: 'test',
    certificateURL: config.certificateURL.test,
    migrationInfo: config.migrationInfo.test,
    replicas: 3,
    maxReplicas: 5
  },
  prod: {
    namespace: '7068ad-prod',
    name: `${name}`,
    dbName: `${dbName}`,
    phase: 'prod',
    changeId: deployChangeId,
    suffix: `-prod`,
    instance: `${name}-prod`,
    version: `${version}`,
    previousVersion: config.previousVersion || 'NA',
    tag: `prod-${version}`,
    host: staticUrlsAPIMobile.prod,
    env: 'prod',
    certificateURL: config.certificateURL.prod,
    migrationInfo: config.migrationInfo.prod,
    replicas: 3,
    maxReplicas: 6
  }
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', reason => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options, staticBranches };
