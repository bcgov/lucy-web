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
 * File: countryProvinceSchema.ts
 * Project: lucy
 * File Created: Thursday, 30th January 2020 11:44:20 am
 * Author: Pushan
 * -----
 * Last Modified: Thursday, 30th January 2020 11:44:25 am
 * Modified By: Pushan
 * -----
 */


/**
 * Imports
 */
import { RecordTableSchema } from './base.record.schema';
import { getYAMLFilePath } from '../../libs/core-database';

/**
 * @description Schema Class for WatercraftRiskAssessmentSchema
 */
export class CountrySchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('countryProvince.schema.yaml');
    }
}

/**
 * @description Schema Class for WatercraftRiskAssessmentSchema
 */
export class CountryProvinceSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('countryProvince.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

