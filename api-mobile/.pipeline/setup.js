'use strict';

const config = require('./lib/config.js');
const setupTask = require('./lib/setup.js');

const settings = { ...config, phase: config.options.env };

setupTask(settings);
