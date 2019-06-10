// Test for admin ops data models
import {  UserDataController, RequestAccessController, UserMessageController, UserMessage } from '../models';
import { SharedDBManager } from '../dataBaseManager';
import {  requestAccessFactory, userMessageFactory } from '../factory';

describe('Test Admin ops data models', () => {
    beforeAll(async () => {
        return  await SharedDBManager.connect();
    });
    afterAll(async () => {
        return await SharedDBManager.close();
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
