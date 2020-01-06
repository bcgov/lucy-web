
/**
 * Imports
 */
import { RecordTableSchema } from './base.record.schema';
import { getYAMLFilePath } from '../../libs/core-database';

export class SpaceGeomSchema extends RecordTableSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('spaceGeom.schema.yaml');
    }
}
// -------------------------------------
