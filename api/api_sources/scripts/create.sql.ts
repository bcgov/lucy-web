//
// Generate Sql file from schema file
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
// Created by Pushan Mitra on 2019-07-05.
//
/**
 * Imports
 */
import 'reflect-metadata';
import { JurisdictionCodeSchema, getSQLFilePath, ObservationSchema, ObservationSpeciesSchema } from '../sources/database/database-schema';
import { SpeciesSchema } from '../sources/database/database-schema';
import { SpeciesDistributionCodeSchema } from '../sources/database/database-schema';
import { SpeciesDensityCodeSchema } from '../sources/database/database-schema';
import { SpeciesAgencyCodeSchema } from '../sources/database/database-schema';
import { SoilTextureCodeSchema } from '../sources/database/database-schema';
import { SpecificUseCodeSchema } from '../sources/database/database-schema';


(() => {
    const jurisdictionSchema = new JurisdictionCodeSchema();
    const path = getSQLFilePath(`${jurisdictionSchema.className}.sql`);
    jurisdictionSchema.createMigrationFile(path);
    jurisdictionSchema.createDataEntry();

    const observation = new ObservationSchema();
    observation.createMigrationFile();

    const observationSpecies = new ObservationSpeciesSchema();
    observationSpecies.createMigrationFile();

    const species = new SpeciesSchema();
    species.createDataEntry();

    const speciesDistribution = new SpeciesDistributionCodeSchema();
    speciesDistribution.createMigrationFile();
    speciesDistribution.createDataEntry();

    const speciesDensity = new SpeciesDensityCodeSchema();
    speciesDensity.createMigrationFile();
    speciesDensity.createDataEntry();

    const agency = new SpeciesAgencyCodeSchema();
    agency.createMigrationFile();
    agency.createDataEntry();


    const soilTextureSchema = new SoilTextureCodeSchema();
    soilTextureSchema.createMigrationFile();
    soilTextureSchema.createDataEntry();


    const specificUseCodeSchema = new SpecificUseCodeSchema();
    specificUseCodeSchema.createMigrationFile();
    specificUseCodeSchema.createDataEntry();
})();
