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
 * File: build.db.js
 * Project: pipeline
 * File Created: Friday, 6th September 2019 10:22:18 am
 * Author: pushan
 * -----
 * Last Modified: Friday, 6th September 2019 10:22:22 am
 * Modified By: pushan
 * -----
 */
'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const options = settings.options
  const oc=new OpenShiftClientX(Object.assign({'namespace':phases.build.namespace}, options));
  const phase='build'
  let objects = []
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  const name = `${phases[phase].name}-db`
  // The building of your cool app goes here ▼▼▼
  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/db.bc.yaml`, {
    'param':{
      'NAME': `${name}`,
      'NAME_SUFFIX': `${phases[phase].suffix}`,
      'TAG_NAME': `${phases[phase].tag}`
    }
  }));

  oc.applyRecommendedLabels(objects, `${name}`, phase, phases[phase].changeId, phases[phase].instance)
  oc.applyAndBuild(objects)
}