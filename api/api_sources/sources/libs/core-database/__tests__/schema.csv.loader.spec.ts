
/**
 * Imports
 */
import * as _ from 'underscore';
import { should } from 'chai';
import { SchemaCSVLoader } from '../schema.csv.loader';
import { Test2Schema } from './test.schema';
import { getSQLFileData } from '../sql.loader';
const schema = new Test2Schema();
describe('Test Schema CSV Loader', () => {
    it('should create csv', async () => {
        const dryRun = process.env.ENVIRONMENT === 'local' ? false : true;
        const report = await SchemaCSVLoader.shared.createImportMigrations(schema, dryRun);
        should().exist(report);
        if (!dryRun) {
            _.each(SchemaCSVLoader.shared.importMigrationFiles(schema), (file: string) => {
                console.log(`${file}: ${schema.className}`);
                should().exist(getSQLFileData(file, schema.className));
            });
        }
    });
});
