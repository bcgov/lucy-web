import * as schema from '../sources/database/database-schema';
import { BaseSchema } from '../sources/libs/core-database';
import { SeedRunner } from '../sources/libs/core-database/seed.db';
import { SharedDBManager } from '../sources/database';
import { UserDataController } from '../sources/database/models';

(async () => {
    console.log('[SEED]: START');
    await SharedDBManager.connect();
    const creator = await UserDataController.shared.fetchOne({ email: 'istest1@gov.bc.ca'});
    for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
            if (key.includes('Schema')) {
                const schemaClass = schema[key];
                const schemaObj: BaseSchema = new schemaClass();
                const batchOptions = schemaObj.table.batchImportOptions;
    
                for (const options of batchOptions) {
                    console.log(`[SEED - ${key}]: IN PROGRESS`);
                    await SeedRunner.seedDb(key, schemaObj, options, creator);
                }
            }
        }
    }
    console.log('[SEED]: END');
})();