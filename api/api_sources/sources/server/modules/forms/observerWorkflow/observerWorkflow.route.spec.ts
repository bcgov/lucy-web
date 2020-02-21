/**
 * Imports
 */
import { SharedExpressApp } from '../../../initializers';
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    AuthType,
    testRequest,
    HttpMethodType,
    verifySuccessBody
} from '../../../../test-helpers/testHelpers';
import { ExpressResourceTest } from '../../../../test-helpers/expressTest';
import { ObserverWorkflowController } from '../../../../database/models';
import { DataController } from '../../../../database/data.model.controller';
import { ModelFactory, Destroyer } from '../../../../database/factory';

/**
 * Test Function
 */
const resourceName = 'ObserverWorkFlow';
const controller: DataController = ObserverWorkflowController.shared;
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

    // Test3: Get Single
    it(`should get ${resourceName} {all}`, async () => {
        await ExpressResourceTest.testGetAll(SharedExpressApp.app, { auth: AuthType.viewer}, controller);
    });

    // Test4: Success To Create For Viewer
    it(`should create ${resourceName} for { Inspect app officer}`, async () => {
        await ExpressResourceTest.testCreate(SharedExpressApp.app, { auth: AuthType.inspectAdmin, expect: 201}, controller);
    });

    // Test5: Success to create for Viewer
    it(`should update ${resourceName} for {viewer}`, async () => {
        await ExpressResourceTest.testUpdate(SharedExpressApp.app, { auth: AuthType.inspectOfficer, expect: 200}, controller);
    });

    // Test6: Export
    it(`should export ${resourceName} for {inspect app admin}`, async () => {
        // Create Model
        const model = await ModelFactory(ObserverWorkflowController.shared)();
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/mussels/wra/export',
            expect: 200,
            auth: AuthType.inspectAdmin
        }).then(async resp => {
            await verifySuccessBody(resp.body);
            await Destroyer(ObserverWorkflowController.shared)(model);
        });
    });
});
