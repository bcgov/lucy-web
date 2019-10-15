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
import { unWrap, incrementalWrite } from '../libs/utilities';
import { getSQLFileData, getSQLFilePath } from '../libs/core-database';
import {
    ApplicationTableColumn,
    TableColumnOption,
    BaseSchema
} from '../libs/core-database';

/**
 * @description Schema holder for entity
 * @export class BaseTableSchema
 */
export class  BaseTableSchema extends BaseSchema {

    // Shared Instance
    static shareInstance: BaseTableSchema;

    /**
     * @description Getter for shared instance
     * @return BaseTableSchema
     */
    static get shared(): BaseTableSchema {
        return this.shareInstance || (this.shareInstance = new this());
    }

    async createDataEntry(inputColumns?: string, context?: any) {
        const data = await this.csvData(context);
        const entryString = this.entryString(context, inputColumns);
        const sqlString = this.createDataEntrySql(entryString, data);
        const saveFilePath = getSQLFilePath(this.dataSQLPath(context));
        incrementalWrite(saveFilePath, sqlString);
    }

    get migrationSQL(): string {
        return getSQLFileData(`${this.className}.sql`);
    }

    migrationFilePath(): string {
        return getSQLFilePath(`${this.className}.sql`);
    }
}

export const defineColumn = (name: string, comment: string, definition?: string, foreignTable?: string, refColumn?: string, deleteCascade?: boolean): ApplicationTableColumn => {
    return new ApplicationTableColumn(name, comment, definition, foreignTable, refColumn, deleteCascade);
};

export const createColumn = (option: TableColumnOption): ApplicationTableColumn => {
    const schema = option.refSchema;
    const refTable = option.foreignTable || unWrap(schema, { table: {}}).table.name ;
    const refColumn = option.refColumn || unWrap(schema, { table: {}}).table.id;
    const def = option.definition;
    return defineColumn(option.name, option.comment, def, refTable, refColumn, option.deleteCascade);
};

// ---------------------------------------------------------------------------------
