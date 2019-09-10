'use strict';
const task = require('./lib/build.schemaspy.js')
const settings = require('./lib/config.js')


task(Object.assign(settings, { phase: 'build'}))