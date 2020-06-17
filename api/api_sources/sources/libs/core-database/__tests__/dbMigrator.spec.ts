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
 * File: dbMigrator.spec.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 1:32:37 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 1st November 2019 1:54:47 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

import { expect, should } from 'chai';
import { DBMigrator } from '../dbMigrator';
import { Test2Schema } from './test.schema';

const schema: Test2Schema = new Test2Schema();
class TestQuery {
    async query(q: string): Promise<any> {
        return q;
    }
}
class TestMigrator extends DBMigrator {
    setup() {
        this.addSchemaVersion(schema, 'test');
        this.addDataImportMigration(schema, 'init');
    }
}
describe('Test DBMigrator class', () => {
    it('should test DBMigrator class instance', () => {
        const tm = new TestMigrator();
        should().exist(tm);
        expect(tm.upMigrations().length).to.be.greaterThan(0);
        expect(tm.downMigrations().length).to.be.greaterThan(0);
        expect(tm.importMigrations().length).to.be.greaterThan(0);
        expect(tm.isSQLFileHandled(schema.migrationFiles['test'], schema.className)).to.be.equal(true);
    });

    it.skip('should migrator run query', async () => {
        const dryRun = process.env.ENVIRONMENT === 'local' ? false : true;
        const tm = new TestMigrator();
        let r = await tm.runQuerySqlFiles(tm.upMigrations(), new TestQuery(), dryRun);
        should().exist(r);
        r = await tm.runQuerySqlFiles(tm.importMigrations(), new TestQuery(), dryRun);
        should().exist(r);
    });
});

