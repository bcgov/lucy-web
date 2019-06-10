// Admin related schemas

import { ApplicationTable, BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

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
