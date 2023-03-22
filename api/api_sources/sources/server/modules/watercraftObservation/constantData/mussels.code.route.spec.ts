/**
 * Imports
 */
import { should, expect } from 'chai';
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
import { it } from 'mocha';
/**
 * Test Function
 */
const resourceName = 'Mussel App Codes';
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
                should().exist(data.adultMusselsLocation);
                should().exist(data.previousAISKnowledgeSource);
                should().exist(data.previousInspectionSource);
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

    // Ticket #489: Additional stations fields
    it('should return additional stations (#498)', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/mussels/codes',
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.stations);
                const stations: string[] = data.stations as string[];
                const filter = stations.filter( item => (
                    item === 'Fraser Valley Roving' ||
                    item === 'Sumas border' ||
                    item === 'Aldergrove border')
                );
                expect(filter.length).to.be.equal(3);
            });
        });
    });

    // Ticket #197: Additional stations fields
    it('should return additional stations (#197)', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/mussels/codes',
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.stations);
                const stations: string[] = data.stations as string[];
                const filter = stations.filter( item => (
                    item === 'Kootenay Sgt' ||
                    item === 'Okanagan Sgt' ||
                    item === 'Rocky Mountain Sgt')
                );
                expect(filter.length).to.be.equal(3);
            });
        });
    });
});
