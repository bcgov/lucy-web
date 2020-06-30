'use strict'

const processor = require('./testProcessor');

(async () => {
    await processor.beforeRequestHandler(null, { vars: {}}, null, () => {});
})();
