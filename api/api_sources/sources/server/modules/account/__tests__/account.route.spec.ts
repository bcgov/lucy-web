import * as request from 'supertest';
import { SharedDBManager } from '../../../../database';
import { SharedExpressApp } from '../../../initializers';
import { adminToken } from '../../../../test-resources/token';
import { verifySuccessBody, verifyErrorBody} from '../../../../test-resources/testHelpers';
import { UserDataController, RolesCodeValue, User } from '../../../../database/models';
import { userFactory } from '../../../../database/factory';
/**
 * Test for account route
 */
describe('Test account routes', () => {
    beforeAll(async () => {
        await SharedExpressApp.initExpress();
        return  await SharedDBManager.connect();
    });
    afterAll(async () => {
        return await SharedDBManager.close();
    });

    test('should fail to fetch me', async (done) => {
        await request(SharedExpressApp.app)
        .get('/api/v1/account/me')
        .expect(401)
        .expect(async (resp) => {
            await verifyErrorBody(resp.body);
            done();
        });
    });

    test('should fetch me', async (done) => {
        await request(SharedExpressApp.app)
        .get('/api/v1/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .expect((resp) => {
            const body = resp.body;
            verifySuccessBody(body, (data: any) => {
                expect(data.email).toEqual('amir@freshworks.io');
            });
            done();
        });
    });

    test('should update me', async (done) => {
        const fname = 'AmirFW';
        const lname = 'FW';
        const user = await UserDataController.shared.fetchOne({email : 'amir@freshworks.io'});
        expect(user).toBeDefined();
        await request(SharedExpressApp.app)
        .put('/api/v1/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
            firstName: fname,
            lastName: lname
        })
        .expect(200)
        .expect(async (resp) => {
            await verifySuccessBody(resp.body, (data: any) => {
                expect(data.firstName).toEqual(fname);
                expect(data.lastName).toEqual(lname);
            });
            // Revert
            await UserDataController.shared.saveInDB(user);
            // Finish
            done();
        });
    });

    test('should fail to update me', async (done) => {
        await request(SharedExpressApp.app)
        .put('/api/v1/account/me')
        .send({
            firstName: 'XYZ',
            lastName: 'ABC'
        })
        .expect(401)
        .expect(async (resp) => {
            await verifyErrorBody(resp.body);
            done();
        });
    });

    test('should not update my role', async (done) => {
        const user = await UserDataController.shared.fetchOne({email : 'amir@freshworks.io'});
        await request(SharedExpressApp.app)
        .put('/api/v1/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
            roles: [1, 2, 3]
        })
        .expect(200)
        .expect(async (resp) => {
            await verifySuccessBody(resp.body, async  (data: any) => {
                const updatedUser = await UserDataController.shared.fetchOne({email : 'amir@freshworks.io'});
                expect(updatedUser.roles).toEqual(user.roles);
            });
            // Finish
            done();
        });
    });

    test('should fetch user with {id}', async (done) => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        await request(SharedExpressApp.app)
        .get(`/api/v1/account/user/${newUser.user_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .expect(async (resp) => {
            // Very resp body
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.user_id).toEqual(newUser.user_id);
            });
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            done();
        });
    });

    test('should not fetch user with {id}', async (done) => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        await request(SharedExpressApp.app)
        .get(`/api/v1/account/user/${newUser.user_id}`)
        .expect(401)
        .expect(async (resp) => {
            // Very resp body
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            done();
        });
    });

    test('should update user with {id}', async (done) => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        const updateUserData = {
            firstName: 'Laba',
            lastName: 'Goba',
            accountStatus: 1,
            roles: [1]
        };
        await request(SharedExpressApp.app)
        .put(`/api/v1/account/user/${newUser.user_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(updateUserData)
        .expect(200)
        .expect(async (resp) => {
            // Very resp body
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.user_id).toEqual(newUser.user_id);
                expect(data.lastName).toEqual(updateUserData.lastName);
                expect(data.firstName).toEqual(updateUserData.firstName);
                expect(data.roles.length).toEqual(updateUserData.roles.length);
                expect(data.accountStatus).toEqual(updateUserData.accountStatus);
                // Fetch user
                const dbUser: User = await UserDataController.shared.findById(newUser.user_id);
                expect(dbUser.lastName).toEqual(updateUserData.lastName);
                expect(dbUser.firstName).toEqual(updateUserData.firstName);
                expect(dbUser.roles.length).toEqual(updateUserData.roles.length);
                expect(dbUser.accountStatus).toEqual(updateUserData.accountStatus);
            });
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            done();
        });
    });

    test('should not update user with {id}', async (done) => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        const updateUserData = {
            firstName: 'Laba',
            lastName: 'Goba',
            accountStatus: 1,
            roles: [1]
        };
        await request(SharedExpressApp.app)
        .put(`/api/v1/account/user/${newUser.user_id}`)
        .send(updateUserData)
        .expect(401)
        .expect(async (resp) => {
            // Very resp body
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            done();
        });
    });

    test('should fetch roles', async (done) => {
        await request(SharedExpressApp.app)
        .get('/api/v1/account/roles')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .expect((resp) => {
            const body = resp.body;
            verifySuccessBody(body, async (data: any) => {
                for (const item of data) {
                    expect(item.role_code_id).toBeDefined();
                }
            });
            done();
        });
    });
});

// ----------------------------------
