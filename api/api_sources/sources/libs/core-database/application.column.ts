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

export interface TableColumnVerification {
    regx?: string;
    max?: number;
    min?: number;
    date?: boolean;
    dateFormat?: string;
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
    constructor(name: string, comment: string, definition?: string, foreignTable?: string, refColumn?: string, deleteCascade?: boolean, refSchema?: string, refModel?: string) {
        this.name = name;
        this.comment = comment;
        this.definition = definition;
        this.foreignTable = foreignTable;
        this.refColumn = refColumn;
        this.deleteCascade = deleteCascade;
        this.refSchema = refSchema;
        if (refSchema) {
            this.refModel = refSchema.split('Schema')[0];
        }

        if (refModel) {
            this.refModel = refModel;
        }
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
        if (this.foreignTable) {
            return {
                type: 'object',
                schema: this.refSchema
            };
        }
        let def = this.definition || '';
        def = def.toLowerCase();
        if (def.includes('varchar')) {
            // Method to extract size
            // var regx = /^varchar\([0-9]+\)/g;
            // var regx1 = /^\([0-9]+\)/g;
            // var ch = (ip) => { const m1 = ip.match(regx)[0]; return m1.match(regx1)[0];};
            return {
                type: 'string'
            };
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

}