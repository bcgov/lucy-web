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
import { ApplicationTableColumn} from './application.column';

/**
 * @description Table definition descriptor class
 * @export class ApplicationTable
 */
export class ApplicationTable {
    name: string;
    columnsDefinition: {[key: string]: ApplicationTableColumn} = {};
    description = 'Application table';
    private _columnNames: {[key: string]: string};
    meta: any;
    layout: any;

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
}
