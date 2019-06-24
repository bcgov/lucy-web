//
// System related schema
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

/**
 * Imports
 */
import { ApplicationTable, BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

/**
 * @description Table schema for table to store various application events
 * @export class ApplicationEventSchema
 */
export class ApplicationEventSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'application_event';
        table.columnsDefinition = {
            id: defineColumn('event_id', 'Auto generated incremental primary key column'),
            type: defineColumn('type', 'Event type {Like info, warning, error}'),
            source: defineColumn('source', 'Event source information'),
            refSessionId: defineColumn('ref_session_id','FOREIGN KEY reference to session table'),
            note: defineColumn('note', 'Note associated with event')
        };
        return table;
    }
}

/**
 * @description Table schema for table to store messages for user
 * @export class UserMessagesSchema
 */
export class UserMessagesSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'user_message';
        table.columnsDefinition = {
            id: defineColumn('message_id', 'Auto generated incremental primary key column'),
            title: defineColumn('title', 'Message title'),
            body: defineColumn('body', 'Message body'),
            type: defineColumn('type', 'Message type enum'),
            status: defineColumn('viewed', 'Message viewing status flag'),
            refReceiverId: defineColumn('ref_receiver_id', 'FOREIGN KEY reference to user table. Receiver of message'),
            refCreatorId: defineColumn('ref_created_by', 'FOREIGN KEY reference to user table. Creator message')
        };
        return table;
    }
}

// ----------------------------------------------------------------------------------------------------------------
