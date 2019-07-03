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

import { BaseTableSchema } from '../applicationSchemaInterface';
import { UserSchema } from './login.schema';

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
        // Returning SQL string
        return `ALTER TABLE ${this.table.name} ADD COLUMN ${createdByColumnName} INT NULL REFERENCES ${userTable}(${userTablePK}) ON DELETE SET NULL;
        ALTER TABLE ${this.table.name} ADD COLUMN ${updatedByColumnName} INT NULL REFERENCES ${userTable}(${userTablePK}) ON DELETE SET NULL;
        COMMENT ON COLUMN ${this.table.name}.${createdByColumnName} IS 'Audit column to track creator';
        COMMENT ON COLUMN ${this.table.name}.${updatedByColumnName} IS 'Audit column to track modifier';
        `;
    }
}
// ---------------------------------------------------------------------------------------------------
