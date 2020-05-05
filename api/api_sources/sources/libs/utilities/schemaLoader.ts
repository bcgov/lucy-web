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
import { yaml, verifyObject, unWrap, copyKeyAndSubKeys } from './helpers.utilities';
import { TableColumnDefinition, getYAMLFilePath, TableVersionDefinition, SchemaChangeOptions } from '../core-database';

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

interface SchemaCopyOptions {
    columns?: string[];
    versions?: string[];
    relations?: string[];
    computedFields?: string[];
    fields?: string[];
}

interface Schema {
    name: string;
    description: string;
    columns: {[key: string]: TableColumnDefinition};
    versions?: TableVersionDefinition[];
    processed?: boolean;
    relations?: {[key: string]: any};
    computedFields?: {[key: string]: any};
    fields?: {[key: string]: any};
    copyFrom: {[key: string]: SchemaCopyOptions};
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
    filePath = '[NA]';
    constructor(input: string | any) {
        let schemaFileObj: any;
        if (typeof input === 'string') {
            this.filePath = input;
            schemaFileObj = yaml(input);
        } else {
            schemaFileObj = input;
        }
        assert(schemaFileObj, `SchemaLoader: ${this.filePath}: Unable to load schema from path/input: ${JSON.stringify(input)}`);
        assert(schemaFileObj.schemas, `SchemaLoader: ${this.filePath} :No Schema is found on file: ${JSON.stringify(input)}\n DATA: ${JSON.stringify(schemaFileObj)}`);

        // Check for includes
        if (schemaFileObj.includes && schemaFileObj.includes.length > 0) {
            // Loading included schemas
            const includes: string[] = schemaFileObj.includes as string[];
            for (const file of includes) {
                // Get file path
                const schemaFilePath = getYAMLFilePath(file);
                if (schemaFilePath !== input) {
                    // load schema
                    const includedSchema: SchemaLoader = SchemaCache.getSchemaLoader(schemaFilePath);

                    // Copy all schemas in included schemas
                    schemaFileObj.schemas = { ...schemaFileObj.schemas, ...includedSchema.schemaFileObj.schemas};

                    // Copy all external tables
                    const existing = schemaFileObj.externalTables || [];
                    if (includedSchema.schemaFileObj.externalTables) {
                        schemaFileObj.externalTables = [ ...existing, ...includedSchema.schemaFileObj.externalTables];
                    }
                    if (includedSchema.tables) {
                        this.tables = { ...this.tables, ...includedSchema.tables};
                    }
                }
            }
            this.schemaFileObj = schemaFileObj;
        } else {
            this.schemaFileObj = schemaFileObj;
        }
    }

    clean() {
        this.tables = {};
    }

    label(tag: string, message: string) {
        return `SchemaLoader (${tag}): ${this.filePath} => ${message}`;
    }

    verify() {
        try {
            _.each(this.schemaFileObj.schemas, (schema, key: string) => this.verifySchema(schema, key));
            this.verifyForeignTable();
            return true;
        } catch (excp) {
            console.log(`${this.filePath} : Excp: ${excp}`);
            console.log(`${this.filePath}: ${JSON.stringify(this.schemaFileObj, null, 2)}`);
            return false;
        }
    }
    verifySchema(rawSchema: any, schemaName: string) {
        if (rawSchema.skipVerification) {
            return;
        }
        const schema: Schema = rawSchema as Schema;
        // console.log(`1. ${JSON.stringify(schema)} <= ${JSON.stringify(rawSchema)} `);
        assert(schema, new Error(`SchemaLoader(v): ${this.filePath}: Unknown schema format: ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        assert(schema.columns, new Error(`SchemaLoader(v): ${this.filePath}: Schema should have columns: ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        assert((
            Object.keys(schema.columns).length > 0),
            new Error(`SchemaLoader(v): ${this.filePath}: Unknown schema format(1): ${JSON.stringify(rawSchema)} for schema: ${schemaName}`));
        const tableName = schema.name;
        assert(tableName.match(ValidName.sqlName) !== null, new Error(`SchemaLoader(v): ${this.filePath}: Schema ${schemaName} table name ${tableName} is invalid`));
        if (schema.processed) {
            return;
        }
        const obj = {};
        obj[tableName] = { schema: schemaName, columns: []};
        this.tables = { ...this.tables, ...obj};
        _.each(schema.columns, (column, key: string) => this.verifyColumn(column, key, tableName));
        schema.versions = schema.versions || [];
        _.each(schema.versions, (ver, index: number) => this.verifyVersions(ver, index, tableName));
        this.copyFrom(schema);
        schema.processed = true;
        return;
    }

    _copyKeys(mainKey: string, source: Schema, destination: Schema, keys?: string[]) {
        copyKeyAndSubKeys(mainKey, source, destination, keys);
    }

    copyFrom(schema: Schema) {
        if (schema.copyFrom && Object.keys(schema.copyFrom).length > 0) {
            const copyFrom: {[key: string]: SchemaCopyOptions} = schema.copyFrom || {};
            _.each(copyFrom, (info: SchemaCopyOptions, schemaName: string) => {
                // Get Schema from
                if (this.schemaFileObj.schemas[schemaName]) {
                    const copySchema: Schema = this.schemaFileObj.schemas[schemaName] as Schema;
                    // Copy columns
                    this._copyKeys('columns', copySchema, schema, info.columns);
                    // Relations
                    if (info.relations) {
                        this._copyKeys('relations', copySchema, schema, info.relations);
                    }
                    // Computed Fields
                    if (info.computedFields) {
                        this._copyKeys('computedFields', copySchema, schema, info.computedFields);
                    }
                    // Non-db fields
                    this._copyKeys('fields', copySchema, schema, info.fields);

                    // Now copy versions
                    if (info.versions && copySchema.versions) {
                        const copyVersions: TableVersionDefinition[] = [];
                        for (const v of copySchema.versions) {
                            if (info.versions.includes(v.name)) {
                                copyVersions.push(v);
                            }
                        }
                        schema.versions = [ ...(schema.versions || []), ...copyVersions ];
                    }

                }
            });
        }
    }

    verifyVersions(rawVersion: any, index: number, table: string) {
        const schemaVersion: TableVersionDefinition = rawVersion as TableVersionDefinition;
        assert(schemaVersion, new Error(this.label('vv', `Unable to load version ${index}`)));
        assert(schemaVersion.name, new Error(this.label('vv', `Unable to load version.name ${index}`)));
        if (schemaVersion.columns) {
            // Checking all columns
            _.each(schemaVersion.columns, (col, key: string) => this.verifyColumn(col, key, table));
        }
        if (schemaVersion.schemaChanges) {
            _.each(schemaVersion.schemaChanges, (col: SchemaChangeOptions) => {
                if (col.column) {
                    this.verifyColumn(col.column, col.existingKey, table);
                }
            });
        }
    }

    verifyColumn(rawColumn: any, columnName: string, table: string) {
        const column: TableColumnDefinition = rawColumn as TableColumnDefinition;
        assert(column, new Error(`SchemaLoader(vc): ${this.filePath}:  Unknown column for`));
        verifyObject(column, ['name', 'comment'], 'SchemaLoader(vc)');
        // Check name
        const name = column.name;
        assert(name.match(ValidName.sqlName) !== null, new Error(`SchemaLoader(vc): ${this.filePath}: Column ${columnName} has invalid name: ${name}`));
        // Check comment
        assert(column.comment, new Error(`SchemaLoader(vc): ${this.filePath}: Column ${columnName} comment is missing`));

        // Checking foreignTable
        if (column.foreignTable) {
            assert(column.foreignTable.match(ValidName.sqlName), new Error(`SchemaLoader(vc): ${this.filePath}: invalid foreignTable => ${column.foreignTable}`));
        }

        // Checking refColumn
        if (column.refColumn) {
            assert(column.refColumn.match(ValidName.sqlName), new Error(`SchemaLoader(vc): ${this.filePath}: invalid refColumn name => ${column.refColumn}`));
        }


        // Adding column to table
        this.tables[table].columns.push(name);
    }

    verifyForeignTable() {
        _.each(this.schemaFileObj.schemas, (schema: Schema) => this.verifySchemaForeignTable(schema));
    }

    verifySchemaForeignTable(schema: Schema) {
        _.each(schema.columns, (col, name: string) => this.verifyColumnForeignTable(col, name));
        // Checking each version of the schema
        if (schema.versions) {
            _.each(schema.versions, (ver: TableVersionDefinition) => {
                _.each(unWrap(ver.columns, [] as TableColumnDefinition[]), (col: TableColumnDefinition, key: string) => this.verifyColumnForeignTable(col, key));

                _.each(unWrap(ver.schemaChanges, [] as SchemaChangeOptions[]), (change: SchemaChangeOptions) => {
                    if (change.column) {
                        this.verifyColumnForeignTable(change.column, change.existingKey);
                    }
                });
            });
        }
    }

    verifyColumnForeignTable(column: TableColumnDefinition, columnKey: string) {
        const ft = column.foreignTable || '';
        if (ft) {
            // Checking Foreign table
            // 1. Check for external tables
            const filter = _.filter(this.schemaFileObj.externalTables || [], (ext: any) => ext.name === ft);
            if (filter.length === 0) {
                assert(this.tables[ft], new Error(`SchemaLoader(vfc): ${this.filePath}: No foreign Table ${ft} for column ${columnKey}:${column.name}`));

                // Checking Ref column
                const rc = column.refColumn || '';
                if (rc) {
                    const columns = this.tables[ft].columns;
                    assert(
                        columns.includes(rc) === true,
                        new Error(`SchemaLoader(vfc): ${this.filePath}: no ref column ${rc} for ${column}:${column.name} with foreign table ${ft}`)
                    );
                }
                column.refSchema = this.tables[ft].schema;
            } else {
                column.refSchema = filter[0].schema;
            }
        }
    }
}

// ---------------------------------------------------------------------------

