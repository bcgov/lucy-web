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
 * File: schema.helper.spec.ts
 * Project: lucy
 * File Created: Wednesday, 23rd October 2019 2:56:27 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 23rd October 2019 2:56:43 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as fs from 'fs';
import * as _ from 'underscore';
import { should, expect } from 'chai';
import { SchemaHelper } from '../schema.helper';
import {  getSQLFileData } from '../sql.loader';
import { Test2Schema } from './test.schema';

const schema = new Test2Schema();
console.dir(schema);
describe('Test Schema Helper Utility', () => {
    before(() => {});
    it('should create migration files', () => {
        const dryRun = process.env.ENVIRONMENT === 'local' ? false : true;
        const r1 = SchemaHelper.shared.createMigrationFiles(schema, dryRun);
        const r2 = SchemaHelper.shared.createRevertMigrationFiles(schema, dryRun);
        should().exist(r1);
        should().exist(r2);
        if (!dryRun) {
            const sqlFiles = SchemaHelper.shared.allSqlFiles(schema);
            _.each(sqlFiles.allFiles, (path: string) => {
                expect(fs.existsSync(path)).to.be.equal(true);
            });

            // Check root migration file content
            should().exist(schema.migrationSQL);

            // Check() a version migration sql file content
            should().exist(getSQLFileData(sqlFiles.migrations.test2, schema.className));
            should().exist(getSQLFileData(sqlFiles.migrations.test, schema.className));

            // Check() revert migration sql file which will us as down cmd
            should().exist(getSQLFileData(sqlFiles.revertMigrations.test, schema.className));
            should().exist(getSQLFileData(sqlFiles.revertMigrations.test2, schema.className));
        }
    });

    it('should give migration files', () => {
        const fileInfo = SchemaHelper.shared.migrationFiles(schema);
        expect(fileInfo).to.be.eql(schema.migrationFiles);
        // Root migration file name
        expect(fileInfo.root).to.be.equal(schema.className);

        // Migration file name of particular version
        expect(fileInfo.test2).to.be.equal(`${schema.className}-${schema.table.versions[1].fileName}.up.sql`);
    });

    it('should add version column to schema', () => {
        // Check version columns are added to columnDef
        should().exist(schema.table.columns.address);
        expect(schema.table.columns.address).to.be.equal('sample_address');
        should().exist(schema.table.columns.tag);
        expect(schema.table.columns.tag).to.be.equal('tag');
        should().exist(schema.table.columns.count);
        expect(schema.table.columns.count).to.be.equal('count');
        should().exist(schema.table.columns.top);
        expect(schema.table.columns.top).to.be.equal('top');
    });

    it('should copy from other schema', () => {
        should().exist(schema.table.columns.copy1);
        should().exist(schema.table.getVersion('test-copy'));
    });
});


// ---------------------------------
