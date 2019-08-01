//
// Lib classes for application Schema Design
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
// Created by Pushan Mitra on 2019-05-17.
import * as _ from 'underscore';
import * as assert from 'assert';
import * as fs from 'fs';
import { unWrap, yaml, saveYaml, SchemaCache, SchemaLoader, incrementalWrite } from '../libs/utilities';
import { getSQLFileData, getSQLFilePath } from './database-schema/schema-sqls';

export type TableColumnRef = [string, string, boolean];
export interface TableColumnStruct {
    reference?: TableColumnRef;
    definition?: string;
}


export interface TableColumnDefinition {
    name: string;
    comment: string;
    definition?: string;
    foreignTable?: string;
    refColumn?: string;
    deleteCascade?: boolean;
}


/**
 * @description Column definition descriptor class
 * @export class ApplicationTableColumn
 */
export class ApplicationTableColumn implements TableColumnDefinition {
    name: string;
    comment = 'Application table column';
    definition?: string;
    foreignTable?: string;
    refColumn?: string;
    deleteCascade?: boolean;
    constructor(name: string, comment: string, definition?: string, foreignTable?: string, refColumn?: string, deleteCascade?: boolean) {
        this.name = name;
        this.comment = comment;
        this.definition = definition;
        this.foreignTable = foreignTable;
        this.refColumn = refColumn;
        this.deleteCascade = deleteCascade;
    }

    ref(reference?: string, refColumn?: string, deleteCascade?: boolean): string {
        const ref = reference || this.foreignTable;
        const refCol = refColumn || this.refColumn;
        const delCascade = deleteCascade || this.deleteCascade;
        if (ref && refCol) {
            const str = `REFERENCES ${ref}(${refCol}) ON DELETE`;
            return delCascade ? `${str} CASCADE` : `${str} SET NULL`;
        } else {
            return '';
        }
    }

    public sql(definition?: string, reference?: string, refColumn?: string, deleteCascade?: boolean): string {
        const def =  definition || this.definition || 'VARCHAR(10) NULL';
        const ref = this.ref(reference, refColumn, deleteCascade);
        return ref ? `${this.name} ${def} ${ref}` : `${this.name} ${def}`;
    }

    public createColumnSql(tableName: string, definition?: string, reference?: string, refColumn?: string, deleteCascade?: boolean): string {
        return `ALTER TABLE ${tableName} ADD COLUMN ${this.sql(definition, reference, refColumn, deleteCascade)};`;
    }

    get type(): string {
        let def = this.definition || '';
        def = def.toLowerCase();
        if (def.includes('varchar')) {
            return 'string';
        } else if (def.includes('serial') || def.includes('numeric')) {
            return 'number';
        } else if (def.includes('boolean')) {
            return 'boolean';
        } else if (def.includes('int') || def.includes('smallint')) {
            return 'number';
        } else {
            return 'object';
        }
    }

}

/**
 * @description Table definition descriptor class
 * @export class ApplicationTable
 */
export class ApplicationTable {
    name: string;
    columnsDefinition: {[key: string]: ApplicationTableColumn};
    description = 'Application table';
    private _columnNames: {[key: string]: string};

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
        return this.columnsDefinition.id.name;
    }

    public createTableSql(): string {
        let sql = '';
        const createTable = `CREATE TABLE ${this.name} ();`;
        const allColumns: string[] = _.map(this.columnsDefinition, (column: ApplicationTableColumn) => column.createColumnSql(this.name));
        _.each(allColumns, (sqlString: string) => (sql = sql + `${sqlString}\n`));
        return `${createTable}\n${sql}`;
    }

    public createCommentsForTable(): string {
        let commentForColumns = ``;
        for (const key in this.columnsDefinition) {
            if (this.columnsDefinition.hasOwnProperty(key)) {
                const column: ApplicationTableColumn = this.columnsDefinition[key];
                commentForColumns = commentForColumns + `COMMENT ON COLUMN ${this.name}.${column.name} IS '${column.comment}';\n`;
            }
        }
        return `COMMENT ON TABLE ${this.name} IS '${this.description}';\n${commentForColumns}`;
    }

    public isValidColumnName(columnName: string): boolean {
        return _.contains(this.columns, columnName);
    }
}

/**
 * @description Schema holder for entity
 * @export class BaseTableSchema
 */
export class  BaseTableSchema {

    // Shared Instance
    static shareInstance: BaseTableSchema;

    // Table
    table: ApplicationTable;

    // Join table definitions associated with table
    joinTables: {[key: string]: ApplicationTable};

    /**
     * @description Timestamps column associated with schema
     * @return object
     */
    static get timestampColumns(): {[key: string]: string} {
        return {
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            deletedAt: 'deleted_at'
        };
    }

    /**
     * @description Getter for shared instance
     * @return BaseTableSchema
     */
    static get shared(): BaseTableSchema {
        return this.shareInstance || (this.shareInstance = new this());
    }

    public get schemaFilePath(): string {
        return '';
    }

    public get className(): string {
        return this.constructor.name;
    }

    /**
     * @description Constructor
     */
    constructor() {
        let loadedFromFile = false;
        if (this.schemaFilePath && this.schemaFilePath !== '' && fs.existsSync(this.schemaFilePath)) {
            loadedFromFile = this.loadSchema();
        }

        if (!loadedFromFile) {
            this.table = this.defineTable();
            this.joinTables = this.defineJoinTable();
        }
        assert(this.table.id, `No {id} column for schema ${this.table.name}`);
        // Check table name

    }

    loadSchema(): boolean {
        const schemaLoader: SchemaLoader = SchemaCache.getSchemaLoader(this.schemaFilePath);
        const yamlObject: any = schemaLoader.schemaFileObj;
        // Get schema
        const def = (yamlObject.schemas || {})[this.constructor.name];
        if (!def) {
            return false;
        }
        const table = new ApplicationTable();
        table.name = def.name;
        table.description = def.description;
        table.columnsDefinition = {};
        _.each(def.columns, (value: TableColumnOption, key) => {
            const result = {};
            result[key] = new ApplicationTableColumn(value.name, value.comment, value.definition, value.foreignTable, value.refColumn, value.deleteCascade);
            table.columnsDefinition = {...table.columnsDefinition, ...result};
        });
        assert((Object.keys(table.columnsDefinition)).length > 0, 'Not able to load column def');
        this.table = table;
        return true;
    }

    saveSchema(newFilePath?: string) {
        const actual: string = newFilePath || this.schemaFilePath;
        assert(actual && actual !== '', `No File Path to save: ${this.className}`);
        const yamlObject: any = yaml(actual) || {version: '1.0', schemas: {}};
        let columns: any = {};
        _.each(this.table.columnsDefinition, (col: ApplicationTableColumn, key: string) => {
            const newObj: any = {};
            newObj[key] = col as TableColumnDefinition;
            columns = {...columns, ...newObj};
        });
        // Get schema
        yamlObject.schemas[this.className] = {
            name: this.table.name,
            description: this.table.description,
            columns: columns
        };

        saveYaml(yamlObject, actual, { skipInvalid: true});
    }

    createMigrationFile(inputFileToSave?: string) {
        const fileToSave = inputFileToSave || getSQLFilePath(`${this.className}.sql`);
        const create = this.createTable();
        const timestamp = this.createTimestampsColumn();
        const comments = this.createComments();
        const auditColumns = this.createAuditColumns();

        const final = `-- ### Creating Table: ${this.table.name} ### --\n
        \n${create}\n
        \n-- ### Creating Comments on table ### --\n
        \n${comments}\n
        \n-- ### Creating Timestamp column ### --\n
        \n${timestamp}\n
        \n-- ### Creating User Audit Columns ### --\n
        \n${auditColumns}\n -- ### End: ${this.table.name} ### --\n`;
        // console.log(`${final}`);
        incrementalWrite(fileToSave, final);
        return final;
    }

    get migrationSQL(): string {
        return getSQLFileData(`${this.className}.sql`);
    }

    createDataEntrySql(columns: string, values: any[]): string {
        let base = `-- ## Inserting into table: ${this.table.name} ## --\n`;
        _.each(values, (row, index) => {
            base = `${base}-- ## Inserting Item: ${index}  ## --\n`;
            base = `${base}INSERT INTO ${this.table.name}(${columns})\nVALUES\n`;
            let rowStr = ``;
            _.each(row, (col) => {
                if (typeof col === 'string') {
                    let strCol: string = col as string;
                    strCol = strCol.trim();
                    if (strCol === 'Y' || strCol === 'y' || strCol === 'YES' || strCol === 'N' || strCol === 'NO') {
                        rowStr = `${rowStr}'${strCol}',`;
                    } else if (strCol.includes(`'`)) {
                        strCol = strCol.replace(/'/gi, `''`);
                        rowStr = `${rowStr}'${strCol}',`;
                    }  else if (strCol.includes(`"`)) {
                        strCol = strCol.replace(/"/gi, `""`);
                        rowStr = `${rowStr}'${strCol}',`;
                    } else {
                        rowStr = `${rowStr}'${strCol}',`;
                    }
                } else {
                    rowStr = `${rowStr}${col}`;
                }
            });
            rowStr = rowStr.replace(/.$/, '');
            base = `${base}(${rowStr});\n-- ## End of item: ${index} ## --\n`;
        });
        return base;
    }

    public dataSQLPath(context?: string): string {
        const comps = this.className.split('Schema');
        return `${comps[0]}Data.sql`;
    }
    entryString(context?: any, inputColumns?: string): string {
        const input = inputColumns || '';
        if (input !== '') {
            const columns = input.split(',');
            _.each(columns, (col) => {
                if (!this.table.isValidColumnName(col)) {
                    throw new Error(`Invalid column name ${col} for table ${this.table.name}`);
                }
            });
            return input;
        } else {
            throw new Error('Subclass must override');
        }
    }

    async csvData(context?: any): Promise<any> {
        throw new Error('Subclass must override');
    }

    async createDataEntry(inputColumns?: string, context?: any) {
        const data = await this.csvData(context);
        const entryString = this.entryString(context, inputColumns);
        const sqlString = this.createDataEntrySql(entryString, data);
        const saveFilePath = getSQLFilePath(this.dataSQLPath(context));
        incrementalWrite(saveFilePath, sqlString);
    }

    /**
     * @description Method to create table of schema, subclass should override this methods
     * @return ApplicationTable
     */
    defineTable(): ApplicationTable {
        return new ApplicationTable();
    }

    /**
     * @description Method to create join table associated with schema, subclass should override this methods
     * @return object
     */
    defineJoinTable(): {[key: string]: ApplicationTable} {
        return {};
    }

     /**
     * @description Create SQL query string to add timestamps column in schema table
     * @return string
     */
    createTimestampsColumn(): string {
        const createAtColumnName = BaseTableSchema.timestampColumns.createdAt;
        const updateAtColumnName = BaseTableSchema.timestampColumns.updatedAt;
        const tableName = this.table.name;
        const createCol = `ALTER TABLE ${tableName} ADD COLUMN ${createAtColumnName} TIMESTAMP DEFAULT NOW();`;
        const updateCol = `ALTER TABLE ${tableName} ADD COLUMN ${updateAtColumnName} TIMESTAMP DEFAULT NOW();`;
        const createColCmt = `COMMENT ON COLUMN ${tableName}.${createAtColumnName} IS 'Timestamp column to check creation time of record';`;
        const updateColCmt = `COMMENT ON COLUMN ${tableName}.${updateAtColumnName} IS 'Timestamp column to check modify time of record';`;
        return `${createCol}\n${updateCol}\n${createColCmt}\n${updateColCmt}`;
    }

    /**
     * @description Create SQL query string to add columns and table in schema
     * @return string
     */
    createComments(): string {
        return this.table.createCommentsForTable();
    }

    createTable(): string {
        return this.table.createTableSql();
    }

    createAuditColumns(): string { return ''; }

    /**
     * @description Create SQL query string to drop table in schema
     * @return string
     */
    dropTable(): string {
        return `DROP TABLE IF EXISTS ${this.table.name}`;
    }

    /**
     * @description Schema table
     * @return ApplicationTable
     */
    public static get schema(): ApplicationTable {
        return this.shared.table;
    }

    /**
     * @description Get table name associated with schema
     */
    public static get dbTable(): string {
        return this.shared.table.name;
    }

     /**
     * @description Get table columns associated with schema
     */
    public static get columns(): {[key: string]: string} {
        return this.shared.table.columns;
    }

    /**
     * primaryKey
     * @description Get Primary key of schema
     */
    public static get pk(): string {
        return this.shared.table.columns.id;
    }



}

export const defineColumn = (name: string, comment: string, definition?: string, foreignTable?: string, refColumn?: string, deleteCascade?: boolean): ApplicationTableColumn => {
    return new ApplicationTableColumn(name, comment, definition, foreignTable, refColumn, deleteCascade);
};

export interface TableColumnOption extends TableColumnDefinition {
    refSchema?: BaseTableSchema;
}

export const createColumn = (option: TableColumnOption): ApplicationTableColumn => {
    const schema = option.refSchema;
    const refTable = option.foreignTable || unWrap(schema, { table: {}}).table.name ;
    const refColumn = option.refColumn || unWrap(schema, { table: {}}).table.id;
    const def = option.definition;
    return defineColumn(option.name, option.comment, def, refTable, refColumn, option.deleteCascade);
};

// ---------------------------------------------------------------------------------
