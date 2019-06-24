//
// Admin related schemas
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
// Created by Pushan Mitra on 2019-06-10.

import { ApplicationTable, BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

/**
 * @description Table schema for Request Access table which hold Request for change of user access level
 * @export class RequestAccessTableSchema
 */
export class RequestAccessTableSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = super.defineTable();
        table.name = 'access_request';
        table.columnsDefinition = {
            id: defineColumn('request_id', 'Auto generated incremental primary key column'),
            requestNote: defineColumn('request_note', 'Note with request'),
            refRequestType: defineColumn('requested_access_code', 'FOREIGN KEY reference to login_access_code table. Requested access code id '),
            refRequester: defineColumn('ref_requester_id', 'Requester id. FOREIGN KEY reference to user table.'),
            refApprover: defineColumn('ref_approver_id', 'Approver id. FOREIGN KEY reference to user table.'),
            status: defineColumn('status', 'Status of the request. Integer value'),
            approverNote: defineColumn('approver_note', 'Note from approver'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }
}

// ----------------------------------------------------------------------------------------------------------------
