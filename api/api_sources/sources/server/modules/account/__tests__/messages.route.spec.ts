//
// Test for account/message route
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as request from 'supertest';
// import { SharedDBManager } from '../../../../database';
import { SharedExpressApp } from '../../../initializers';
import { UserDataController, RolesCodeValue, UserMessageController, User, UserMessage } from '../../../../database/models';
import { userFactory, userMessageFactory } from '../../../../database/factory';
import { verifySuccessBody, createAdmin, verifyErrorBody} from '../../../../test-helpers/testHelpers';
import { adminToken, viewerToken } from '../../../../test-helpers/token';

// Mock-DB
jest.mock('../../../../database/data.model.controller');
let admin: User;
describe('Test User Messages', () => {
    beforeAll(async () => {
        await SharedExpressApp.initExpress();
        admin = await createAdmin();
        return;
    });
    afterAll(async () => {
        return;
    });

    test('should fetch user messages', async (done) => {
        // 1. Create receiver, creator and message
        const sender = await userFactory(RolesCodeValue.admin);
        const message = await userMessageFactory(admin, sender);
        admin.messages = new Promise((resolve) => {
            resolve([message]);
        });
        // 2. Route
        await request(SharedExpressApp.app)
        .get('/api/v1/account/message')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .expect(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.length).toBeGreaterThan(0);
            });
            // Clean
            await UserMessageController.shared.remove(message);
            await UserDataController.shared.remove(sender);
            done();
        });
    });

    test('should update user messages', async (done) => {
        // 1. Create receiver, creator and message
        const receiver = await UserDataController.shared.findById(1);
        const sender = await userFactory(RolesCodeValue.admin);
        const message = await userMessageFactory(receiver, sender);

        // Update body
        const update = { status: 2};

        // 2. Route
        await request(SharedExpressApp.app)
        .put(`/api/v1/account/message/${message.message_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(update)
        .expect(200)
        .expect(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.status).toEqual(update.status);
                const fetchMessage = await UserMessageController.shared.findById(message.message_id);
                expect(fetchMessage.status).toEqual(update.status);
            });
            // Clean
            await UserMessageController.shared.remove(message);
            await UserDataController.shared.remove(sender);
            done();
        });
    });

    test('should create new message', async  (done) => {
        const receiver = await userFactory(RolesCodeValue.editor);
        const createBody = {
            receiver: receiver.user_id,
            title: 'Test',
            body: 'Test 2',
            type: 0
        };
        await request(SharedExpressApp.app)
        .post(`/api/v1/account/message/`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(createBody)
        .expect(200)
        .expect(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.title).toEqual(createBody.title);
                expect(body.receiver).toBeDefined();
                expect(body.receiver.user_id).toEqual(receiver.user_id);
                expect(body.message_id).toBeDefined();
                const message: UserMessage = await UserMessageController.shared.findById(body.message_id);
                await UserMessageController.shared.remove(message);
            });
            // Clean
            await UserDataController.shared.remove(receiver);
            done();
        });
    });

    test('should fail to create new message for viewer', async  (done) => {
        const receiver = await userFactory(RolesCodeValue.editor);
        const createBody = {
            receiver: receiver.user_id,
            title: 'Test',
            body: 'Test 2',
            type: 0
        };
        await request(SharedExpressApp.app)
        .post(`/api/v1/account/message/`)
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(createBody)
        .expect(401)
        .expect(async (resp) => {
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(receiver);
            done();
        });
    });
});

// ---------------------------------------------------------
