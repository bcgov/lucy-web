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
 * File: chemicalTreatment.route.spec.ts
 * Project: lucy
 * File Created: Monday, 7th October 2019 11:14:54 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 7th October 2019 11:41:26 am
 * Modified By: pushan
 * -----
 */

/**
 * Imports
 */
import { SharedExpressApp } from '../../../initializers';
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    AuthType
} from '../../../../test-helpers/testHelpers';
import { ExpressResourceTest } from '../../../../test-helpers/expressTest';
import { ChemicalTreatmentController } from '../../../../database/models';
import { DataController } from '../../../../database/data.model.controller';

/**
 * Test Functions for Chemical Treatment controller
 */
const resourceName = 'chemical treatment';
const controller: DataController = ChemicalTreatmentController.shared;
describe(`Test for ${resourceName}`, () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    // Test1: Create
    it(`should create ${resourceName}`, async () => {
        await ExpressResourceTest.testCreate(SharedExpressApp.app, {
            auth: AuthType.admin
        }, controller);
    });

    // Test2: Update
    it(`should update ${resourceName}`, async () => {
        await ExpressResourceTest.testUpdate(SharedExpressApp.app, { auth: AuthType.admin}, controller);
    });

    // Test3: Get Single
    it(`should get ${resourceName} {single}`, async () => {
        await ExpressResourceTest.testGetSingle(SharedExpressApp.app, { auth: AuthType.viewer}, controller);
    });

    // Test4: Get All
    it(`should get ${resourceName} {all}`, async () => {
        await ExpressResourceTest.testGetAll(SharedExpressApp.app, { auth: AuthType.viewer}, controller);
    });

    // Test5: Fail To Create For Viewer
    it(`should not create ${resourceName} for {viewer}`, async () => {
        await ExpressResourceTest.testCreate(SharedExpressApp.app, { auth: AuthType.viewer, expect: 401}, controller);
    });

    // Test6: Fail to Update for Viewer
    it(`should not update ${resourceName} for {viewer}`, async () => {
        await ExpressResourceTest.testUpdate(SharedExpressApp.app, { auth: AuthType.viewer, expect: 401}, controller);
    });

    // Test7: Get Filter elements
    it(`should fetch filtered item ${resourceName}`, async () => {
        await ExpressResourceTest.testGetFilteredItem(SharedExpressApp.app, { auth: AuthType.viewer, expect: 200}, controller, {
            date: '2019-08-21'
        });
    });
});
// -------------------------------------------------------------------------------


