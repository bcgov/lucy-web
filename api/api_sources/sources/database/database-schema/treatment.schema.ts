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
 * File: treatment.schema.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 10:07:08 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 10:08:53 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import { RecordTableSchema, CodeTableSchema } from './base.record.schema';
import { getYAMLFilePath } from './schema-files';

/**
 * @description Treatment base schema class which includes schema file name
 */
export class TreatmentSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('treatment.schema.yaml');
    }
}

/**
 * @description Base code table schema for treatment codes
 */
export class TreatmentCodeSchema extends CodeTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('treatment.schema.yaml');
    }
}

/**
 * @description Schema Handler class for Mechanical Treatment Schema
 */
export class MechanicalTreatmentSchema extends TreatmentSchema {}

/**
 * @description Schema Handler for Mechanical Treatment Code
 */
export class MechanicalMethodCodeSchema extends TreatmentCodeSchema {}

/**
 * @description Schema Handler for Mechanical Disposal MethodCode
 */
export class MechanicalDisposalMethodCodeSchema extends TreatmentCodeSchema {}

/**
 * @description Schema handler for MechanicalTreatmentDisturbanceCode
 */
export class MechanicalSoilDisturbanceCodeSchema extends TreatmentCodeSchema {}

/**
 * @description Schema handler for MechanicalRootRemovalCodeSchema
 */
export class MechanicalRootRemovalCodeSchema extends TreatmentCodeSchema {}

/**
 * @description Schema handler for  MechanicalTreatmentIssueCode
 */
export class MechanicalTreatmentIssueCodeSchema extends TreatmentCodeSchema {}

// ----------------------------------------------------------

