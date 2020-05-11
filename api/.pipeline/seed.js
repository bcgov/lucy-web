'use strict';
// Imports/require
const settings = require('./lib/config.js');
const testTask = require('./lib/seed.js');

testTask(Object.assign(settings, { phase: settings.options.env}));