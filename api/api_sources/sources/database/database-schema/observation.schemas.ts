//
// Observation related schemas
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-07-03.
/**
 * Imports
 */
import { ApplicationTable, defineColumn} from '../applicationSchemaInterface';
import { RecordTableSchema, CodeTableSchema} from './base.record.schema';
import { getYAMLFilePath } from './schema-files';
import { SpeciesCSVData, JurisdictionCodeCSVData, SpeciesDistributionCodeCSVData, SpeciesDensityCodeCSVData, CodeCSVData } from '../pre.load';

export class SpeciesSchema extends RecordTableSchema {
    private _dataSqlPath = 'SpeciesData.sql';
    defineTable() {
        const table: ApplicationTable = super.defineTable();
        table.name = 'species';
        table.description = 'Table to store species information';
        table.columnsDefinition = {
            id: defineColumn('species_id', 'Auto generated incremental primary key column'),
            mapCode: defineColumn('map_code', 'Code associated with species'),
            earlyDetection: defineColumn('early_detection_ind', 'Early detection species'),
            cmt: defineColumn('containment_species', 'Containment species'),
            shp: defineColumn('containment_species_spatial_ref', 'Containment spatial reference'),
            species: defineColumn('species_code', 'Latin species first 4 characters'),
            genus: defineColumn('genus_code', 'Latin Genus first 3 characters'),
            commonName: defineColumn('common_name', 'Common name text'),
            latinName: defineColumn('latin_name', 'Latin name text')
        };
        return table;
    }

    csvData(): Promise<any> {
        const csvData = new SpeciesCSVData();
        return csvData.load();
    }

    entryString(input?: string, context?: string): string {
        return 'map_code, early_detection_ind, containment_species,containment_species_spatial_ref,species_code, genus_code,common_name,latin_name';
    }

    async createDataEntry() {
        await super.createDataEntry();
    }

    dataSQLPath(): string {
        return this._dataSqlPath;
    }
}

export class JurisdictionCodeSchema extends CodeTableSchema {
    private _dataSqlPath = 'JurisdictionCodeData.sql';
    get schemaFilePath(): string {
        return getYAMLFilePath('observation.codes.schema.yaml');
    }

    async createDataEntry() {
        await super.createDataEntry();
    }

    entryString(input?: string, context?: string): string {
        return 'jurisdiction_code,description';
    }

    csvData(): Promise<any> {
        const csvData = new JurisdictionCodeCSVData();
        return csvData.load();
    }

    dataSQLPath(context?: any): string {
        return this._dataSqlPath;
    }
}

export class ObservationSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('observation.codes.schema.yaml');
    }
}

export class ObservationSpeciesSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('observation.codes.schema.yaml');
    }
}

export class ObservationCodeTable extends CodeTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('observation.codes.schema.yaml');
    }
}
export class SpeciesDistributionCodeSchema extends ObservationCodeTable {
    csvData(): Promise<any> {
        const csvData = new SpeciesDistributionCodeCSVData();
        return csvData.load();
    }
    entryString(input?: string, context?: string): string {
        return `${this.table.columns.id},${this.table.columns.description}`;
    }
}
export class SpeciesDensityCodeSchema extends ObservationCodeTable {
    csvData(): Promise<any> {
        const csvData = new SpeciesDensityCodeCSVData();
        return csvData.load();
    }
}
export class SurveyTypeCodeSchema extends ObservationCodeTable {
    csvData(): Promise<any> {
        const csvData = new CodeCSVData('SurveyTypeCode.csv');
        return csvData.load();
    }
}

export class SpeciesAgencyCodeSchema extends ObservationCodeTable {
    csvData(): Promise<any> {
        const csvData = new CodeCSVData('SurveyAgencyCode.csv');
        return csvData.load();
    }
}
// -----------------------------------------------------------------------------------------
