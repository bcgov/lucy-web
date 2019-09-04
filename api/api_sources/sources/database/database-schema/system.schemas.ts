// System related schema
import { ApplicationTable } from '../../libs/core-database';
import { BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

/**
 * @description Schema Class to design table to store different application level events
 * @export class ApplicationEventSchema
 */
export class ApplicationEventSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'application_event';
        table.description = 'Table to store different application level events. This table will help to debug production defects and maintenance';
        table.columnsDefinition = {
            id: defineColumn('event_id', 'Auto generated incremental primary key column'),
            type: defineColumn('type', 'Event type {Like info, warning, error}'),
            source: defineColumn('source', 'Event source information'),
            refSessionId: defineColumn('ref_session_id', 'FOREIGN KEY reference to session table'),
            note: defineColumn('note', 'Note associated with event'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }
}

/**
 * @description Schema Class to design table to store messages for user
 * @export class UserMessagesSchema
 */
export class UserMessagesSchema extends BaseTableSchema {
    defineTable() {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'user_message';
        table.description = 'Table to store messages for users.';
        table.columnsDefinition = {
            id: defineColumn('message_id', 'Auto generated incremental primary key column'),
            title: defineColumn('title', 'Message title'),
            body: defineColumn('body', 'Message body'),
            type: defineColumn('type', 'Message type enum'),
            status: defineColumn('viewed', 'Message viewing status flag'),
            refReceiverId: defineColumn('ref_receiver_id', 'FOREIGN KEY reference to user table. Receiver of message'),
            refCreatorId: defineColumn('ref_created_by', 'FOREIGN KEY reference to user table. Creator message'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }
}

// --------------------------------------------------------------------------------
