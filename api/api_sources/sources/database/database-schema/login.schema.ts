// Application Login Schemas

import { ApplicationTable } from '../../libs/core-database';
import { BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

/**
 * @description Schema Class to design role code table
 * @export class RolesCodeTableSchema
 */
export class RolesCodeTableSchema extends BaseTableSchema {
    defineTable(): ApplicationTable {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'app_roles_code';
        table.description = 'Table to store different roles of application along with unique code and description';
        table.columnsDefinition = {
            id: defineColumn('role_code_id', 'Auto generated incremental primary key column'),
            code: defineColumn('code', 'Application level identifier code'),
            role: defineColumn('role', 'User role as per access'),
            description: defineColumn('description', 'Description of each access level item'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };

        return table;
    }
}

/**
 * @description Schema Class to design user table
 * @export class UserSchema
 */
export class UserSchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'application_user';
        table.description = 'Table to store user information';
        table.columnsDefinition = {
            id: defineColumn('user_id', 'Auto generated incremental primary key column'),
            firstName: defineColumn('first_name', 'First name of user'),
            lastName: defineColumn('last_name', 'Last name of user'),
            email: defineColumn('email', 'User email'),
            preferredUsername: defineColumn('preferred_username', 'User name provided by KeyClock'),
            loginType: defineColumn('login_type', 'Login type BCeID or IDR'),
            expiryDate: defineColumn('expiry_date', 'Expiry date of account'),
            accountStatus: defineColumn('account_status', 'Status of account'),
            activation: defineColumn('activation', 'Activation status of account'),
            refCurrentSession: defineColumn('ref_current_session_id', 'FOREIGN KEY reference to session table to track current sessions of users'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }
}

/**
 * @description Schema Class to design user session info table
 * @export class UserSessionSchema
 */
export class UserSessionSchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'user_session';
        table.description = 'User session information table. Store active user sessions of application';
        table.columnsDefinition = {
            id: defineColumn('session_id', 'Session id auto generated incremental primary key column'),
            lastLoginAt: defineColumn('last_login_at', 'Last login timestamp'),
            token: defineColumn('token', 'Keyclock token'),
            tokenExpiry: defineColumn('token_expiry', 'Token expiry timestamp'),
            tokenLifetime: defineColumn('token_lifetime', 'Token lifetime'),
            lastActiveAt: defineColumn('last_active_at', 'Timestamp to check last activity of user'),
            refUserId: defineColumn('ref_user_id', 'FOREIGN KEY reference to user table'),
            updateAt: defineColumn(BaseTableSchema.timestampColumns.updatedAt, 'Row update timestamp'),
            createAt: defineColumn(BaseTableSchema.timestampColumns.createdAt, 'Row create timestamp')
        };
        return table;
    }
}

/**
 * @description Schema Class to design code table for different session activities
 * @export class SessionActivityCodeSchema
 */
export class SessionActivityCodeSchema extends BaseTableSchema {
    defineTable() {
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
    }
}

/**
 * @description Schema Class to design table of user session activities
 * @export class SessionActivitySchema
 */
export class SessionActivitySchema extends BaseTableSchema {
    defineTable() {
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
    }
}

// -------------------------------------------------------------------------
