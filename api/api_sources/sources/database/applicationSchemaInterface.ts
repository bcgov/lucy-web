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

/**
 * @description Column definition descriptor class
 * @export class ApplicationTableColumn
 */
export class ApplicationTableColumn {
    name: string;
    comment = 'Application table column';
    struct = '';
    constructor(name: string, comment: string, struct?: string) {
        this.name = name;
        this.comment = comment;
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

    get columns(): {[key: string] : string} {
        if (this._columnNames) {
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

    /**
     * @description Constructor
     */
    constructor() {
        this.table = this.defineTable();
        this.joinTables = this.defineJoinTable();
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
        return `ALTER TABLE ${this.table.name} ADD COLUMN ${BaseTableSchema.timestampColumns.createdAt} TIMESTAMP DEFAULT NOW();
        ALTER TABLE ${this.table.name} ADD COLUMN ${BaseTableSchema.timestampColumns.updatedAt} TIMESTAMP DEFAULT NOW();`;
    }

    /**
     * @description Create SQL query string to add columns and table in schema 
     * @return string
     */
    createComments(): string {
        let commentForColumns = ``;
        for (const key in this.table.columnsDefinition) {
            if (this.table.columnsDefinition.hasOwnProperty(key)) {
                const column: ApplicationTableColumn = this.table.columnsDefinition[key];
                commentForColumns = commentForColumns + `COMMENT ON COLUMN ${this.table.name}.${column.name} IS '${column.comment}';\n`;
            }
        }
        return `COMMENT ON TABLE ${this.table.name} IS '${this.table.description}';\n${commentForColumns}`;
    }

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

}

export const defineColumn = (name: string, comment: string, struct?: string): ApplicationTableColumn => {
    return new ApplicationTableColumn(name, comment, struct);
};

// ---------------------------------------------------------------------------------
