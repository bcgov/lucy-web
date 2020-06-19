'use strict';
let options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr || `${Math.floor((Date.now() * 1000)) / 60.0}` //aka pull-request
const version = '1.0.0';
const name = 'invasivesbc-load-test';
const branch = options.branch;
const tag = `build-${version}-${changeId}-${branch}`;

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
    namespace:'8ecbmv-tools'    , 
    name: `${name}`, 
    phase: 'dev'  , 
    changeId: changeId, 
    suffix: `-dev-${branch}-${changeId}`  , 
    instance: `${name}-dev-${changeId}`  , 
    version:`${version}-${changeId}`, 
    tag:`dev-${version}-${changeId}`, 
    replicas: 1,
    maxReplicas: 1
  }
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options, staticBranches};