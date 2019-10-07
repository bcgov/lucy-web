//
// Migration file for User message table
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import {MigrationInterface, QueryRunner} from 'typeorm';
import { UserMessagesSchema} from '../database-schema';
import { AppLogger } from '../../Applogger';

/**
 * @description Generated Migration file for creation of user message table
 * @export class UserMessageCreate1560098448360
 */
export class UserMessageCreate1560098448360 extends AppLogger implements MigrationInterface {
    messageSchema: UserMessagesSchema = new UserMessagesSchema();
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        this.info('[RUNNING]');
        await queryRunner.query(this.messageSchema.migrationSQL);
        this.info('[DONE]');
    }

     /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(this.messageSchema.dropTable());
    }
}
// ----------------------------------------------------------------------------------------------------------------

