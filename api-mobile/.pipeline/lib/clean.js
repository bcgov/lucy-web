'use strict';
const { OpenShiftClientX } = require('pipeline-cli');
const checkAndClean = require('./checkAndClean');

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases.build.namespace }, options));
  const target_phase = options.env;

  for (let phase in phases) {
    if (!phases.hasOwnProperty(phase)) {
      continue;
    }

    if (phase !== target_phase) {
      continue;
    }

    // Get build configs
    let buildConfigs = oc.get('bc', {
      selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
      namespace: phase.namespace
    });

    // Clean build configs
    buildConfigs.forEach(buildConfig => {
      if (buildConfig.spec.output.to.kind == 'ImageStreamTag') {
        oc.delete([`ImageStreamTag/${buildConfig.spec.output.to.name}`], {
          'ignore-not-found': 'true',
          wait: 'true',
          namespace: phase.namespace
        });
      }
    });

    // get deployment configs
    let deploymentConfigs = oc.get('dc', {
      selector: `app=${phase.instance},env-id=${phase.changeId},env-name=${phase},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
      namespace: phase.namespace
    });

    // Clean deployment configs
    deploymentConfigs.forEach(deploymentConfig => {
      deploymentConfig.spec.triggers.forEach(trigger => {
        if (trigger.type == 'ImageChange' && trigger.imageChangeParams.from.kind == 'ImageStreamTag') {
          oc.delete([`ImageStreamTag/${trigger.imageChangeParams.from.name}`], {
            'ignore-not-found': 'true',
            wait: 'true',
            namespace: phase.namespace
          });
        }
      });
    });

    // Cleaning other pods
    if (phase !== 'build') {
      const newOC = new OpenShiftClientX(Object.assign({ namespace: phases[phase].namespace }, options));
      const podName1 = `${phases[phase].name}${phases[phase].suffix}-setup`;
      // const podName2 = `${phases[phase].name}${phases[phase].suffix}-test`;
      checkAndClean(`pod/${podName1}`, newOC);
      // checkAndClean(`pod/${podName2}`, newOC);
    }

    oc.raw('delete', ['all'], {
      selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
      wait: 'true',
      namespace: phase.namespace
    });

    oc.raw('delete', ['all,pvc,secrets,Secrets,secret,configmap,endpoints,Endpoints'], {
      selector: `app=${phase.instance},env-id=${phase.changeId},!shared,github-repo=${oc.git.repository},github-owner=${oc.git.owner}`,
      wait: 'true',
      namespace: phase.namespace
    });
  }
};
