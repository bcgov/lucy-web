//
// Migration file for Session activity tables
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
import { MigrationInterface, QueryRunner } from 'typeorm';
import { DatabaseMigrationHelper } from '../migration.helpers';
import { DefaultSessionActivityCodes} from '../initial-data';
import { SessionActivitySchema, SessionActivityCodeSchema, UserSessionSchema} from '../database-schema';

/**
 * @description Generated Migration file for creation of Session activity table
 * @export class UserSessionActivity1559071433925
 */
export class UserSessionActivity1559071433925 extends SessionActivitySchema implements MigrationInterface {
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table session_activity_codes
        await queryRunner.query(`CREATE TABLE ${SessionActivityCodeSchema.schema.name} (
            ${SessionActivityCodeSchema.schema.columns.id} SERIAL PRIMARY KEY,
            ${SessionActivityCodeSchema.schema.columns.code} VARCHAR (100) NULL UNIQUE,
            ${SessionActivityCodeSchema.schema.columns.description} VARCHAR (500) NULL
        );`);
        // Creating timestamp column
        await queryRunner.query(`${SessionActivityCodeSchema.shared.createTimestampsColumn()}`);

        // Creating comments
        await queryRunner.query(`${SessionActivityCodeSchema.shared.createComments()}`);

        // Put default values
        for (const code of DefaultSessionActivityCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('session_activity_code',code));
        }

        // Create table Session activity
        // Schema
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columnsDefinition.id.name} SERIAL PRIMARY KEY,
            ${this.table.columnsDefinition.refSessionId.name} INT NOT NULL,
            ${this.table.columnsDefinition.refActivityCode.name} INT NOT NULL,
            ${this.table.columnsDefinition.info.name} VARCHAR(500) NULL
        );`);

         // Creating timestamp column
         await queryRunner.query(`${this.createTimestampsColumn()}`);

         // Create comments
         await queryRunner.query(`${this.createComments()}`);

        // Foreign Key -> session
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h36m FOREIGN KEY (${this.table.columns.refSessionId})
        REFERENCES ${UserSessionSchema.schema.name}(${UserSessionSchema.schema.columns.id})
        ON DELETE CASCADE;`);

        // Foreign Key -> activity codes
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h38m FOREIGN KEY (${this.table.columnsDefinition.refActivityCode.name})
        REFERENCES ${SessionActivityCodeSchema.schema.name}(${SessionActivityCodeSchema.schema.columnsDefinition.id.name})
        ON DELETE CASCADE;`);
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.dropTable());
        await queryRunner.query(SessionActivityCodeSchema.shared.dropTable());
    }
}

// ----------------------------------------------------------------------------------------------------------------

