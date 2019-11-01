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
import { JurisdictionCodeSchema, getSQLFileData } from '../database-schema';
/**
 * @description Migration File create JurisdictionCode table
 */
export class CreateJurisdictionCode1562358560315 implements MigrationInterface {
    schema: JurisdictionCodeSchema = new JurisdictionCodeSchema();
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating Table
        await queryRunner.query(this.schema.migrationSQL);
        // Pre-load species
        await queryRunner.query(getSQLFileData(this.schema.dataSQLPath(), this.schema.className));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.schema.dropTable());
        await queryRunner.query(`DROP TABLE IF EXISTS jurisdiction_code_table`);
    }

}
