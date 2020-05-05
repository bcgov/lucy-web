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
 * File: app.const.ts
 * Project: lucy
 * File Created: Monday, 21st October 2019 2:25:24 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 21st October 2019 2:25:28 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * @description Env const of application
 */
export const AppEnvConstant = {
    DB_MIGRATION_TYPE_REFRESH: 'refresh',
    DB_MIGRATION_TYPE_REVERT_LATEST: 'revertLatest',
    DB_CLEANUP_TYPE_NOME: 'none',
    DB_CLEANUP_TYPE_TEMP_USERS: 'temp-users',
    DB_SEED_ENABLE: 'yes',
    APP_ENV_DEV: 'dev',
    APP_ENV_TEST: 'test',
    APP_ENV_PROD: 'prod',
    APP_ENV_LOCAL: 'local'
};
