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
 * File: 1570467225818-CreateChemicalTreatment.ts
 * Project: lucy
 * File Created: Monday, 7th October 2019 9:53:45 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 7th October 2019 9:54:08 am
 * Modified By: pushan
 * -----
 */

import {MigrationInterface, QueryRunner} from 'typeorm';
import { ChemicalTreatmentSchema } from '../database-schema';

export class CreateChemicalTreatment1570467225818 implements MigrationInterface {

    /**
     * Schemas
     */
    // ChemicalTreatment Schema
    chemicalTreatmentSchema: ChemicalTreatmentSchema = new ChemicalTreatmentSchema();

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {

        // Running Chemical Treatment Migration
        await queryRunner.query(this.chemicalTreatmentSchema.migrationSQL);
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // Dropping Chemical Treatment Table
        await queryRunner.query(this.chemicalTreatmentSchema.dropTable());
    }

}
