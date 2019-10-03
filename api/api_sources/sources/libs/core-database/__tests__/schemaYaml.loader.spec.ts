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
 * File: schemaYaml.loader.spec.ts
 * Project: lucy
 * File Created: Thursday, 3rd October 2019 9:10:58 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 3rd October 2019 9:11:27 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
import { should } from 'chai';
import { getYAMLFilePath, getYAMLFileData } from '../schemaYaml.loader';

describe(' Test Schema YAML file loader', () => {
    it('should return path', () => {
        const path = getYAMLFilePath('sample.schema.yaml');
        // console.log(`PATH: ${path}`);
        should().exist(path);
    });

    it('should return schema yaml data', () => {
        const data = getYAMLFileData('sample.schema.yaml');
        should().exist(data);
    });
});

// -----------------------------------
