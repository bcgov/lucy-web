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
import { RecordTableSchema} from './base.record.schema';

export class SpeciesSchema extends RecordTableSchema {
    defineTable() {
        const table: ApplicationTable = super.defineTable();
        table.name = 'species';
        table.description = 'Table to store species information';
        table.columnsDefinition = {
            id: defineColumn('species_id', 'Auto generated incremental primary key column'),
            mapCode: defineColumn('map_code', 'Code associated with species'),
            earlyDetection: defineColumn('edrr', 'Early detection species'),
            cmt: defineColumn('cmt', 'Containment species'),
            shp: defineColumn('shp', 'Containment spatial reference'),
            species: defineColumn('species', 'Latin species first 4 characters'),
            genus: defineColumn('genus', 'Latin Genus first 3 characters'),
            commonName: defineColumn('commonName', 'Common name text'),
            latinName: defineColumn('latin_name', 'Latin name text')
        };
        return table;
    }
}
// -----------------------------------------------------------------------------------------
