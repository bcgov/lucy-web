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

// JEST Mock Config
/*if (process.env.DB_MOCK) {
    jest.mock('../../../../database/data.model.controller');
}*/
/**
 * Imports
 */
import * as request from 'supertest';
import * as path from 'path';
import { expect} from 'chai';
import { SharedExpressApp } from '../../../initializers';
import { UserDataController, RolesCodeValue, UserMessageController, User, UserMessage } from '../../../../database/models';
import { userFactory, userMessageFactory } from '../../../../database/factory';
import { verifySuccessBody, verifyErrorBody, runMockSetup, commonTestSetupAction, commonTestTearDownAction, runNoMockSetup} from '../../../../test-helpers/testHelpers';
import { adminToken, viewerToken } from '../../../../test-helpers/token';
// import { SharedDBManager } from '../../../../database/dataBaseManager';

let admin: User;
describe('Test User Messages', () => {
    before(async () => {
        const resp: any = await commonTestSetupAction();
        await SharedExpressApp.initExpress();
        admin = resp.admin;
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should fetch user messages', async () => {
        // 1. Create receiver, creator and message
        await runNoMockSetup(async () => {
            admin = await UserDataController.shared.findById(1);
        });
        const sender = await userFactory(RolesCodeValue.admin);
        const message = await userMessageFactory(admin, sender);
        runMockSetup(() => {
            admin.messages = new Promise(resolve => resolve([message]));
        }, true);
        // 2. Route
        await request(SharedExpressApp.app)
        .get('/api/account/message')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.length).to.be.greaterThan(0);
            });
            // Clean
            await UserMessageController.shared.remove(message);
            await UserDataController.shared.remove(sender);
            // done();
        });
    });

    it('should update user messages', async () => {
        // 1. Create receiver, creator and message
        const receiver = await UserDataController.shared.findById(1);
        const sender = await userFactory(RolesCodeValue.admin);
        const message = await userMessageFactory(receiver, sender);

        // Update body
        const update = { status: 2};

        // 2. Route
        await request(SharedExpressApp.app)
        .put(`/api/account/message/${message.message_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(update)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.status).to.equal(update.status);
                const fetchMessage = await UserMessageController.shared.findById(message.message_id);
                expect(fetchMessage.status).to.equal(update.status);
            });
            // Clean
            await UserMessageController.shared.remove(message);
            await UserDataController.shared.remove(sender);
            // done();
        });
    });

    it('should create new message', async  () => {
        const receiver = await userFactory(RolesCodeValue.editor);
        const createBody = {
            receiver: receiver.user_id,
            title: 'Test',
            body: 'Test 2',
            type: 0
        };
        await request(SharedExpressApp.app)
        .post(`/api/account/message/`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(createBody)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.title).to.equal(createBody.title);
                expect(body.receiver).not.equal(undefined);
                expect(body.receiver.user_id).to.equal(receiver.user_id);
                expect(body.message_id).not.equal(undefined);
                const message: UserMessage = await UserMessageController.shared.findById(body.message_id);
                await UserMessageController.shared.remove(message);
            });
            // Clean
            await UserDataController.shared.remove(receiver);
            // done();
        });
    });

    it('should fail to create new message for viewer', async  () => {
        const receiver = await userFactory(RolesCodeValue.editor);
        const createBody = {
            receiver: receiver.user_id,
            title: 'Test',
            body: 'Test 2',
            type: 0
        };
        await request(SharedExpressApp.app)
        .post(`/api/account/message/`)
        .set('Authorization', `Bearer ${viewerToken()}`)
        .send(createBody)
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(receiver);
            // done();
        });
    });

    it('should upload file', async () => {
        // Create form
        const filePath = path.resolve(__dirname, '../../../../../resources/jsons/musselsApp/MusselInspectors.json');

        await request(SharedExpressApp.app)
        .post('/api/uploads/report-issue')
        .set('Authorization', `Bearer ${adminToken()}`)
        .set('Content-type', 'multipart/form-data')
        .field('name', 'test.json')
        .attach('file', filePath, { contentType: 'application/json'})
        .expect(200);
    });
});

// ---------------------------------------------------------
