//
// Migration file for Species table
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
// Created by Pushan Mitra on 2019-07-02.
/**
 * Imports
 */
import {MigrationInterface, QueryRunner} from 'typeorm';
import { SpeciesSchema, getSQLFileData } from '../database-schema';

/**
 * @description Migration class to create Species table
 */
export class CreateSpecies1562193477462 extends SpeciesSchema implements MigrationInterface {

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Create Table
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.mapCode} VARCHAR(4) NULL,
            ${this.table.columns.earlyDetection} BOOLEAN NULL,
            ${this.table.columns.cmt} SMALLINT NULL,
            ${this.table.columns.shp} SMALLINT NULL,
            ${this.table.columns.species} VARCHAR(4) NULL,
            ${this.table.columns.genus} VARCHAR(4) NULL,
            ${this.table.columns.commonName} VARCHAR(50) NULL,
            ${this.table.columns.latinName} VARCHAR(50) NULL
        )`);

        // Create Timestamp Column
        await queryRunner.query(this.createTimestampsColumn());

        // Create Audit column
        await queryRunner.query(this.createAuditColumns());

        // Create Comments
        await queryRunner.query(this.createComments());

        // Pre-load species
        await queryRunner.query(getSQLFileData(this.dataSQLPath()));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
    }

}
