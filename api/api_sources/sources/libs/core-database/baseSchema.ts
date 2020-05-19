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
 * File: baseSchema.ts
 * Project: lucy
 * File Created: Friday, 30th August 2019 1:48:45 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 30th August 2019 1:49:27 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as _ from 'underscore';
import * as assert from 'assert';
import * as fs from 'fs';
import {
    yaml,
    saveYaml,
    SchemaCache,
    SchemaLoader,
    incrementalWrite,
    CSVFieldTransformer,
    unWrap,
    RandomizeSelection
} from '../utilities';

import {
    ApplicationTableColumn,
    TableColumnDataOption,
    SchemaChangeOptions,
    TableColumnDefinition
} from './application.column';
import { ApplicationTable, TableVersion } from './application.table';
import { registerSchema, schemaWithName } from './schema.storage';
import { SchemaHelper } from './schema.helper';
import { getSQLDirPath } from './sql.loader';
import { SchemaCSVLoader } from './schema.csv.loader';

export interface TableColumnOption extends TableColumnDataOption {
    refSchemaObject?: BaseSchema;
}

export class  BaseSchema {

    // Shared Instance
    static shareInstance: BaseSchema;

    // Table
    table: ApplicationTable;

    // Join table definitions associated with table
    joinTables: {[key: string]: ApplicationTable};

    /**
     * CSV Field Transformer options
     * NOTE:
     *      Subclass should provide csv field transformer
     */
    get csvFieldTransformer(): {[key: string]: {[key: string]: CSVFieldTransformer}} {
        return {};
    }

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
    static get shared(): BaseSchema {
        return this.shareInstance || (this.shareInstance = new this());
    }

    public get schemaFilePath(): string {
        return '';
    }

    public get createSQLDir(): boolean {
        return true;
    }

    /**
     * className
     * @description Class name of schema
     */
    public get className(): string {
        return this.constructor.name;
    }

    /**
     * modelName
     * @description Model class name related to schema
     */
    public get modelName(): string {
        return this.table.modelName || this.className.split('Schema')[0];
    }

    public get hasDefaultValues(): boolean {
        return false;
    }

    /**
     * tableName
     * @description Table name related to schema
     */
    public get tableName(): string {
        return this.table.name;
    }

    public get sqlFileDir(): string {
        return `${getSQLDirPath()}/${this.className}`;
    }

    /**
     * @description Constructor
     */
    constructor() {
        let loadedFromFile = false;
        // Load from file
        if (this.schemaFilePath && this.schemaFilePath !== '' && fs.existsSync(this.schemaFilePath)) {
            loadedFromFile = this.loadSchema();
        }

        // Load from define table
        if (!loadedFromFile) {
            this.table = this.defineTable();
            this.joinTables = this.defineJoinTable();
        }
        assert(this.table.id, `No {id} column for schema ${this.table.name}`);

        // Check and create dir in SQL Path
        if (!fs.existsSync(this.sqlFileDir)) {
            if (this.createSQLDir) {
                fs.mkdirSync(this.sqlFileDir);
            }
        }

        // Register schema
        registerSchema(this);
    }

    _createColumn(value: TableColumnOption, key: string ) {
        const result = {};
        const column: ApplicationTableColumn = ApplicationTableColumn.createColumn(value);
        result[key] = column;
        return result;
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
        table.layout = def.layout;
        table.meta = def.meta || {};
        table.computedFields = def.computedFields;
        table.relations = def.relations || {};
        table.modelName = def.modelName;
        table.displayLayout = def.displayLayout;
        // Checking initial column
        _.each(def.columns, (value: TableColumnOption, key: string) => {
            const result = this._createColumn(value, key);
            table.initialColumns = {...table.initialColumns, ...result};
            table.columnsDefinition = {...table.columnsDefinition, ...result};
        });

        // Getting additional columns
        const additionalColumns: {[key: string]: ApplicationTableColumn} = this.additionalColumns();
        if (Object.keys(additionalColumns).length > 0) {
            table.initialColumns = {...table.initialColumns, ...additionalColumns};
            table.columnsDefinition = {...table.columnsDefinition, ...additionalColumns};
        }

        // Checking initial Sql commands
        if (def.initialSqlCommands && def.initialSqlCommands.constructor === Array) {
            for (const item of def.initialSqlCommands) {
                table.initialSqlCommands.push({
                    comment: item.comment,
                    sql: item.sql || '-- NONE --',
                    downSql: item.downSql,
                    before: item.before
                });
            }
        }

        // Check version for tables
        if (def.versions) {
            let index = 1;
            for (const v of def.versions) {
                // Create Table version info
                const vname = v.name || `${index}`;
                const fileName = v.fileName || `${vname}-${v.id || index}`;
                const version: TableVersion = {
                    name: vname,
                    columns: {},
                    info: v.info,
                    schemaChanges: [],
                    fileName: fileName,
                    id: v.id
                };

                // Now add all columns of version to column def
                _.each(v.columns, (columnOpt: TableColumnOption, key: string) => {
                    const result = this._createColumn(columnOpt, key);
                    table.columnsDefinition = {...table.columnsDefinition, ...result};
                    version.columns = { ...version.columns, ...result};
                });

                // Now check all changes in the columns
                _.each(v.columnChanges || v.schemaChanges, (change: SchemaChangeOptions) => version.schemaChanges.push(table.handleColumnChanges(change)
                ));

                // Now Add version to table
                table.versions.push(version);

                // Increment index
                index = index + 1;
            }
        }

        // View Column
        table.viewColumn = def.viewColumn || 'id';
        if (table.columnsDefinition.description) {
            table.viewColumn = 'description';
        }

        // CSV Import Options
        if (def.imports) {
            table.importOptions = def.imports;
        }

        // Batch import options
        if (def.batchImport) {
            table.batchImportOptions = def.batchImport;
        }

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

    async createDataEntry(inputColumns?: string, context?: any) {
        throw new Error('BaseSchema: createDataEntry: Subclass must override');
    }

    migrationFilePath(): string {
        throw new Error('BaseSchema: migrationFilePath: Subclass must override');
    }

    createMigrationFile(inputFileToSave?: string, skipSaving?: boolean) {
        const fileToSave = inputFileToSave || this.migrationFilePath();
        assert(fileToSave, `${this.className}: createMigrationFile: [NO PATH TO SAVE]`);
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
        if (!skipSaving) {
            incrementalWrite(fileToSave, final);
        }
        return final;
    }

    get migrationSQL(): string {
        throw Error('BaseSchema:migrationSQL: Subclass should override');
    }

    createDataEntrySql(columns: string, values: any[]): string {
        return SchemaCSVLoader.shared.sqlString(this, values, columns);
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

    config(skipDetail?: boolean, list: string[] = []): any {
        if (list.includes(this.className)) {
            return {};
        }
        const result: any = {};
        const layout: any = this.table.layout || {};
        result.schemaName = this.className;
        result.modelName = this.modelName;
        result.description = {
            key: this.modelName.toLocaleLowerCase(),
            default: this.table.description
        };
        result.meta = this.table.meta || {};
        result.idKey = this.table.id;
        result.displayLayout = this.table.displayLayout || {};
        result.displayLayout = { ...result.displayLayout, title: layout.title } || { title: layout.title };
        if (skipDetail) {
            return result;
        }
        list.push(this.className);
        result.layout = layout;
        result.computedFields = this.table.computedFields || {};
        result.relations = {};
        _.each(this.table.relations, (rel: any, key: string) => {
            const schema = rel.schema || '';
            const schemaObj = schemaWithName(schema) || { config: () => {}};
            rel.refSchema = schemaObj.config(true, list);
            const updatedRel = {};
            updatedRel[key] = rel;
            result.relations = {...result.relations, ...updatedRel};
        });
        result.fields = [];
        _.each(this.table.columnsDefinition, (col: ApplicationTableColumn, key: string) => {
            if (key === 'id') {
                return;
            }
            const typeDetails = col.typeDetails;
            const verification = col.verification || {};
            const refSchema = col.refSchema || '';
            const schemaObj: BaseSchema = schemaWithName(refSchema) || { config: () => {}};
            const fieldLayout = col.layout || {};
            verification.size = typeDetails.size;
            verification.isDate = typeDetails.isDate;
            layout.description = layout.description || {
                key: `${this.modelName}.${key}`,
                default: col.comment
            };
            layout.header = layout.header || key;
            if (typeDetails.subType) {
                verification.subType = typeDetails.subType;
            }
            const embedded = unWrap(col.meta, {}).embedded;
            const requireDetailRefSchema = embedded ? true : false;

            const field = {
                key: key,
                layout: fieldLayout,
                meta: col.meta || {},
                type: typeDetails.type || '',
                verification: verification,
                idKey: col.refColumn,
                refSchema: schemaObj.config(!requireDetailRefSchema, list),
                required: col.required
            };
            result.fields.push(field);
        });
        list.pop();
        return result;
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
        const createAtColumnName = BaseSchema.timestampColumns.createdAt;
        const updateAtColumnName = BaseSchema.timestampColumns.updatedAt;
        const tableName = this.table.name;
        const createCol = `ALTER TABLE ${tableName} ADD COLUMN ${createAtColumnName} TIMESTAMP DEFAULT NOW();`;
        const updateCol = `ALTER TABLE ${tableName} ADD COLUMN ${updateAtColumnName} TIMESTAMP DEFAULT NOW();`;
        const createColCmt = `COMMENT ON COLUMN ${tableName}.${createAtColumnName} IS 'Timestamp column to check creation time of record';`;
        const updateColCmt = `COMMENT ON COLUMN ${tableName}.${updateAtColumnName} IS 'Timestamp column to check modify time of record';`;
        return `${createCol}\n${updateCol}\n${createColCmt}\n${updateColCmt}`;
    }

    get viewColumn(): string {
        return '';
    }

    /**
     * @description Create SQL query string to add columns and table in schema
     * @return string
     */
    createComments(): string {
        return this.table.createCommentsForTable();
    }

    /**
     * @description Additional dynamic column generated by subclass
     */
    additionalColumns(): {[key: string]: ApplicationTableColumn} {
        return {};
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

    apiPath(): string {
        return this.table.meta.api ? `/api${this.table.meta.api}` : `/api/${this.modelName}`;
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

    /**
     * ID or Primary key of the Schema of the table
     * @description Get Primary key of schema
     */
    public static get id(): string {
        return this.shared.table.columns.id;
    }

    /**
     * @description Get all migration sql file related to schema
     * @returns string []
     */
    public get migrationFiles(): {[key: string]: string} {
        return SchemaHelper.shared.migrationFiles(this);
    }

    /**
     * @description Get all revert migration sql file related to schema
     * @returns object: {[key: string]: string}
     */
    public get revertMigrationFiles(): {[key: string]: string} {
        return SchemaHelper.shared.revertMigrationFiles(this);
    }

    public example(columnKey: string) {
        if (this.table.columnsDefinition[columnKey]) {
            const column: ApplicationTableColumn = this.table.columnsDefinition[columnKey];
            const examples: any[] = column.examples;
            if (examples && examples.length > 0) {
                return RandomizeSelection(examples);
            }
        }
    }
}

// ----------------------------------------------------------------
