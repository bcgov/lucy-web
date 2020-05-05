//
// Migration run script
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
//

/**
 * Imports
 */
import 'reflect-metadata';

/**
 * Application Migration task
 */
import { AppDatabaseMigrationManager } from '../sources/database/migration.helpers';
import { AppEnvConstant } from '../sources/app-constants';
/**
 * Script
 */
(async () => {
    try {
        const TYPE = process.env.DB_MIGRATION_TYPE || '';
        if (TYPE === AppEnvConstant.DB_MIGRATION_TYPE_REFRESH) {
            // Refreshing database: Drop all existing migration and refresh
            console.log('[MIGRATION]: REFRESH');
            await AppDatabaseMigrationManager.shared.refresh();
        } else {
            // Migrating db
            console.log('[MIGRATION]: NORMAL');
            await AppDatabaseMigrationManager.shared.migrate();
        }
    } catch (excp) {
        console.log(`MIGRATION: ${process.env.DB_MIGRATION_TYPE || 'NA'} : Error: ${excp}`);
        process.exit(1);
    }
})();

// -----
