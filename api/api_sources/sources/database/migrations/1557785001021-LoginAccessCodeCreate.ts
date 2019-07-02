//
// Migration file for RolesCodeTable
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
// Created by Pushan Mitra on 2019-05-20.
/**
 * Imports
 */
import {MigrationInterface, QueryRunner} from 'typeorm';
import { DatabaseMigrationHelper} from '../migration.helpers';
import { DefaultLoginAccessCodes } from '../initial-data';
import { RolesCodeTableSchema} from '../database-schema';

/**
 * @description Generated Migration file for creation of role table
 * @export class LoginAccessCodeCreate1557785001021
 */
export class LoginAccessCodeCreate1557785001021 extends RolesCodeTableSchema implements MigrationInterface {

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        // Schema
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.code} VARCHAR (100)  NOT NULL UNIQUE,
            ${this.table.columns.role} VARCHAR(100) NOT NULL,
            ${this.table.columns.description} VARCHAR(500) NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());
        // Put default values
        for (const code of DefaultLoginAccessCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB(this.table.name, code));
        }
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

// ----------------------------------------------------------------------------------------------------------------

