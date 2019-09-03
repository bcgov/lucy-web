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
 * File: schemaLoader.ts
 * Project: lucy
 * File Created: Tuesday, 23rd July 2019 11:56:24 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 23rd July 2019 11:56:31 am
 * Modified By: pushan
 * -----
 **/
// Imports
import * as assert from 'assert';
import * as _ from 'underscore';
import { yaml, verifyObject } from './helpers.utilities';
import { TableColumnDefinition } from '../core-database';

export class SchemaCache {
    static _cached: {[key: string]: SchemaLoader} = {};
    static getSchemaLoader(path: string): SchemaLoader {
        if (this._cached[path]) {
            return this._cached[path];
        } else {
            const sl = new SchemaLoader(path);
            sl.verify();
            this._cached[path] = sl;
            return sl;
        }
    }
}


interface Schema {
    name: string;
    description: string;
    columns: {[key: string]: TableColumnDefinition };
}

const ValidName = {
    sqlName: /[a-z][a-z0-9_]*/gm,
};

interface TableSchemaInfo {
    schema: string;
    columns: string[];
}

export class SchemaLoader {
    schemaFileObj: any;
    tables: {[key: string]: TableSchemaInfo} = {};
    constructor(input: string | any) {
        let schemaFileObj: any;
        if (typeof input === 'string') {
            schemaFileObj = yaml(input);
        } else {
            schemaFileObj = input;
        }
        assert(schemaFileObj, `SchemaLoader: Unable to load schema from path/input: ${JSON.stringify(input)}`);
        assert(schemaFileObj.schemas, `SchemaLoader:No Schema is found on file: ${JSON.stringify(input)}\n DATA: ${JSON.stringify(schemaFileObj)}`);
        this.schemaFileObj = schemaFileObj;
    }

    clean() {
        this.tables = {};
    }

    verify() {
        _.each(this.schemaFileObj.schemas, (schema, key: string) => this.verifySchema(schema, key));
        this.verifyForeignTable();
        this.clean();
        return true;
    }

    verifySchema(rawSchema: any, schemaName: string) {
        const schema: Schema = rawSchema as Schema;
        // console.log(`1. ${JSON.stringify(schema)} <= ${JSON.stringify(rawSchema)} `);
        assert(schema, new Error(`SchemaLoader(v): Unknown schema format: ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        assert(schema.columns, new Error(`SchemaLoader(v): Schema should have columns: ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        assert((Object.keys(schema.columns).length > 0), new Error(`SchemaLoader(v): Unknown schema format: ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        const tableName = schema.name;
        assert(tableName.match(ValidName.sqlName) !== null, new Error(`SchemaLoader(v): Schema ${schemaName} table name ${tableName} is invalid`));
        const obj = {};
        obj[tableName] = { schema: schemaName, columns: []};
        this.tables = { ...this.tables, ...obj};
        _.each(schema.columns, (column, key: string) => this.verifyColumn(column, key, tableName));
        return;
    }

    verifyColumn(rawColumn: any, columnName: string, table: string) {
        const column: TableColumnDefinition = rawColumn as TableColumnDefinition;
        assert(column, new Error(`SchemaLoader(vc): Unknown column for`));
        verifyObject(column, ['name', 'comment'], 'SchemaLoader(vc)');
        // Check name
        const name = column.name;
        assert(name.match(ValidName.sqlName) !== null, new Error(`SchemaLoader(vc): Column ${columnName} has invalid name: ${name}`));
        // Check comment
        assert(column.comment, new Error(`SchemaLoader(vc): Column ${columnName} comment is missing`));

        // Checking foreignTable
        if (column.foreignTable) {
            assert(column.foreignTable.match(ValidName.sqlName), new Error(`SchemaLoader(vc): invalid foreignTable => ${column.foreignTable}`));
        }

        // Checking refColumn
        if (column.refColumn) {
            assert(column.refColumn.match(ValidName.sqlName), new Error(`SchemaLoader(vc): invalid refColumn name => ${column.refColumn}`));
        }


        // Adding column to table
        this.tables[table].columns.push(name);
    }

    verifyForeignTable() {
        _.each(this.schemaFileObj.schemas, (schema: Schema) => this.verifySchemaForeignTable(schema));
    }

    verifySchemaForeignTable(schema: Schema) {
        _.each(schema.columns, (col, name: string) => this.verifyColumnForeignTable(col, name));
    }

    verifyColumnForeignTable(column: TableColumnDefinition, columnKey: string) {
        const ft = column.foreignTable || '';
        if (ft) {
            // Checking Foreign table
            // 1. Check for external tables
            const filter = _.filter(this.schemaFileObj.externalTables || [], (ext: any) => ext.name === ft);
            if (filter.length === 0) {
                assert(this.tables[ft], new Error(`SchemaLoader(vfc): No foreign Table ${ft} for column ${columnKey}:${column.name}`));

                // Checking Ref column
                const rc = column.refColumn || '';
                if (rc) {
                    const columns = this.tables[ft].columns;
                    assert(columns.includes(rc) === true, new Error(`SchemaLoader(vfc): no ref column ${rc} for ${column}:${column.name} with foreign table ${ft}`));
                }
                column.refSchema = this.tables[ft].schema;
            } else {
                column.refSchema = filter[0].schema;
            }
        }
    }
}

// ---------------------------------------------------------------------------

