// Test for admin ops data models
import {  UserDataController, RequestAccessController } from '../models';
import { SharedDBManager } from '../DataBaseManager';
import {  requestAccessFactory } from '../factory'

describe('Test Admin ops data models', () => {
    beforeAll(() => {
        return  SharedDBManager.connect();
    });
    afterAll(() => {
        return SharedDBManager.close();
    });

    test('should create/fetch request access', async (done) => {
        // Obj
        const obj = await requestAccessFactory();
        // Save
        try {
            await UserDataController.shared.saveInDB(obj.requester);
            await UserDataController.shareInstance.saveInDB(obj.approver);
            await RequestAccessController.shared.saveInDB(obj);
        } catch(excp) {
            console.log(`req-access: Exception{0}: ${excp}`);
            expect(expect).toBeUndefined();
        }

        // Fetch
        try {
            const dbObj = await  RequestAccessController.shared.findById(obj.request_id)
            expect(dbObj).toBeDefined();
            expect(dbObj.approverNote).toEqual(obj.approverNote);
            expect(dbObj.approver).toEqual(obj.approver);
            expect(dbObj.requester).toEqual(obj.requester);
            expect(dbObj.requestedAccessCode).toEqual(obj.requestedAccessCode);
        } catch(excp) {
            console.log(`req-access: Exception{1}: ${excp}`);
            expect(expect).toBeUndefined();
        }

        // Clean
        RequestAccessController.shared.remove(obj);
        UserDataController.shared.remove(obj.approver);
        UserDataController.shared.remove(obj.requester);
        done();
    })
});