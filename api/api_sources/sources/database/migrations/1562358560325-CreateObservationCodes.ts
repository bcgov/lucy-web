//
// Migration file for JurisdictionCode table
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

import {MigrationInterface, QueryRunner} from 'typeorm';
import { SpeciesDensityCodeSchema, SpeciesDistributionCodeSchema, getSQLFileData } from '../database-schema';
import { SpeciesAgencyCodeSchema } from '../database-schema';
import { SurveyTypeCodeSchema } from '../database-schema';
import { SoilTextureCodeSchema } from '../database-schema';
import { SurveyGeometryCodeSchema } from '../database-schema';
import { SpecificUseCodeSchema } from '../database-schema';
/**
 * @description Migration File create JurisdictionCode table
 */
export class CreateObservationCode1562358560325 implements MigrationInterface {
    densitySchema: SpeciesDensityCodeSchema = new SpeciesDensityCodeSchema();
    distributionSchema: SpeciesDistributionCodeSchema = new SpeciesDistributionCodeSchema();
    agencyCodeSchema: SpeciesAgencyCodeSchema = new SpeciesAgencyCodeSchema();
    surveyTypeCodeSchema: SurveyTypeCodeSchema = new SurveyTypeCodeSchema();
    soilTextureCodeSchema: SoilTextureCodeSchema = new SoilTextureCodeSchema();
    surveyGeometryCodeSchema: SurveyGeometryCodeSchema = new SurveyGeometryCodeSchema();
    specificUseCodeSchema: SpecificUseCodeSchema = new SpecificUseCodeSchema();
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating Tables
        await queryRunner.query(this.densitySchema.migrationSQL);
        await queryRunner.query(this.distributionSchema.migrationSQL);
        await queryRunner.query(this.agencyCodeSchema.migrationSQL);
        await queryRunner.query(this.surveyTypeCodeSchema.migrationSQL);
        await queryRunner.query(this.soilTextureCodeSchema.migrationSQL);
        await queryRunner.query(this.surveyGeometryCodeSchema.migrationSQL);
        await queryRunner.query(this.specificUseCodeSchema.migrationSQL);
        // Pre-load codes
        await queryRunner.query(getSQLFileData(this.densitySchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.distributionSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.agencyCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.surveyTypeCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.soilTextureCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.surveyGeometryCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.specificUseCodeSchema.dataSQLPath()));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // Deleting code tables
        await queryRunner.query(this.densitySchema.dropTable());
        await queryRunner.query(this.distributionSchema.dropTable());
        await queryRunner.query(this.agencyCodeSchema.dropTable());
        await queryRunner.query(this.surveyTypeCodeSchema.dropTable());
        await queryRunner.query(this.soilTextureCodeSchema.dropTable());
        await queryRunner.query(this.surveyGeometryCodeSchema.dropTable());
        await queryRunner.query(this.specificUseCodeSchema.dropTable());
    }

}
