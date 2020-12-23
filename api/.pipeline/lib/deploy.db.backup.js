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
  const changeId = phases[phase].changeId || 'dev-tools';
  const oc= new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift/tools'))
  var objects = [];
  const instance = phases[phase].instance;
  const name = `${phases[phase].name}-backup`;
  delete options.git;
  const dbIdentifiers = {
    'dev': 'bk-7068ad-dev-s8nuyo61qmct',
    'prod': 'bk-7068ad-prod-rt7kpgp8p2a2',
    'test': 'bk-7068ad-test-1d2ol2h3lcy5'
  };
  // The deployment of your cool app goes here ▼▼▼
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db.backup.dc.yaml`, {
    'param':{
      'NAME': `${name}`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'DATABASE_SERVICE_NAME': `${phases[phase].name}-postgresql${phases[phase].suffix}`,
      'NFS_VOLUME_IDENTIFIER': dbIdentifiers[phase]
    }
  }))
  
  oc.applyRecommendedLabels(objects, name, phase, `${changeId}`, instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, 'latest')
  oc.applyAndDeploy(objects, instance)
}