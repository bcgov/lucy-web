// Application Login Schemas
import { BaseTableSchema} from '../applicationSchemaInterface';
import { getYAMLFilePath } from '../../libs/core-database';
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

    get hasDefaultValues(): boolean {
        return true;
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
}



/**
 * @description Schema Class to design table of user session activities
 * @export class SessionActivitySchema
 */
export class SessionActivitySchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('user.session.schema.yaml');
    }
}

// -------------------------------------------------------------------------
