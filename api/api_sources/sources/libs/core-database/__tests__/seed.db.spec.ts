/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: seed.db.spec.ts
 * Project: lucy
 * File Created: Friday, 8th May 2020 11:50:37 pm
 * Author: Raj Manivannan (you@you.you)
 * -----
 */

import { expect } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../../test-helpers/testHelpers';
import * as schema from '../../../database/database-schema';
import { BaseSchema } from '../baseSchema';
import AppConfig from '../../../AppConfig';
import { BaseDataController } from '../base.data.controller';
import { controllerForSchemaName } from '../schema.storage';
import { getCSVDataFilePath } from '../schema.csv.loader';
import { GenericCSV } from '../../utilities';

describe('Seed DB test', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('Seed script is successful and the data should exist in DB', async () => {
        const testSchema = 'ObservationSchema';
        const testSeedReference = 'ObservationSeed';

        const schemaClass = schema[testSchema];
        const schemaObj: BaseSchema = new schemaClass();
        const batchOptions = schemaObj.table.batchImportOptions;
        const options = batchOptions[testSeedReference];

        const csv = new GenericCSV(getCSVDataFilePath(options.fileName));
        const csvData = await csv.load();

        const currentEnv = AppConfig.getCurrentEnv();
        const seededEnvironments = options.environments || [];
        seededEnvironments.push('local');

        const seedController: BaseDataController = await controllerForSchemaName('SeedSchema');
        const con: BaseDataController = await controllerForSchemaName(testSchema);

        if (seededEnvironments.includes(currentEnv)) {
            const observationSeedEntry = await seedController.fetchOne({ reference: testSeedReference });
            expect(observationSeedEntry).not.equal(undefined);

            const observations = await con.all();
            expect(observations.length).to.be.gte(csvData.length);
        } else {
            const observationSeedEntry = await seedController.fetchOne({ reference: testSeedReference });
            expect(observationSeedEntry).to.equal(undefined);
        }
    });
});
