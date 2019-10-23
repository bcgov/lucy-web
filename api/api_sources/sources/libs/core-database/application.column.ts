import { schemaForTable } from './schema.storage';
import { unWrap } from '../utilities';

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
 * File: application.column.ts
 * Project: lucy
 * File Created: Friday, 30th August 2019 1:31:02 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 30th August 2019 1:32:40 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
export type TableColumnRef = [string, string, boolean];

export interface TableColumnStruct {
    reference?: TableColumnRef;
    definition?: string;
}

export interface ColumnRegxInfo {
    re: string;
    flag?: string;
}

export interface TableColumnVerification {
    regx?: ColumnRegxInfo;
    max?: number;
    min?: number;
    dateFormat?: string;
    size?: number;
    isDate?: boolean;
}

export interface TableColumnDefinition {
    name: string;
    comment: string;
    definition?: string;
    foreignTable?: string;
    refColumn?: string;
    deleteCascade?: boolean;
    refModel?: string;
    refSchema?: string;
    required?: boolean;
    columnVerification?: TableColumnVerification;
    meta?: any;
    layout?: any;
    eager?: boolean;
}

export interface ColumnChangeOptions {
    existingKey: string;
    newKey?: string;
    column?: TableColumnDefinition;
    newColumnName?: string;
    type?: string;
    sqlStatement?: string;
    downSqlStatement?: string;
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
    refSchema?: string;
    refModel?: string;
    required = true;
    columnVerification?: TableColumnVerification;
    meta?: any;
    layout?: any;
    eager = true;
    constructor(
        name: string,
        comment: string,
        definition?: string,
        foreignTable?: string,
        refColumn?: string,
        deleteCascade?: boolean,
        refSchema?: string,
        refModel?: string,
        required?: boolean) {
        this.name = name;
        this.comment = comment;
        this.definition = definition;
        this.foreignTable = foreignTable;
        this.refColumn = refColumn;
        this.deleteCascade = deleteCascade;
        this.refSchema = refSchema;
        this.required = required || true;
        if (refSchema) {
            this.refModel = refSchema.split('Schema')[0];
        }

        if (refModel) {
            this.refModel = refModel;
        }
    }

    static createColumn(value: TableColumnDefinition): ApplicationTableColumn {
        const column: ApplicationTableColumn = new ApplicationTableColumn(
            value.name,
            value.comment,
            value.definition,
            value.foreignTable,
            value.refColumn,
            value.deleteCascade,
            value.refSchema,
            value.refModel
        );
        column.columnVerification = value.columnVerification;
        column.meta = value.meta;
        column.layout = value.layout;
        column.eager = unWrap(value.eager, true);
        column.required = (value.required !== undefined) ? value.required : true;
        return column;
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

    public dropColumnSql(tableName: string) {
        return `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${this.name};`;
    }

    get type(): string {
        if (this.foreignTable) {
            return 'object';
        }
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
        } else if (def.includes('date') || def.includes('day')) {
            return 'string';
        } else {
            return 'object';
        }
    }

    get typeDetails(): any {
        let typeInfo: any = {};
        let def = this.definition || '';
        def = def.toLowerCase();
        if (def.includes('varchar')) {
            // Method to extract size
            const regx = /^varchar\([0-9]+\)/g;
            const regx1 = /[0-9]+/g;
            const match = def.match(regx) || [''];
            const matchSize = match[0].match(regx1) || ['50'];
            // var ch = (ip) => { const m1 = ip.match(regx)[0]; return m1.match(regx1)[0];};
            typeInfo = {
                type: typeof def,
                size: parseInt(matchSize[0], undefined)
            };
        } else if (def.includes('serial') || def.includes('numeric')) {
            typeInfo = {
                type: typeof 1.0,
                subType: 'numeric'
            };
        } else if (def.includes('boolean')) {
            typeInfo = {
                type: typeof true
            };
        } else if (def.includes('int') || def.includes('smallint')) {
            typeInfo = {
                type: typeof 1,
                subType: 'int'
            };
        } else if (def.includes('date') || def.includes('day')) {
            typeInfo = {
                type: typeof 'str',
                subType: 'date',
                isDate: true
            };
        } else {
            typeInfo = {
                type: 'object',
                info: 'unknown'
            };
        }

        if (this.foreignTable) {
            typeInfo = {
                type: 'object',
                schema: this.refSchema || schemaForTable(this.foreignTable)
            };
        }

        typeInfo.required = this.required;
        return typeInfo;
    }

}

// --------------------------------------------------------------------------------
