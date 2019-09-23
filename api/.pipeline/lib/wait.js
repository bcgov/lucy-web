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
        console.log(`Getting resource ${resourceName}`)
        const data = oc.get(resourceName) || [];
        if (data.length === 0) {
            console.log(`Unable to fetch API resource: ${resourceName}`);
            process.exit(0);
        }
        // console.log(JSON.stringify(data, null, 2));
        // Get Status
        const status = data.status || { conditions: [], containerStatuses: []};
        if (status.conditions.length === 0 && status.containerStatuses.length === 0) {
            console.log(`Unable to fetch API resource: ${resourceName} status`);
            process.exit(0);
        }

        const containerStatus = status.containerStatuses[0] || {};
        if (!containerStatus.state) {
            console.log(`Unable to fetch API resource: ${resourceName} container state`);
            process.exit(0);
        }
        const state = containerStatus.state || {};
        if (state.terminated) {
            if (state.terminated.reason.toLowerCase() === 'completed') {
                console.log(`${resourceName}: Finished [Successfully]`)
                return;
            } else {
                console.log(`Unable to fetch API resource: ${resourceName} terminated with error`);
                console.log(JSON.stringify(data.status, null, 2));
                process.exit(0);
            }
        } else {
            if (count > 0) {
                console.log(`Waiting for resource: ${resourceName} to finish ... ${count}`)
                setTimeout(check, timeout, (count - 1), timeout);
            } else {
                console.log(`Wait time exceed for resource: ${resourceName}`);
                process.exit(0);
            }
        }
        
    };

    setTimeout(check, timeout);
};