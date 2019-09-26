//
// Migration file for Application events table
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
import { ApplicationEventSchema, UserSessionSchema} from '../database-schema';

/**
 * @description Generated Migration file for creation of application events
 * @export class ApplicationEvent1559071014193
 */
export class ApplicationEvent1559071014193 extends ApplicationEventSchema implements MigrationInterface {

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating table
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.type} INT NOT NULL,
            ${this.table.columns.source} VARCHAR(200) NULL,
            ${this.table.columns.refSessionId} INT NULL,
            ${this.table.columns.note} VARCHAR(500)
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Foreign key -> session
        await queryRunner.query(`ALTER TABLE ${this.table.name}
        ADD CONSTRAINT FK_2019052812h49m FOREIGN KEY (${this.table.columns.refSessionId})
        REFERENCES ${UserSessionSchema.schema.name}(${UserSessionSchema.schema.columns.id})
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

