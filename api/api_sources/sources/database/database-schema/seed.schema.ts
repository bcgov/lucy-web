
/**
 * Imports
 */
import { RecordTableSchema } from './base.record.schema';
import { getYAMLFilePath } from '../../libs/core-database';

export class SeedSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('seed.schema.yaml');
    }
}
// -------------------------------------
