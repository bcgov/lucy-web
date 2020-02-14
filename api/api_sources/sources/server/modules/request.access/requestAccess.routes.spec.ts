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
 * File: requestAccess.route.spec.ts
 * Project: lucy
 * File Created: Thursday, 13th February 2020 10:37:00 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 13th February 2020 3:05:57 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import * as request from 'supertest';
import { expect, should} from 'chai';
import { commonTestSetupAction, commonTestTearDownAction, verifySuccessBody, verifyErrorBody } from '../../../test-helpers/testHelpers';
import { SharedExpressApp } from '../../initializers';
import { viewerToken, adminToken } from '../../../test-helpers/token';
import { ModelFactory, Destroyer, requestAccessFactory } from '../../../database/factory';
import { RequestAccessController, RequestAccess, UserDataController } from '../../../database/models';

describe('Test Request Access Route', () => {
    // Setup
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    // Test1: Create Request Access
    it('should create request access: {viewer}', async () => {
        const reqBody: any = {
            requestedAccessCode: 3,
            requestNote: 'Please grant access'
        };

        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            expect(resp.body.data.status).to.be.equal(0);
        });
    });

    // Test2: No Creation Request Access for no user
    it('should not create request access: {un-authorize}', async () => {
        const reqBody: any = {
            requestedAccessCode: 3,
            requestNote: 'Please grant access'
        };

        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .send(reqBody)
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });

    // Test3: Get For admin
    it('should get all request access: {admin}', async () => {
        // Create Access
        const reqAccess: RequestAccess = await ModelFactory(RequestAccessController.shared)();
        reqAccess.status = 0;
        RequestAccessController.shared.saveInDB(reqAccess);
        should().exist(reqAccess);
        await request(SharedExpressApp.app)
        .get('/api/request-access')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const data: any[] = resp.body.data || [];
            expect(data.length).to.be.greaterThan(0);
            await Destroyer(RequestAccessController.shared)(reqAccess);
        });
    });

    // Test4: Get own request obj
    it('should get user own request access', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        reqAccess.requester = user;
        should().exist(reqAccess.requester);
        RequestAccessController.shared.saveInDB(reqAccess);
        const latest: any = await UserDataController.shared.latestAccessRequest(reqAccess.requester) || {};
        should().exist(latest);
        // expect(latest.request_id).to.be.equal(reqAccess.request_id);
        await request(SharedExpressApp.app)
        .get('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const data: RequestAccess = resp.body.data;
            should().exist(data.request_id);
            expect(data.request_id).to.be.equal(reqAccess.request_id);
            await RequestAccessController.shared.remove(reqAccess);
        });
    });

});

// --------
