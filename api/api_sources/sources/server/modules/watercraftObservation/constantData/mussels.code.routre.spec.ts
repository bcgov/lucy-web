/**
 * Imports
 */
import { should } from 'chai';
import { SharedExpressApp } from '../../../initializers';
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    testRequest,
    HttpMethodType,
    verifySuccessBody,
    AuthType,
    verifyErrorBody
} from '../../../../test-helpers/testHelpers';
/**
 * Test Function
 */
const resourceName = 'Water-body';
describe(`Test for ${resourceName}`, () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should return codes for mussel app', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/mussels/codes',
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.observers);
                should().exist(data.otherObservations);
                should().exist(data.stations);
                should().exist(data.watercraftList);
            });
        });
    });

    it('should  not return codes for mussel app for any user', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/mussels/codes',
            expect: 401,
        }).then(async resp => {
            await verifyErrorBody(resp.body);
        });
    });
});
