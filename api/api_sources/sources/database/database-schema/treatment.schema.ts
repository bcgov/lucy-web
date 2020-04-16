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
import { RecordTableSchema, CodeTableSchema, } from './base.record.schema';
import { getYAMLFilePath } from '../../libs/core-database';
import { TreatmentProviderCSVData, PesticideEmployerCSVData, ProjectManagementPlanCSVData, ChemicalTreatmentEmployeeCSVData } from '../pre.load';
import { convertDateString, arrayToString } from '../../libs/utilities';
import { BaseTableSchema } from '../applicationSchemaInterface';

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
export class MechanicalTreatmentSchema extends TreatmentSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('mechanicalTreatment.schema.yaml');
    }
}

/**
 * @description Schema Handler class for Mechanical Treatment Observation Schema
 */
export class MechanicalTreatmentObservationSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('mechanicalTreatmentObservation.schema.yaml');
    }
}

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

export class TreatmentProviderContractorSchema extends TreatmentSchema {
    csvData(): Promise<any> {
        const csv = new TreatmentProviderCSVData();
        return csv.load({
            license_expiry_date: (value: string) => convertDateString(value, 'DD-MMM-YY', 'YYYY-MM-DD')
        });
    }

    get hasDefaultValues(): boolean {
        return true;
    }

    entryString(input?: string, context?: string): string {
        const columns = this.table.columns;
        return `${columns.registrationNumber},` +
        `${columns.businessName},` +
        `${columns.category},${columns.address},` +
        `${columns.regions},` +
        `${columns.licenceExpiryDate},` +
        `${columns.serviceProvideIndicator}`;
    }
}

export class ChemicalTreatmentSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('chemical.treatment.schema.yaml');
    }
}

class ChemicalTreatmentStaticData extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('chemical.treatment.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}


export class PesticideEmployerCodeSchema extends ChemicalTreatmentStaticData {

    csvData(): Promise<any> {
        const csv = new PesticideEmployerCSVData();
        return csv.load({
            license_expiry_date: (value: string) => convertDateString(value, 'DD-MMM-YY', 'YYYY-MM-DD')
        });
    }

    entryString(): string {
        const columns = this.table.columns;
        return `${columns.registrationNumber},` +
        `${columns.businessName},` +
        `${columns.licenceExpiryDate}`;
    }
}

export class ProjectManagementPlanCodeSchema extends ChemicalTreatmentStaticData {
    csvData(): Promise<any> {
        const csv = new ProjectManagementPlanCSVData();
        return csv.load();
    }

    entryString(): string {
        const columns = this.table.columns;
        return `${columns.pmpNumber},` +
        `${columns.description},` +
        `${columns.pmpHolder},` +
        `${columns.startDate},` +
        `${columns.endDate}`;
    }
}

export class ChemicalTreatmentEmployeeSchema extends ChemicalTreatmentStaticData {

    csvData(): Promise<any> {
        const csv = new ChemicalTreatmentEmployeeCSVData();
        return csv.load();
    }

    entryString(): string {
        return arrayToString(this.table.allColumnsExceptId);
    }
}

export class HerbicideSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('herbicide.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

export class HerbicideTankMixSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('herbicideMix.schema.yaml');
    }
}

export class ObservationChemicalTreatmentSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('herbicideMix.schema.yaml');
    }
}

export class WindDirectionCodesSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('windDirection.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

export class ChemicalTreatmentMethodCodeSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('chemical.treatment.codes.schema.yaml');
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

// ----------------------------------------------------------

