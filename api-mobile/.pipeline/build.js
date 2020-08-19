'use strict';
const buildTask = require('./lib/build.js');
const config = require('./lib/config.js');

const settings = { ...config, phase: 'build' };

// Building App Image
buildTask(settings);
