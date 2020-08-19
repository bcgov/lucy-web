'use strict';

const config = require('./lib/config.js');
const deployAPITask = require('./lib/deploy.js');

const settings = { ...config, phase: config.options.env };

deployAPITask(settings);
