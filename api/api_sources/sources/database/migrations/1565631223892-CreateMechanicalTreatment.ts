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
 * File: 1565631223892-CreateMechanicalTreatment.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 10:33:44 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 10:34:28 am
 * Modified By: pushan
 * -----
 */

import {MigrationInterface, QueryRunner} from 'typeorm';
import { MechanicalTreatmentSchema } from '../database-schema';

export class CreateMechanicalTreatment1565631223892 implements MigrationInterface {

    /**
     * Schemas
     */
    mechanicalTreatmentSchema: MechanicalTreatmentSchema = new MechanicalTreatmentSchema();

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.mechanicalTreatmentSchema.migrationSQL);
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.mechanicalTreatmentSchema.dropTable());
    }

}
