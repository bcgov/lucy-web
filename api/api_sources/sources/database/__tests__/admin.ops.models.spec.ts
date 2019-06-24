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
import {  UserDataController, RequestAccessController, UserMessageController, UserMessage } from '../models';

import {  requestAccessFactory, userMessageFactory } from '../factory';

jest.mock('../data.model.controller');

describe('Test Admin ops data models', () => {
    beforeAll(async () => {
    });
    afterAll(async () => {
    });
    test('should create/fetch request access', async (done) => {
        // Obj
        const obj = await requestAccessFactory();
        // Save
        await UserDataController.shared.saveInDB(obj.requester);
        await UserDataController.shared.saveInDB(obj.approver);
        await RequestAccessController.shared.saveInDB(obj);

        // Fetch
        const dbObj = await  RequestAccessController.shared.findById(obj.request_id);
        expect(dbObj).toBeDefined();
        expect(dbObj.approverNote).toEqual(obj.approverNote);
        expect(dbObj.approver).toEqual(obj.approver);
        expect(dbObj.requester).toEqual(obj.requester);
        expect(dbObj.requestedAccessCode).toEqual(obj.requestedAccessCode);

        // Clean
        RequestAccessController.shared.remove(obj);
        UserDataController.shared.remove(obj.approver);
        UserDataController.shared.remove(obj.requester);
        done();
    });

    test('should create/fetch user message', async (done) => {
        // Message
        const message = await userMessageFactory();

        // Save
        await UserDataController.shared.saveInDB(message.creator);
        await UserDataController.shared.saveInDB(message.receiver);
        await UserMessageController.shared.saveInDB(message);

        // Fetch
        const dbObj: UserMessage = await UserMessageController.shared.findById(message.message_id);
        // Test
        expect(dbObj).toBeDefined();
        expect(dbObj.creator).toEqual(message.creator);
        expect(dbObj.receiver).toEqual(message.receiver);
        expect(dbObj.body).toEqual(message.body);

        // Clean
        await UserMessageController.shared.remove(message);
        await UserDataController.shared.remove(message.creator);
        await UserDataController.shared.remove(message.receiver);

        done();
    });
});
