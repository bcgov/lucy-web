//
// Migration file for Request access table
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
import { RequestAccessTableSchema, RolesCodeTableSchema, UserSchema} from '../database-schema';

/**
 * @description Generated Migration file for creation of Request Access table
 * @export class RequestAccessCreate1559696717385
 */
export class RequestAccessCreate1559696717385 extends RequestAccessTableSchema implements MigrationInterface {

     /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.requestNote} VARCHAR(500) NULL,
            ${this.table.columns.refRequestType} INT NOT NULL,
            ${this.table.columns.refRequester} INT NOT NULL,
            ${this.table.columns.refApprover} INT NULL,
            ${this.table.columns.status} INT NULL,
            ${this.table.columns.approverNote} VARCHAR(500) NULL
        );`);

        // Create timestamp
        await queryRunner.query(this.createTimestampsColumn());

        // Create comments
        await queryRunner.query(this.createComments());

        // Add Foreign Keys
        // 1. Request type
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h25m FOREIGN KEY (${this.table.columns.refRequestType})
        REFERENCES ${RolesCodeTableSchema.schema.name}(${RolesCodeTableSchema.schema.columns.id})
        ON DELETE CASCADE;`);
        // 2. Requester
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h28m FOREIGN KEY (${this.table.columns.refRequester})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE CASCADE;`);
        // 3. Approver 
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_201906056h30m FOREIGN KEY (${this.table.columns.refApprover})
        REFERENCES ${UserSchema.schema.name}(${UserSchema.schema.columns.id})
        ON DELETE SET NULL;`);

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
