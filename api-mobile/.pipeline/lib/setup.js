'use strict';
const { OpenShiftClientX } = require('pipeline-cli');
const wait = require('./wait');
const checkAndClean = require('./checkAndClean');
const path = require('path');

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases[phase].namespace }, options));
  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));
  const objects = [];
  const isObjects = [];

  const imageStreamName = phases[phase].name;
  const instance = `${imageStreamName}-${changeId}`;
  const setupTag = `${phases[phase].tag}-setup`;
  const image = `${imageStreamName}:${setupTag}`;

  // Clean existing image
  checkAndClean(`istag/${image}`, oc);

  // Creating image stream for setup
  isObjects.push(
    ...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/is.api.yaml`, {
      param: {
        NAME: imageStreamName
      }
    })
  );

  oc.applyRecommendedLabels(isObjects, imageStreamName, phase, changeId, instance);

  oc.importImageStreams(isObjects, setupTag, phases.build.namespace, phases.build.tag);

  // Get API image stream
  const data = oc.get(`istag/${image}`) || [];

  if (data.length === 0) {
    console.log('Unable to fetch API Mobile image ref');
    process.exit(0);
  }

  const imageStream = data[0];
  const podName = `${imageStreamName}${phases[phase].suffix}-setup`;

  objects.push(
    ...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/setup.pod.yaml`, {
      param: {
        NAME: podName,
        SUFFIX: phases[phase].suffix,
        VERSION: phases[phase].tag,
        CHANGE_ID: phases[phase].changeId,
        ENVIRONMENT: phases[phase].env || 'dev',
        DB_SERVICE_NAME: `${phases[phase].dbName}-postgresql${phases[phase].suffix}`,
        IMAGE: imageStream.image.dockerImageReference,
        DB_CLEAN_UP: phases[phase].migrationInfo.cleanup,
        DB_SEED: phases[phase].migrationInfo.dbSeed
      }
    })
  );

  checkAndClean(`pod/${podName}`, oc);

  oc.applyRecommendedLabels(objects, imageStreamName, phase, changeId, instance);

  oc.applyAndDeploy(objects, phases[phase].instance);

  wait(`pod/${podName}`, settings, 30);
};
