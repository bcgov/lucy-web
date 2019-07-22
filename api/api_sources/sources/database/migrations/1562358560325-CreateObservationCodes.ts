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
/**
 * @description Migration File create JurisdictionCode table
 */
export class CreateObservationCode1562358560325 implements MigrationInterface {
    densitySchema: SpeciesDensityCodeSchema = new SpeciesDensityCodeSchema();
    distributionSchema: SpeciesDistributionCodeSchema = new SpeciesDistributionCodeSchema();
    agencyCodeSchema: SpeciesAgencyCodeSchema = new SpeciesAgencyCodeSchema();
    surveyTypeCodeSchema: SurveyTypeCodeSchema = new SurveyTypeCodeSchema();
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
        // Pre-load codes
        await queryRunner.query(getSQLFileData(this.densitySchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.distributionSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.agencyCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.surveyTypeCodeSchema.dataSQLPath()));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.densitySchema.dropTable());
        await queryRunner.query(this.distributionSchema.dropTable());
        await queryRunner.query(this.agencyCodeSchema.dropTable());
        await queryRunner.query(this.surveyTypeCodeSchema.dropTable());
    }

}
