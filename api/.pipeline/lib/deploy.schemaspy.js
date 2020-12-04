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
 * File: deploy.schemaspy.js
 * Project: pipeline
 * File Created: Monday, 19th August 2019 10:27:44 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 19th August 2019 10:27:47 am
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
  const changeId = phases[phase].changeId || 'dev-tools'
  const oc= new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift/tools'))
  var objects = [];
  const instance = phases[phase].instance;
  const name = `${phases[phase].name}-schemaspy`;
  const host = `invasivebc-schemaspy-${changeId}-${phases[phase].namespace}.apps.silver.devops.gov.bc.ca`;
  // The deployment of your cool app goes here ▼▼▼
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/schemaspy.dc.yaml`, {
    'param':{
      'NAME': `${name}`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'APPLICATION_DOMAIN': host,
      'BACKEND_HOST': phases[phase].host,
      'DB_HOST': `${phases[phase].name}-postgresql${phases[phase].suffix}`,
      'CHANGE_ID': phases.build.changeId || '0'
    }
  }))
  
  oc.applyRecommendedLabels(objects, name, phase, `${changeId}`, instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, 'build-1.0.0-dev')
  oc.applyAndDeploy(objects, instance)
}