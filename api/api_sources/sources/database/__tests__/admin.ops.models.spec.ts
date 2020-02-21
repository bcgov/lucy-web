//
// Admin Data Model Tests
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
//
/**
 * Test for admin ops data models
 */

// JEST Mock Config
/*if (process.env.DB_MOCK) {
    jest.mock('../data.model.controller');
}*/
import { expect } from 'chai';
import {  UserDataController, RequestAccessController, UserMessageController, UserMessage, RequestAccess } from '../models';
import {  requestAccessFactory, userMessageFactory } from '../factory';
import { runMockSetup, commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
// import { SharedDBManager } from '../dataBaseManager';
describe('Test Admin ops data models', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
    });
    it('should create/fetch request access', async () => {
        // Obj
        const obj = await requestAccessFactory();
        // Save
        await UserDataController.shared.saveInDB(obj.requester);
        await UserDataController.shared.saveInDB(obj.approver);
        await RequestAccessController.shared.saveInDB(obj);
        runMockSetup(() => {
            obj.requester.requestAccess = new Promise(res => res([obj]));
        });

        // Fetch
        const dbObj = await  RequestAccessController.shared.findById(obj.request_id);
        expect(dbObj).not.equal(undefined);
        expect(dbObj.approverNote).to.equal(obj.approverNote);
        expect(dbObj.approver.user_id).to.equal(obj.approver.user_id);
        expect(dbObj.requester.user_id).to.equal(obj.requester.user_id);
        expect(dbObj.requestedAccessCode.role_code_id).to.equal(obj.requestedAccessCode.role_code_id);
        expect(dbObj.requestedAccessCode).to.eql(obj.requestedAccessCode);

        // Check relationship of user
        const request: RequestAccess[]  = await obj.requester.requestAccess;
        expect(request).not.equal(undefined);
        expect(request.length).to.be.greaterThan(0);

        // Clean
        RequestAccessController.shared.remove(obj);
        UserDataController.shared.remove(obj.approver);
        UserDataController.shared.remove(obj.requester);
        // done();
    });

    it('should create/fetch user message', async () => {
        // Message
        const message = await userMessageFactory();

        // Save
        await UserDataController.shared.saveInDB(message.creator);
        await UserDataController.shared.saveInDB(message.receiver);
        await UserMessageController.shared.saveInDB(message);

        // Fetch
        const dbObj: UserMessage = await UserMessageController.shared.findById(message.message_id);
        // Test
        expect(dbObj).not.equal(undefined);
        expect(dbObj.creator.user_id).to.equal(message.creator.user_id);
        expect(dbObj.receiver.user_id).to.equal(message.receiver.user_id);
        expect(dbObj.body).to.equal(message.body);

        // Clean
        await UserMessageController.shared.remove(message);
        await UserDataController.shared.remove(message.creator);
        await UserDataController.shared.remove(message.receiver);

        // done();
    });
});
