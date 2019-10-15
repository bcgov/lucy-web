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
 * File: db.query.runner.ts
 * Project: lucy
 * File Created: Tuesday, 1st October 2019 2:00:50 pm
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 1st October 2019 2:00:55 pm
 * Modified By: pushan
 * -----
 */

import { Connection } from 'typeorm';
import { DBManager } from '../sources/database';
(async () => {
    console.log(`Running Query => ${process.argv[2]}`);
    await DBManager.shared.connect();
    const connection: Connection = DBManager.shared.connection;
    const result = await connection.query(`${process.argv[2]}`);
    console.log(JSON.stringify(result, null, 2));
    await DBManager.shared.close();
})();
// -----------------------------------------
