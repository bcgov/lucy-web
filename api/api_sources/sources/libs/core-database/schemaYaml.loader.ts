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
 * File: schemaYaml.loader.ts
 * Project: lucy
 * File Created: Thursday, 3rd October 2019 9:06:55 am
 * Author: pushan
 * -----
 * Last Modified: Thursday, 3rd October 2019 9:21:21 am
 * Modified By: pushan
 * -----
 */

import * as fs from 'fs';
import * as path from 'path';

const schemaYAMLDir = 'schema-files';
export const getYAMLFilePath = (fileName: string) => path.resolve(__dirname, `../../../${schemaYAMLDir}/${fileName}`);

export const getYAMLFileData = (fileName: string) => fs.readFileSync(getYAMLFilePath(fileName), 'utf8');

// ------------------------------------------------------------------
