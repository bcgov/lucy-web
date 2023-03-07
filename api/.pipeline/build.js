'use strict';
const task = require('./lib/build.js');
const taskDBBuild = require('./lib/build.db.js');
const settings = require('./lib/config.js');
// Building DB Image
//taskDBBuild(Object.assign(settings, { phase: 'build'}));
// Building App Image
task(Object.assign(settings, { phase: 'build'}));
