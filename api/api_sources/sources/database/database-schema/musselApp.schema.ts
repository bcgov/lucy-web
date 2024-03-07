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
 * File: musselApp.schema.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 6:05:55 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 1st November 2019 6:07:12 pm
 * Modified By: pushan (you@you.you>)
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
export class WatercraftRiskAssessmentSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('watercraftRiskAssessment.schema.yaml');
    }
}

/**
 * @description Schema Class for WaterBodySchema
 */
export class WaterBodySchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('waterBody.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

/**
 * @description Schema Class for MajorCitySchema
 */
 export class MajorCitySchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('majorCities.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

/**
 * @description Schema Class for ObserverWorkflowSchema
 */
export class ObserverWorkflowSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('observerWorkflow.schema.yaml');
    }
}

export class HighRiskAssessmentSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('highRiskAssessment.schema.yaml');
    }
}

export class WatercraftJourneySchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('watercraftJourney.schema.yaml');
    }
}

export class PreviousAISKnowledgeSourceSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('inspectApp.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

export class PreviousInspectionSourceSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('inspectApp.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

export class AdultMusselsLocationSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('inspectApp.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

export class BlowBySchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('blowBy.schema.yaml');
    }
}
