/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: 1574975395354-SpaceGeom.ts
 * Project: lucy
 * File Created: Thursday, 28th November 2019 1:09:55 pm
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 28th November 2019 1:10:17 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { SpaceGeomSchema } from '../database-schema';

export class SpaceGeom1574975395354 extends AppDBMigrator implements MigrationInterface {

    schema: SpaceGeomSchema;
    /**
     * Schemas
     */
    setup() {
        this.schema = new SpaceGeomSchema();
        this.addSchemaInitVersion(this.schema);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
         // Start Log
         this.log('[START]', 'UP');
         // Running all up migration files
         await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
         this.log('[END]', 'UP');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[STAR]', 'DOWN');
        await queryRunner.query(this.schema.dropTable());
        this.log('[END]', 'DOWN');
    }

}
