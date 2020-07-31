'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings) => {
  const phases = settings.phases
  const options= settings.options
  const phase = options.env
  const changeId = phases[phase].changeId
  const oc= new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))
  var objects = []

  // The deployment of your cool app goes here ▼▼▼
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/dc.yaml`, {
    'param':{
      'NAME': phases[phase].name,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'HOST': phases[phase].host,
      'CHANGE_ID': phases.build.changeId || changeId,
      'ENVIRONMENT': phases[phase].env || 'dev',
      'DB_SERVICE_NAME': `${phases[phase].name}-postgresql${phases[phase].suffix}`,
      'CERTIFICATE_URL': phases[phase].certificateURL,
      'DB_MIGRATION_TYPE': phases[phase].migrationInfo.type,
      'DB_CLEAN_UP': phases[phase].migrationInfo.cleanup,
      'DB_SEED': phases[phase].migrationInfo.dbSeed,
      'REPLICAS': phases[phase].replicas || 1,
      'REPLICA_MAX': phases[phase].maxReplicas || 1
    }
  }))
  
  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  if (settings.ignoreDeploy === true) {
    console.log(` **** IGNORING DEPLOY ****`);
    return;
  }
  oc.applyAndDeploy(objects, phases[phase].instance)
}
