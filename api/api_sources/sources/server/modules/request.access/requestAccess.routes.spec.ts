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
import { viewerToken, adminToken, inspectAppAdminToken, inspectAppOfficerToken } from '../../../test-helpers/token';
import { ModelFactory, Destroyer, requestAccessFactory } from '../../../database/factory';
import { RequestAccessController, RequestAccess, UserDataController, RoleCodeController, RolesCodeValue, User } from '../../../database/models';

describe('Test Request Access Route', () => {
    // Setup
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
        await clearRequestsDB();
    });
    after(async () => {
        await commonTestTearDownAction();
    });
    beforeEach(async () => await clearRequestsDB());

    const clearRequestsDB = async () => {
        const allRequests = await RequestAccessController.shared.all();
        await allRequests.forEach(async (reqAccess: RequestAccess) => await RequestAccessController.shared.remove(reqAccess));
    };

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

    // Test3: No duplicate Request Access for an user
    it('should not create duplicate request access', async () => {
        const reqBody: any = {
            requestedAccessCode: 3,
            requestNote: 'Please grant access'
        };

        // Allows creation as there are no request that exists already
        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            expect(resp.body.data.status).to.be.equal(0);
        });

        // Should not create a new access request as there is a valid pending access request
        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody)
        .expect(208)
        .then(async (resp) => {
            const allRequests = await RequestAccessController.shared.all();
            await verifySuccessBody(resp.body);
            expect(allRequests.length).to.be.equal(1);
        });
    });

    // Test4: Should create a new access request if the previous request was rejected
    it('should create a new access request if the previous request was rejected', async () => {
        const reqBody: any = {
            requestedAccessCode: 3,
            requestNote: 'Please grant access'
        };

        // Allows creation as there are no request that exists already
        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            expect(resp.body.data.status).to.be.equal(0);
        });
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        const userLatest = await UserDataController.shared.latestAccessRequest(user);
        should().exist(userLatest);
        const reqAccess = userLatest || new RequestAccess();
        should().exist(reqAccess.request_id);
        const body: any = {
            requestedAccessCode: 2,
            status: 2,
            approverNote: 'Your request was rejected'
        };

        // Updating request Access with rejection
        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(body)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const requestAccessInDB = await RequestAccessController.shared.fetchOne({ request_id: reqAccess.request_id });
            should().exist(requestAccessInDB);
            expect(requestAccessInDB.status).to.be.equal(2);
             // Allow new access request creation for the same user and role since the previous one was rejected
            await request(SharedExpressApp.app)
            .post('/api/request-access')
            .set('Authorization', `Bearer ${viewerToken()}`)
            .send(reqBody)
            .expect(201)
            .then(async (respNext) => {
                await verifySuccessBody(respNext.body);
                expect(respNext.body.data.status).to.be.equal(0);
            });
        });
    });

    // Test5: Allow access request creation for different roles
    it('should allow access request creation for different roles by the same user', async () => {
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

        const reqBody2: any = {
            requestedAccessCode: 6,
            requestNote: 'Please grant access'
        };

        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody2)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            expect(resp.body.data.status).to.be.equal(0);
        });
    });

    // Test6: Allow access request creation for same role by different users
    it('should allow access request creation for same role by different users', async () => {
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

        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${inspectAppOfficerToken()}`)
        .send(reqBody)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            expect(resp.body.data.status).to.be.equal(0);
        });
    });

    // Test7: Should not allow access creation for a role that already exists
    it('should not allow access request creation for a role that the current user already has', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        user.roles = [await RoleCodeController.shared.getCode(RolesCodeValue.viewer)];
        const reqBody: any = {
            requestedAccessCode: 2,
            requestNote: 'Please grant access'
        };

        await request(SharedExpressApp.app)
        .post('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(reqBody)
        .expect(208)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
        });
    });

    // Test8: Get For admin
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
            // const data: any[] = resp.body.data || [];
            // expect(data.length).to.be.greaterThan(0);
            await Destroyer(RequestAccessController.shared)(reqAccess);
        });
    });

    // Test9: Get own request obj
    it('should get user own request access', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        reqAccess.requester = user;
        should().exist(reqAccess.requester);
        RequestAccessController.shared.saveInDB(reqAccess);
        const latest: any = await UserDataController.shared.latestAccessRequest(reqAccess.requester) || {};
        should().exist(latest);
        const allRequests = await RequestAccessController.shared.all({ status: 0, requester_user_id: user });
        const pendingStatus: any = await UserDataController.shared.getPendingStatus(allRequests);
        should().exist(pendingStatus);
        // expect(latest.request_id).to.be.equal(reqAccess.request_id);
        await request(SharedExpressApp.app)
        .get('/api/request-access')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const data: any = resp.body.data;
            should().exist(data.latestRequest.request_id);
            expect(data.latestRequest.request_id).to.be.equal(reqAccess.request_id);
            expect(data.pendingAdminRequests).to.be.equal(false);
            expect(data.pendingViewerRequests).to.be.equal(false);
            expect(data.pendingEditorRequests).to.be.equal(true);
            expect(data.pendingSuperUserRequests).to.be.equal(false);
            expect(data.pendingOfficerRequests).to.be.equal(false);
            expect(data.pendingAdminInspectRequests).to.be.equal(false);
            await RequestAccessController.shared.remove(reqAccess);
        });
    });

    // Test10: Should Update Officer request {Inspect app editor} by Inspect App Admin
    it('should update request {Inspect App User} by {Inspect App Admin}', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        reqAccess.requestedAccessCode = await RoleCodeController.shared.getCode(RolesCodeValue.inspectAppOfficer);
        await RequestAccessController.shared.saveInDB(reqAccess);
        should().exist(reqAccess);
        const body: any = {
            requestedAccessCode: reqAccess.requestedAccessCode.role_code_id,
            status: 1,
            approverNote: 'Your access level upgraded'
        };

        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${inspectAppAdminToken()}`)
        .send(body)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const received = resp.body.data;
            expect(received.status).to.be.equal(body.status);
            await RequestAccessController.shared.remove(reqAccess);
            user.roles = [ await RoleCodeController.shared.getCode(RolesCodeValue.viewer)];
            await UserDataController.shared.saveInDB(user);
        });
    });

    // Test11: Should not Update request by viewer
    it('should not update request by {viewer}', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        should().exist(reqAccess);
        const body: any = {
            requestedAccessCode: 2,
            status: 1,
            approverNote: 'Your access level upgraded'
        };

        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(body)
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            const requestAccessInDB = await RequestAccessController.shared.fetchOne({ request_id: reqAccess.request_id });
            should().exist(requestAccessInDB);
            expect(requestAccessInDB.status).to.be.equal(0);
            await RequestAccessController.shared.remove(reqAccess);
        });

    });

    // Test12: Should not Update request by Inspect App Admin
    it('should not update request by {Inspect App Admin}', async () => {
        const user: User =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        should().exist(reqAccess);
        const body: any = {
            requestedAccessCode: 2,
            status: 1,
            approverNote: 'Your access level upgraded'
        };

        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${inspectAppAdminToken()}`)
        .send(body)
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            const requestAccessInDB = await RequestAccessController.shared.fetchOne({ request_id: reqAccess.request_id });
            should().exist(requestAccessInDB);
            expect(requestAccessInDB.status).to.be.equal(0);
            await RequestAccessController.shared.remove(reqAccess);
        });

    });

    // Test13: Should not Update request by Inspect App Officer
    it('should not update request by {Inspect App Officer}', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        should().exist(reqAccess);
        const body: any = {
            requestedAccessCode: 2,
            status: 1,
            approverNote: 'Your access level upgraded'
        };

        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${inspectAppOfficerToken()}`)
        .send(body)
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await RequestAccessController.shared.remove(reqAccess);
        });

    });

    // Test14: Update request by admin only
    it('should update request by {admin}', async () => {
        const user =  await UserDataController.shared.fetchOne({ email: 'istest5@gov.bc.ca'});
        should().exist(user);
        const reqAccess: RequestAccess = await requestAccessFactory(user);
        should().exist(reqAccess);
        const body: any = {
            requestedAccessCode: 2,
            status: 1,
            approverNote: 'Your access level upgraded'
        };

        await request(SharedExpressApp.app)
        .put(`/api/request-access/${reqAccess.request_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(body)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body);
            const requestAccessInDB = await RequestAccessController.shared.fetchOne({ request_id: reqAccess.request_id });
            should().exist(requestAccessInDB);
            expect(requestAccessInDB.status).to.be.equal(1);
            await RequestAccessController.shared.remove(reqAccess);
            user.roles = [ await RoleCodeController.shared.getCode(RolesCodeValue.viewer)];
            await UserDataController.shared.saveInDB(user);
        });
    });

});

// --------
