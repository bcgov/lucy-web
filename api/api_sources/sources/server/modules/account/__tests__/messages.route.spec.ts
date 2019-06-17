/**
 * Test for user messages
 */
import * as request from 'supertest';
// import { SharedDBManager } from '../../../../database';
import { SharedExpressApp } from '../../../initializers';
import { UserDataController, RolesCodeValue, UserMessageController, User } from '../../../../database/models';
import { userFactory, userMessageFactory } from '../../../../database/factory';
import { verifySuccessBody, createAdmin} from '../../../../test-resources/testHelpers';
import { adminToken } from '../../../../test-resources/token';

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

});

// ---------------------------------------------------------
