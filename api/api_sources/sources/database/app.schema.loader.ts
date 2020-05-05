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
 * File: app.schema.loader.ts
 * Project: lucy
 * File Created: Monday, 16th September 2019 12:34:09 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 16th September 2019 12:34:14 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

import * as schemas from './database-schema';

let _schemaMap: any;

/**
 * @description Load all schema into a map
 */
export const appSchemaMap = () => {
    if (_schemaMap) {
        return _schemaMap;
    } else {
        const result: any = {};
        for (const k in schemas) {
            if (schemas.hasOwnProperty(k)) {
                const schemaObj: any = schemas[k];
                if (schemaObj && typeof schemaObj === 'function' && schemaObj.shared) {
                    const schema = new schemaObj();
                    result[schema.className] = true;
                }
            }
        }
        _schemaMap = result;
        return _schemaMap;
    }
};

// -----------------------------------------------

