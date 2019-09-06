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
 * File: test.js
 * Project: pipeline
 * File Created: Friday, 6th September 2019 2:06:07 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 6th September 2019 2:06:31 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

'use strict';
// Imports/require
const settings = require('./lib/config.js');
const testTask = require('./lib/test.api.js');

testTask(Object.assign(settings, { phase: settings.options.env}));