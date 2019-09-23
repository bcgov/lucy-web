'use strict';
const {OpenShiftClientX} = require('pipeline-cli')

module.exports = (resourceName, settings, countArg, timeoutArg) => {
    const timeout = timeoutArg || 10000;
    const count = countArg || 10;
    const phases = settings.phases
    const options= settings.options
    const phase = options.env
    const oc = new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
    
    const check = () => {
        const data = oc.get(resourceName) || [];
        if (data.length === 0) {
            console.log('Unable to fetch API resource');
            process.exit(0);
        }
        console.log(JSON.stringify(data, null, 2)); 
    };

    setTimeout(check, 5000);
};