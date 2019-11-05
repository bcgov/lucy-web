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
 * File: 1572894977602-MusselAppDatabase.ts
 * Project: lucy
 * File Created: Monday, 4th November 2019 11:16:17 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 4th November 2019 11:25:45 am
 * Modified By: pushan
 * -----
 */


import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { WatercraftRiskAssessmentSchema } from '../database-schema';

export class MusselAppDatabase1572894977602 extends AppDBMigrator implements MigrationInterface {

    waterCraftRiskAssessmentSchema: WatercraftRiskAssessmentSchema;
    /**
     * Setup
     */
    setup() {
        // Adding Water craft risk assessment init schema to migrator
        this.waterCraftRiskAssessmentSchema = new WatercraftRiskAssessmentSchema();
        this.addSchemaInitVersion(this.waterCraftRiskAssessmentSchema);
    }

    /**
     * DB Migration UP
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Start Log
        this.log('[START]', 'UP');
        // Running all up migration files
        await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
        this.log('[END]', 'UP');
    }

     /**
     * DB Migration Down
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        this.log('[RUN]', 'DOWN');
        await queryRunner.query(this.waterCraftRiskAssessmentSchema.dropTable());
    }

}
