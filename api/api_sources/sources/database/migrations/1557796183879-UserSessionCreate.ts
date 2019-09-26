//
// Migration file for UserSession
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
import { UserSessionSchema, UserSchema} from '../database-schema';

/**
 * @description Generated Migration file for creation of user session
 * @export class UserSessionCreate1557796183879
 */
export class UserSessionCreate1557796183879 extends UserSessionSchema implements MigrationInterface {

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Schema
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.lastLoginAt} TIMESTAMP NULL,
            ${this.table.columns.token} VARCHAR (5000) NULL,
            ${this.table.columns.tokenExpiry} TIMESTAMP NULL,
            ${this.table.columns.tokenLifetime} INT NULL,
            ${this.table.columns.lastActiveAt} TIMESTAMP NULL,
            ${this.table.columns.refUserId} INT NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Foreign Key
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019051d15h34m FOREIGN KEY (${this.table.columns.refUserId})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE CASCADE;`);

        // Alter user table to add foreign key ref to user table
        await queryRunner.query(`ALTER TABLE ${UserSchema.schema.name}
        ADD CONSTRAINT FK_20190606d9h38m FOREIGN KEY (${UserSchema.schema.columns.refCurrentSession})
        REFERENCES ${this.table.name}(${this.table.columns.id})
        ON DELETE SET NULL;`);
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ${UserSchema.schema.name} DROP CONSTRAINT FK_20190606d9h38m`);
        await queryRunner.query(this.dropTable());
    }
}

// ----------------------------------------------------------------------------------------------------------------

