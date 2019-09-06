'use strict';
// Imports/require
const settings = require('./lib/config.js');
const taskDeployDB = require('./lib/deploy.db.js');
const taskDeployAPI = require('./lib/deploy.js');

// Deploying DB
taskDeployDB(Object.assign(settings, { phase: settings.options.env}));

// Deploying API app
taskDeployAPI(Object.assign(settings, { phase: settings.options.env}));
