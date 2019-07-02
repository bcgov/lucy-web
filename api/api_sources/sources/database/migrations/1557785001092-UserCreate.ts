//
// Migration file for User table
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
import { InitialUsers } from '../initial-data';
import { UserSchema, RolesCodeTableSchema } from '../database-schema';

/**
 * @description Generated Migration file for creation of user tables and user_roles table
 * @export class UserCreate1557785001092
 */
export class UserCreate1557785001092 extends UserSchema implements MigrationInterface {

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {

        // Creating table
        await queryRunner.query(`CREATE TABLE ${this.table.name} (
            ${this.table.columns.id} SERIAL PRIMARY KEY,
            ${this.table.columns.firstName} VARCHAR (100) NULL,
            ${this.table.columns.lastName} VARCHAR (100) NULL,
            ${this.table.columns.email} VARCHAR (100) NOT NULL UNIQUE,
            ${this.table.columns.preferredUsername} VARCHAR (100) NULL,
            ${this.table.columns.loginType} SMALLINT NULL,
            ${this.table.columns.accountStatus} SMALLINT DEFAULT 1,
            ${this.table.columns.expiryDate} DATE NULL,
            ${this.table.columns.activation} SMALLINT NULL,
            ${this.table.columns.refCurrentSession} INT NULL
        );`);

        // Creating timestamp column
        await queryRunner.query(this.createTimestampsColumn());

        // Creating comments
        await queryRunner.query(this.createComments());

        // Create Join table for user and assigned role
        await queryRunner.query(`CREATE TABLE user_role (
            ref_user_id INT  REFERENCES ${this.table.name}(${this.table.columns.id}) ON DELETE CASCADE,
            ref_access_role_id INT REFERENCES ${RolesCodeTableSchema.schema.name}(${RolesCodeTableSchema.schema.columns.id}) ON DELETE CASCADE,
            PRIMARY KEY (ref_user_id, ref_access_role_id)
        );`);


        // Create Initial Admins
        for (const admin of InitialUsers) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB(this.table.name, admin));
            if (admin.additionalInitDataInfo) {
                const roles = admin.additionalInitDataInfo.roles;
                // Get user id
                const result = await queryRunner.query(`SELECT user_id from ${this.table.name} WHERE ${this.table.columns.email} = '${admin.email}'`);
                if (result[0].user_id) {
                    for (const role of roles) {
                        // Create role
                        await queryRunner.query(`INSERT INTO user_role VALUES (${result[0].user_id}, ${role})`);
                        console.log(`Role is created for user [${result[0].user_id}, ${admin.email}] role: ${role}`);
                    }
                }
            }
        }
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(``);
        await queryRunner.query('DROP TABLE IF EXISTS user_role');
        await queryRunner.query(this.dropTable());
    }

}
// ----------------------------------------------------------------------------------------------------------------
