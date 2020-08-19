'use strict';

const config = require('./lib/config.js');
const testTask = require('./lib/test.api.js');

const settings = { ...config, phase: config.options.env };

testTask(settings);
