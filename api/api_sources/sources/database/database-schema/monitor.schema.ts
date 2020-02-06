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
 * File: monitor.schema.ts
 * Project: lucy
 * File Created: Wednesday, 15th January 2020 2:52:17 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Wednesday, 15th January 2020 3:00:52 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import { RecordTableSchema, CodeTableSchema} from './base.record.schema';
import { getYAMLFilePath } from '../../libs/core-database';

export class MechanicalMonitorSchema extends RecordTableSchema {

    get schemaFilePath(): string {
        return getYAMLFilePath('mechanicalMonitor.schema.yaml');
    }
}

export class EfficacyCodeSchema extends CodeTableSchema {

    get schemaFilePath(): string {
        return getYAMLFilePath('efficacyCodes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}
