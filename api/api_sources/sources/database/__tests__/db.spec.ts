//
// General test for db utilities
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
// Created by Pushan Mitra on 2019-07-04.
//
import * as path from 'path';
import { should, expect } from 'chai';
import { ApplicationTableColumn, defineColumn, createColumn, BaseTableSchema, ApplicationTable} from '../applicationSchemaInterface';

class TestSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = super.defineTable();
        table.name = 'test_table';
        table.columnsDefinition = {
            id: createColumn({ name: 'id', comment: 'PK', definition: 'INT NOT NULL'}),
            col: createColumn({name: 'col', comment: 'Regular', definition: 'VARCHAR(20) NULL'}),
            ref: createColumn({name: 'ref', comment: 'Ref', definition: 'INT NULL', foreignTable: 'user', refColumn: 'id', deleteCascade: true}),
            ref2: createColumn({name: 'ref2', comment: 'Ref', definition: 'INT NULL', foreignTable: 'user', refColumn: 'id', deleteCascade: false})
        };
        return table;
    }
}

class Test2Schema extends BaseTableSchema {
    get schemaFilePath(): string {
        return path.resolve(__dirname, '../database-schema/schema-files/sample.schema.yaml');
    }
}

describe('Test for db utilities', () => {
    it('should return column create sql', () => {
        const table = 'jjy';
        const columnName = 'laba';
        const columnCmt = 'test column';
        const refTable = 'user';
        const refColumn = 'user_id';

        // Test to check column with on delete null ref
        const column1: ApplicationTableColumn = defineColumn(columnName, columnCmt, 'VARCHAR(10) NOT NULL', refTable, refColumn);
        const sql = column1.createColumnSql(table);
        should().exist(sql);
        expect(sql).to.equal(`ALTER TABLE ${table} ADD COLUMN ${columnName} VARCHAR(10) NOT NULL REFERENCES ${refTable}(${refColumn}) ON DELETE SET NULL;`);

        // Test to check column with on delete cascade ref
        const column2: ApplicationTableColumn = defineColumn(columnName, columnCmt, 'VARCHAR(10) NOT NULL', refTable, refColumn, true);
        const sql2 = column2.createColumnSql(table);
        expect(sql2).to.equal(`ALTER TABLE ${table} ADD COLUMN ${columnName} VARCHAR(10) NOT NULL REFERENCES ${refTable}(${refColumn}) ON DELETE CASCADE;`);

        // Test to check column with no ref
        const column3: ApplicationTableColumn = defineColumn(columnName, columnCmt, 'VARCHAR(10) NOT NULL');
        const sql3 = column3.createColumnSql(table);
        expect(sql3).to.equal(`ALTER TABLE ${table} ADD COLUMN ${columnName} VARCHAR(10) NOT NULL;`);
    });

    it('should create table sql', () => {
        const schema = new TestSchema();
        const sql = schema.createTable();
        console.log(sql);
        should().exist(sql);
    });

    it('should load and create sql from schema yaml', () => {
        const schema = new Test2Schema();
        const sql = schema.createTable();
        console.log(sql);
        should().exist(sql);
        schema.table.name = 'sample2_table';
        schema.saveSchema();
        schema.createMigrationFile(path.resolve(__dirname, '../database-schema/schema-sqls/sample.sql'));
        // schema.saveSchema(path.resolve(__dirname, '../database-schema/schema-files/sample2.schema.yaml'));
    });
});

// ------------------------------------------------------------------------------------
