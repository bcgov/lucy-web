'use strict';
const task = require('./lib/build.schemaspy.js')
const settings = require('./lib/config.js')

console.log('Not building schemaspy');
// task(Object.assign(settings, { phase: 'build'}))