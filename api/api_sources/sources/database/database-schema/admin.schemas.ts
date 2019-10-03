// Admin related schemas
import { BaseTableSchema } from '../applicationSchemaInterface';
import { getYAMLFilePath } from '../../libs/core-database';

/**
 * @description Schema Class to design table for request access level change from a user
 * @export class RequestAccessTableSchema
 */
export class RequestAccessSchema extends BaseTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('admin.ops.schema.yaml');
    }
}
