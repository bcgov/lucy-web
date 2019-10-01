//
// Migration file for Session activity tables
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
import { DatabaseMigrationHelper } from '../migration.helpers';
import { DefaultSessionActivityCodes} from '../initial-data';
import { SessionActivitySchema, SessionActivityCodeSchema } from '../database-schema';
import { AppLogger } from '../../Applogger';

/**
 * @description Generated Migration file for creation of Session activity table
 * @export class UserSessionActivity1559071433925
 */
export class UserSessionActivity1559071433925 extends AppLogger implements MigrationInterface {

    sessionActivityCodeSchema: SessionActivityCodeSchema = new SessionActivityCodeSchema();
    sessionActivitySchema: SessionActivitySchema = new SessionActivitySchema();
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {

        this.info('[RUNNING]');
        await queryRunner.query(this.sessionActivityCodeSchema.migrationSQL);

        // Put default values
        for (const code of DefaultSessionActivityCodes) {
            await queryRunner.query(DatabaseMigrationHelper.shared.insertJSONInDB('session_activity_code', code));
        }

        // Create table Session activity
        // Schema
        await queryRunner.query(this.sessionActivitySchema.migrationSQL);
        this.info('[DONE]');
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.sessionActivitySchema.dropTable());
        await queryRunner.query(this.sessionActivityCodeSchema.dropTable());
    }
}

// ----------------------------------------------------------------------------------------------------------------

