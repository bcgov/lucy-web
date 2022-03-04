/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: deploy.db.js
 * Project: pipeline
 * File Created: Friday, 6th September 2019 10:57:44 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 6th September 2019 10:58:11 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
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
  const name = `${phases[phase].name}-db`;
  const instance = `${phases[phase].instance}`;
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db.dc.yaml`, {
    'param':{
      'NAME': name,
      'DATABASE_SERVICE_NAME': `${phases[phase].name}-postgresql${phases[phase].suffix}`,
      'IMAGE_STREAM_NAME': name,
      'IMAGE_STREAM_VERSION': phases.build.tag,
      'POSTGRESQL_DATABASE': 'InvasiveBC',
      'IMAGE_STREAM_NAMESPACE': phases.build.namespace,
      'VOLUME_CAPACITY': (`${phases[phase].name}-postgresql${phases[phase].suffix}` == 'invasivesbc-api-postgresql-dev-deploy') ? "20Gi" : "3Gi"
    }
  }))
  
  oc.applyRecommendedLabels(objects, name, phase, `${changeId}`, instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, instance)
}
