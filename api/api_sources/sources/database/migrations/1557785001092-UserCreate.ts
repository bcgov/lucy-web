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
import { InitialUsers, ProdAdmins } from '../initial-data';
import { UserSchema, UserRoleSchema } from '../database-schema';
import { AppLogger } from '../../Applogger';
import { AppEnvConstant } from '../../app-constants';

/**
 * @description Generated Migration file for creation of user tables and user_roles table
 * @export class UserCreate1557785001092
 */
export class UserCreate1557785001092 extends AppLogger implements MigrationInterface {

    userSchema: UserSchema = new UserSchema();
    userRoleSchema: UserRoleSchema = new UserRoleSchema();

    async loadDefaultUsers(users: any[], queryRunner: QueryRunner) {
        for (const admin of users) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB(this.userSchema.table.name, admin));
            if (admin.additionalInitDataInfo) {
                const roles = admin.additionalInitDataInfo.roles;
                // Get user id
                const result = await queryRunner
                .query(`SELECT ${this.userSchema.table.id} from ${this.userSchema.table.name} WHERE ${this.userSchema.table.columns.email} = '${admin.email}'`);
                if (result[0].user_id) {
                    for (const role of roles) {
                        // Create role
                        await queryRunner.query(`
                        INSERT INTO ${this.userRoleSchema.table.name} (${this.userRoleSchema.table.columns.user}, ${this.userRoleSchema.table.columns.role})
                        VALUES (${result[0].user_id}, ${role})`);
                        this.info(`Role is created for user [${result[0].user_id}, ${admin.email}] role: ${role}`);
                    }
                }
            }
        }
    }

    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {

        this.info('[Running]');
        // Creating table

        // Creating User from migration SQL
        await queryRunner.query(this.userSchema.migrationSQL);
        await queryRunner.query(this.userRoleSchema.migrationSQL);


        // Create Initial Admins based on env
        if (process.env.ENVIRONMENT === AppEnvConstant.APP_ENV_PROD) {
            this.info('[LOADING PROD ADMINS]');
            await this.loadDefaultUsers(ProdAdmins, queryRunner);
            if (process.env.DB_SEED === AppEnvConstant.DB_SEED_ENABLE) {
                await this.loadDefaultUsers([InitialUsers[0]], queryRunner);
            }
        } else {
            this.info('[LOADING DEFAULT USERS]');
            await this.loadDefaultUsers(InitialUsers, queryRunner);
        }
        this.info('[DONE]');
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(``);
        await queryRunner.query(this.userRoleSchema.dropTable());
        await queryRunner.query(this.userSchema.dropTable());
    }

}
// ----------------------------------------------------------------------------------------------------------------
