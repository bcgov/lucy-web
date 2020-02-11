'use strict';
// Imports/require
const settings = require('./lib/config.js');
const tasks = require('./lib/db.backup.js');
const options = settings.options;
const arg = Object.assign(settings, { phase: settings.options.env});
// console.dir(settings);
if (options.listing) {
    tasks.listing(arg)
} else if (options.backup) {
    tasks.backup(arg)
} else if (options.r || options.restore) {
    tasks.restore(arg)
}