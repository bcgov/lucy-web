// Application Login Schemas


import { ApplicationTable, ApplicationTableColumn, BaseTableSchema, defineColumn} from '../applicationSchemaInterface';

export class RolesCodeTableSchema extends BaseTableSchema {
    defineTable(): ApplicationTable {
        const table: ApplicationTable = new ApplicationTable();
        table.name = 'app_roles_code';
        table.columnsDefinition = {
           id: new ApplicationTableColumn('role_code_id', 'Auto generated incremental primary key column'),
           code: new ApplicationTableColumn('code', 'Application level identifier code'),
           role: new ApplicationTableColumn('role', 'User role as per access'),
           description: new ApplicationTableColumn('description', 'Description of each access level item')
        }

        return table;
    }
}

export class UserSchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'application_user'
        table.description = 'Table to store user information';
        table.columnsDefinition = {
            id: new ApplicationTableColumn('user_id', 'Auto generated incremental primary key column'),
            firstName: new ApplicationTableColumn('first_name', 'First name of user'),
            lastName: new ApplicationTableColumn('last_name', 'Last name of user'),
            email: new ApplicationTableColumn('email', 'User email'),
            preferredUsername: new ApplicationTableColumn('preferred_username', 'User name provided by KeyClock'),
            loginType: new ApplicationTableColumn('login_type', 'Login type BCeID or IDR'),
            expiryDate: new ApplicationTableColumn('expiry_date', 'Expiry date of account'),
            activation: new ApplicationTableColumn('activation', 'Activation status of account'),
            refCurrentSession: defineColumn('ref_current_session_id', 'FOREIGN KEY reference to session table to track current sessions of users')
        };
        return table;
    }
}


export class UserSessionSchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'user_session',
        table.columnsDefinition = {
            id: new ApplicationTableColumn('session_id', 'Session id auto generated incremental primary key column'),
            lastLoginAt: new ApplicationTableColumn('last_login_at', 'Last login timestamp'),
            token: new ApplicationTableColumn('token', 'Keyclock token'),
            tokenExpiry: new ApplicationTableColumn('token_expiry', 'Token expiry timestamp'),
            tokenLifetime: new ApplicationTableColumn('token_lifetime', 'Token lifetime'),
            lastActiveAt: new ApplicationTableColumn('last_active_at', 'Timestamp to check last activity of user'),
            refUserId: new ApplicationTableColumn('ref_user_id', 'FOREIGN KEY reference to user table')
        }
        return table;
    }
}

export class SessionActivityCodeSchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'session_activity_code';
        table.columnsDefinition = {
            id: defineColumn('session_activity_id', 'Auto generated incremental primary key column'),
            code: defineColumn('code', 'Unique code for activity'),
            description: defineColumn('description', 'Description of activity')
        };
        return table;
    }
}

export class SessionActivitySchema extends BaseTableSchema {
    defineTable() {
        const table = new ApplicationTable();
        table.name = 'user_session_activity';
        table.columnsDefinition = {
            id: defineColumn('activity_id', 'Activity id auto generated incremental primary key column'),
            info: defineColumn('info', 'Information of activity'),
            refSessionId: defineColumn('ref_session_id', 'FOREIGN KEY reference to user_session table'),
            refActivityCode: defineColumn('ref_activity_code', 'FOREIGN KEY reference to session_activity_code table')
        }
        return table;
    }
}