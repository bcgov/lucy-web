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
import {
    ChemicalTreatmentSchema,
    PesticideEmployerCodeSchema,
    getSQLFileData,
    ProjectManagementPlanCodeSchema,
    ChemicalTreatmentEmployeeSchema
} from '../database-schema';
import { AppLogger } from '../../Applogger';

export class CreateChemicalTreatment1570467225818 extends AppLogger implements MigrationInterface {

    /**
     * Schemas
     */
    // ChemicalTreatment Schema
    chemicalTreatmentSchema: ChemicalTreatmentSchema = new ChemicalTreatmentSchema();
    employerSchema: PesticideEmployerCodeSchema = new PesticideEmployerCodeSchema();
    pmpSchema: ProjectManagementPlanCodeSchema = new ProjectManagementPlanCodeSchema();
    employeeSchema: ChemicalTreatmentEmployeeSchema = new ChemicalTreatmentEmployeeSchema();

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {

        // Running Migrations
        this.info('[Starting]');
        // Employer Code
        await queryRunner.query(this.employerSchema.migrationSQL);
        // PreLoad Data
        await queryRunner.query(getSQLFileData(this.employerSchema.dataSQLPath(), this.employerSchema.className));

        // PMP
        await queryRunner.query(this.pmpSchema.migrationSQL);
        await queryRunner.query(getSQLFileData(this.pmpSchema.dataSQLPath(), this.pmpSchema.className));

        // Employee
        await queryRunner.query(this.employeeSchema.migrationSQL);
        await queryRunner.query(getSQLFileData(this.employeeSchema.dataSQLPath(), this.employeeSchema.className));

        // Chemical Treatment
        await queryRunner.query(this.chemicalTreatmentSchema.migrationSQL);

        this.info('[DONE]');
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // Dropping Tables
        // Chemical Treatment
        await queryRunner.query(this.chemicalTreatmentSchema.dropTable());

        // Employer Code
        await queryRunner.query(this.employerSchema.dropTable());

        // PMP
        await queryRunner.query(this.pmpSchema.dropTable());

        // Employee
        await queryRunner.query(this.employeeSchema.dropTable());

        // Removing Old Code
        await queryRunner.query('DROP TABLE IF EXISTS project_management_code');
    }

}
