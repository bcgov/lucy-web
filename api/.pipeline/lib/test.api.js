'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');
const wait = require('./wait');

module.exports = (settings) => {
  const phases = settings.phases
  const options= settings.options
  const phase = options.env
  const changeId = phases[phase].changeId
  const oc= new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))
  var objects = []

  // The deployment of your cool app goes here ▼▼▼
  const name = `${phases[phase].name}-test`;
  const instance = `${name}-${changeId}`;
  const image = `${phases[phase].name}:${phases[phase].tag}`;

  // Get API image stream
  const data = oc.get(`istag/${image}`) || [];
  if (data.length === 0) {
    console.log('Unable to fetch API imag ref');
    process.exit(0);
  }
  const imageStream = data[0];
  const podName = `${phases[phase].name}${phases[phase].suffix}-test`;

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/test.pod.yaml`, {
    'param':{
      'NAME': podName,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'CHANGE_ID': phases[phase].changeId,
      'ENVIRONMENT': phases[phase].env || 'dev',
      'DB_SERVICE_NAME': `${phases[phase].name}-postgresql${phases[phase].suffix}`,
      'IMAGE': imageStream.image.dockerImageReference
    }
  }))
  
  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, instance)
  oc.applyAndDeploy(objects, phases[phase].instance)
  wait(`pod/${podName}`, settings);
}
