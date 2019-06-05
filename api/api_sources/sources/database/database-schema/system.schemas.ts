// System related schema

import { ApplicationTable, BaseTableSchema, defineColumn} from '../ApplicationSchemaInterface';

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