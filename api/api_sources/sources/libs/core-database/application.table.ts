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
 * File: application.table.ts
 * Project: lucy
 * File Created: Friday, 30th August 2019 1:31:26 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 30th August 2019 1:33:17 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as _ from 'underscore';
import { ApplicationTableColumn, SchemaChangeOptions, DataFieldDefinition} from './application.column';
import { unWrap } from '../utilities';

/**
 * @description Change column type constants in schema version
 */
export const ColumnChangeType = {
    RENAME: 'rename',
    DROP: 'drop',
    KEY_CHANGE: 'key-change',
    CUSTOM: 'custom',
    UPDATE: 'update'
};

/**
 * @description Interface to check column changes
 */
export interface SchemaChangeDefinition extends SchemaChangeOptions {
    existingColumn: ApplicationTableColumn;
    type: string;
}

/**
 * @description Interface to store table version information in schema file
 */
export interface TableVersionDefinition {
    name: string;
    id?: string;
    columns?: {[key: string]: any};
    schemaChanges?: any[];
    info?: string;
}

/**
 * @description Interface to store detailed schema version info and migration file associated that
 */
export interface TableVersion extends TableVersionDefinition {
    name: string;
    fileName: string;
    columns: {[key: string]: ApplicationTableColumn};
    schemaChanges: SchemaChangeDefinition[];
    info?: string;
}

/**
 * @description CSV import options for table
 */
export interface CSVImportOptions {
    fileName: string;
    entryColumns: string[];
    info?: string;
    transformer?: string;
    allColumns?: boolean;
    allColumnsExcept?: string[];
    ignoreDataColumns?: string[];
}

export interface GroupFieldOptions {
    key: string;
    fields: {[key: string]: string};
}

export interface SeedOptions {
    fileName: string;
    environments?: string[];
    allColumnsExcept?: string[];
    mapper?: any;
    groupFields: GroupFieldOptions[];
}

export interface TableRelation {
    header?: any;
    description?: any;
    type: string;
    relationshipType: string;
    schema?: string;
    tableName?: string;
    meta?: any;
}

export interface SqlInfo {
    comment?: string;
    before?: boolean;
    sql: string;
    downSql?: string;
}

/**
 * @description Table definition descriptor class
 * @export class ApplicationTable
 */
export class ApplicationTable {
    name: string;
    columnsDefinition: {[key: string]: ApplicationTableColumn} = {};
    initialColumns: {[key: string]: ApplicationTableColumn} = {};
    description = 'Application table';
    private _columnNames: {[key: string]: string};
    meta: any;
    layout: any;
    displayLayout: any;
    computedFields: any;
    relations: {[key: string]: TableRelation};
    modelName?: string;
    versions: TableVersion[] = [];
    importOptions: {[key: string]: CSVImportOptions} = {};
    batchImportOptions: {[key: string]: SeedOptions} = {};
    viewColumn = 'id';
    columVersions: {[key: string]: ApplicationTableColumn[]} = {};
    initialSqlCommands: SqlInfo[] = [];


    get relationalColumnKeys(): string[] {
        const r: string[] = [];
        _.each(this.columnsDefinition, (col: ApplicationTableColumn, key) => {
            if (col.foreignTable || col.refSchema) {
                r.push(key);
            }
        });
        return r;
    }

    get columns(): {[key: string]: string} {
        if (this._columnNames && _.keys(this._columnNames) === _.keys(this.columnsDefinition)) {
            return this._columnNames;
        }
        const names: {[key: string]: string} = {};
        for (const k in this.columnsDefinition) {
            if (this.columnsDefinition.hasOwnProperty(k)) {
                const col: ApplicationTableColumn = this.columnsDefinition[k];
                names[k] = col.name;
            }
        }
        this._columnNames = names;
        return this._columnNames;
    }

    get id(): string {
        return this.columnsDefinition && this.columnsDefinition.id ? this.columnsDefinition.id.name : 'NA';
    }

    public createTableSql(): string {
        let sql = '';
        const createTable = `CREATE TABLE ${this.name} ();`;
        const allColumns: string[] = _.map(this.initialColumns, (column: ApplicationTableColumn) => column.createColumnSql(this.name));
        _.each(allColumns, (sqlString: string) => (sql = sql + `${sqlString}\n`));
        return `${createTable}\n${sql}`;
    }

    public createCommentsForTable(): string {
        let commentForColumns = ``;
        for (const key in this.initialColumns) {
            if (this.columnsDefinition.hasOwnProperty(key)) {
                const column: ApplicationTableColumn = this.initialColumns[key];
                commentForColumns = commentForColumns + `COMMENT ON COLUMN ${this.name}.${column.name} IS '${column.comment}';\n`;
            }
        }
        return `COMMENT ON TABLE ${this.name} IS '${this.description}';\n${commentForColumns}`;
    }

    public isValidColumnName(columnName: string): boolean {
        return _.contains(this.columns, columnName);
    }

    public get relationSchemas(): string [] {
        const result: string[] = [];
        _.each(this.columnsDefinition, def => def.refSchema ? result.push(def.refSchema) : null);
        return result;
    }

    public get relationModels(): string [] {
        const result: string[] = [];
        _.each(this.columnsDefinition, def => def.refModel ? result.push(def.refModel) : null);
        return result;
    }

    public get allColumns(): string[] {
        return _.map(this.columns, col => col);
    }

    public get allColumnsExceptId(): string[] {
        const r: string[] = [];
        _.each(this.columns, (col, key) => {
            if (key !== 'id') {
                r.push(col);
            }
        });
        return r;
    }

    get displayLabelInfo(): any {
        if (this.displayLayout && this.displayLayout.displayLabel) {
            const format: string = this.displayLayout.displayLabel || '';
            const re = /#\([a-zA-Z0-9.]*\)/gi;
            const re1 = /[a-zA-Z0-9]+[.a-zA-Z0-9]*/gi;
            const groups: any[] = format.match(re) as any[];
            const keys = [];
            for (const g of groups) {
                const k = g.match(re1);
                keys.push(k[0]);
            }
            return {
                format: format,
                keys: keys
            };
        }
        return null;
    }

    handleColumnChanges(columnChange: SchemaChangeOptions): SchemaChangeDefinition {
        const key = columnChange.newKey || columnChange.existingKey;
        const existingColumnDef = this.columnsDefinition[columnChange.existingKey];
        const type = columnChange.type || ColumnChangeType.KEY_CHANGE;

        // Verify change type are having consistent data
        // Type
        if (!columnChange.type) {
            throw new Error(`Table: handleColumnChanges: No type`);
        }
        // RENAME type must have different column name
        if (type === ColumnChangeType.RENAME) {
            if (!columnChange.newColumnName) {
                throw new Error(`Table: handleColumnChanges: RENAME => No new column name`);
            }
            if (columnChange.newColumnName === existingColumnDef.name) {
                throw new Error(`Table: handleColumnChanges: RENAME => same name ${existingColumnDef.name}`);
            }
        }

        if (type === ColumnChangeType.UPDATE) {
            if (!columnChange.column) {
                throw new Error(`Table: handleColumnChanges: UPDATE: No new column def`);
            }
            if (columnChange.column.name !== existingColumnDef.name) {
            throw new Error(`Table: handleColumnChanges: UPDATE: New definition name mismatch existing ${existingColumnDef.name} new name ${columnChange.column.name}`);
            }

        }

        // Deleting existing column for any other kind of changes
        if (this.columnsDefinition[columnChange.existingKey] && type !== ColumnChangeType.RENAME) {
            // Store it in version
            if (existingColumnDef) {
                if (this.columVersions[columnChange.existingKey]) {
                    this.columVersions[columnChange.existingKey].push(existingColumnDef);
                } else {
                    this.columVersions[columnChange.existingKey] = [existingColumnDef];
                }
            }
            delete (this.columnsDefinition[columnChange.existingKey]);
        }
        // Handling column rename
        if (this.columnsDefinition[columnChange.existingKey] && type === ColumnChangeType.RENAME) {
            const newColum: ApplicationTableColumn = { ...existingColumnDef } as ApplicationTableColumn;
            newColum.name = columnChange.newColumnName || existingColumnDef.name;
            this.columnsDefinition[columnChange.existingKey] = newColum;
        }


        if (type !== ColumnChangeType.DROP  && type !== ColumnChangeType.RENAME) {
            if (columnChange.column) {
                this.columnsDefinition[key] = ApplicationTableColumn.createColumn(columnChange.column);
            } else {
                this.columnsDefinition[key] = existingColumnDef;
            }
        }
        return {
            existingKey: columnChange.existingKey,
            newKey: columnChange.newKey,
            existingColumn: existingColumnDef,
            column: this.columnsDefinition[key],
            newColumnName: columnChange.newColumnName,
            type: type,
            deleteColumn: columnChange.deleteColumn
        };
    }

    getVersion(version: number | string): TableVersion {
        if (typeof version === typeof '') {
            return this.versions.filter( v => v.name === version)[0];
        } else {
            return this.versions[version];
        }
    }

    get embeddedRelations(): string[] {
        const r: string[] = [];
        _.each(this.columnsDefinition, (c: DataFieldDefinition, k: string) => {
            if (unWrap(c.meta, {}).embedded) {
                r.push(k);
            }
        });
        _.each(this.relations, (rel: TableRelation, k: string) => {
            if (unWrap(rel.meta, {}).embedded) {
                r.push(k);
            }
        });
        return r;
    }

    get viewColumnInfo(): any {
        return {
            columnName: this.columnsDefinition['id'].name,
            key: 'id'
        };
    }
}
