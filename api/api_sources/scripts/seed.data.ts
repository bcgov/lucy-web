import * as _ from 'underscore';
import * as schema from '../sources/database/database-schema';
import { BaseSchema } from '../sources/libs/core-database';
import { SeedRunner } from '../sources/libs/core-database/seed.db';
import { SharedDBManager } from '../sources/database';
import { UserDataController } from '../sources/database/models';

(async () => {
    await SharedDBManager.connect();
    const creator = await UserDataController.shared.fetchOne({ email: 'istest1@gov.bc.ca'});
    _.each(schema, async (schemaClass: any, key: string) => {
        if (key.includes('Schema')) {
            const schemaObj: BaseSchema = new schemaClass();
            const batchOptions = schemaObj.table.batchImportOptions;

            for (const options of batchOptions) {
                await SeedRunner.seedDb(key, schemaObj, options, creator);
            }
        }
    })
})();