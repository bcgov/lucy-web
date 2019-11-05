/**
 * Imports
 */
import * as faker from 'faker';
import { SharedExpressApp } from '../../../initializers';
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    AuthType
} from '../../../../test-helpers/testHelpers';
import { ExpressResourceTest } from '../../../../test-helpers/expressTest';
import { WatercraftRiskAssessmentController } from '../../../../database/models';
import { DataController } from '../../../../database/data.model.controller';

/**
 * Test Function
 */
const resourceName = 'Watercraft Risk Assessment';
const controller: DataController = WatercraftRiskAssessmentController.shared;
describe(`Test for ${resourceName}`, () => {
    before(async () => {
        await SharedExpressApp.initExpress();
        await commonTestSetupAction();
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

    // Test3: Get Single
    it(`should get ${resourceName} {all}`, async () => {
        await ExpressResourceTest.testGetAll(SharedExpressApp.app, { auth: AuthType.viewer}, controller);
    });

    // Test4: Fail To Create For Viewer
    it(`should not create ${resourceName} for {viewer}`, async () => {
        await ExpressResourceTest.testCreate(SharedExpressApp.app, { auth: AuthType.viewer, expect: 401}, controller);
    });

    // Test5: Fail to create for Viewer
    it(`should not update ${resourceName} for {viewer}`, async () => {
        await ExpressResourceTest.testUpdate(SharedExpressApp.app, { auth: AuthType.viewer, expect: 401}, controller);
    });
});