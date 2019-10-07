// System related schema
import { BaseTableSchema } from '../applicationSchemaInterface';
import { getYAMLFilePath } from '../../libs/core-database';

/**
 * @description Schema Class to design table to store different application level events
 * @export class ApplicationEventSchema
 */
export class ApplicationEventSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath(`system.schema.yaml`);
    }
}

/**
 * @description Schema Class to design table to store messages for user
 * @export class UserMessagesSchema
 */
export class UserMessagesSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath(`admin.ops.schema.yaml`);
    }
}

// --------------------------------------------------------------------------------
