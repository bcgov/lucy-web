// System related schema

import { ApplicationTable, BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

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
        return table
    }
}

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