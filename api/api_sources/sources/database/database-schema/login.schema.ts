// Application Login Schemas
import { BaseTableSchema} from '../applicationSchemaInterface';
import { getYAMLFilePath } from './schema-files';
import { CodeTableSchema } from './base.record.schema';

/**
 * @description Schema Class to design role code table
 * @export class RolesCodeTableSchema
 */
export class RolesCodeTableSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.schema.yaml');
    }
}

/**
 * @description Schema Class to design user table
 * @export class UserSchema
 */
export class UserSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.schema.yaml');
    }
}

export class UserRoleSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.schema.yaml');
    }
}

/**
 * @description Schema Class to design user session info table
 * @export class UserSessionSchema
 */
export class UserSessionSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.session.schema.yaml');
    }
}

/**
 * @description Schema Class to design code table for different session activities
 * @export class SessionActivityCodeSchema
 */
export class SessionActivityCodeSchema extends CodeTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.session.schema.yaml');
    }
    /*defineTable() {
        const table = new ApplicationTable();
        table.name = 'session_activity_code';
        table.description = 'Code table to hold different activity of user in application';
        table.columnsDefinition = {
            id: defineColumn('session_activity_id', 'Auto generated incremental primary key column'),
            code: defineColumn('code', 'Unique code for activity'),
            description: defineColumn('description', 'Description of activity'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }*/
}



/**
 * @description Schema Class to design table of user session activities
 * @export class SessionActivitySchema
 */
export class SessionActivitySchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.session.schema.yaml');
    }
    /*defineTable() {
        const table = new ApplicationTable();
        table.name = 'user_session_activity';
        table.description = 'Collection table to hold information of users session activities';
        table.columnsDefinition = {
            id: defineColumn('activity_id', 'Activity id auto generated incremental primary key column'),
            info: defineColumn('info', 'Information of activity'),
            refSessionId: defineColumn('ref_session_id', 'FOREIGN KEY reference to user_session table'),
            refActivityCode: defineColumn('ref_activity_code', 'FOREIGN KEY reference to session_activity_code table'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }*/
}

// -------------------------------------------------------------------------
