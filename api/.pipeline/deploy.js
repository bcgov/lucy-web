'use strict';
// Imports/require
const settings = require('./lib/config.js');
const taskDeployAPI = require('./lib/deploy.js');

// Deploying API app
taskDeployAPI(Object.assign(settings, { phase: settings.options.env}));
