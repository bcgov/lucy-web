//
// Index for base record schema
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
// Created by Pushan Mitra on 2019-06-2.

import { BaseTableSchema, createColumn } from '../applicationSchemaInterface';
import { UserSchema } from './login.schema';
import { CodeCSVData } from '../pre.load';
import { ApplicationTableColumn } from '../../libs/core-database';

export class RecordTableSchema extends BaseTableSchema {
    static get auditColumns(): {[key: string]: string} {
        return {
            createdBy: 'updated_by_user_id',
            updatedBy: 'created_by_user_id',
            deletedAt: 'deleted_by_user_id'
        };
    }

    createAuditColumns(): string {
        // Values
        const createdByColumnName = RecordTableSchema.auditColumns.createdBy;
        const updatedByColumnName = RecordTableSchema.auditColumns.updatedBy;
        const userTable = UserSchema.schema.name;
        const userTablePK = UserSchema.schema.columns.id;

        // Creating SQL Strings
        const creatorColumn = `ALTER TABLE ${this.table.name} ADD COLUMN ${createdByColumnName} INT NULL DEFAULT NULL REFERENCES ${userTable}(${userTablePK}) ON DELETE SET NULL;`;
        const modifierColumn = `ALTER TABLE ${this.table.name} ADD COLUMN ${updatedByColumnName} INT NULL DEFAULT NULL REFERENCES ${userTable}(${userTablePK}) ON DELETE SET NULL;`;
        const commentCreatorCol = `COMMENT ON COLUMN ${this.table.name}.${createdByColumnName} IS 'Audit column to track creator';`;
        const commentModifierCol = `COMMENT ON COLUMN ${this.table.name}.${updatedByColumnName} IS 'Audit column to track modifier';`;
        // Returning SQL string
        return `${creatorColumn}\n${modifierColumn}\n${commentCreatorCol}\n${commentModifierCol}`;
    }
}

export class CodeTableSchema extends RecordTableSchema {
    static get codeColumns(): {[key: string]: string} {
        return {
            description: 'description',
            activeIndicator: 'active_ind'
        };
    }

    additionalColumns(): {[key: string]: ApplicationTableColumn} {
        const existing = super.additionalColumns();
        const newColumns = {
            description: createColumn({name: CodeTableSchema.codeColumns.description,
                comment: 'Description of code',
                definition: 'VARCHAR(100) NULL',
                examples: []
            }),
            activeIndicator: createColumn({name: CodeTableSchema.codeColumns.activeIndicator,
                comment: 'Indicator to check active status of code',
                definition: 'BOOLEAN NOT NULL DEFAULT TRUE',
                examples: []
            })
        };

        return {...existing, ...newColumns};
    }

    constructor() {
        super();
    }

    entryString() {
        return `${this.table.columns.code}, ${this.table.columns.description}`;
    }

    csvData(): Promise<any> {
        const csvData = new CodeCSVData(`${this.className.split('Schema')[0]}.csv`);
        return csvData.load();
    }

    get hasDefaultValues(): boolean {
        return true;
    }
}

// ---------------------------------------------------------------------------------------------------
