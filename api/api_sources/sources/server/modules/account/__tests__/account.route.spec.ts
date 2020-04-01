//
// Account route tests
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
import {expect} from 'chai';
import { SharedExpressApp } from '../../../initializers';
import { adminToken, testIdr3Token, testIdr1Token, testIdr2Token } from '../../../../test-helpers/token';
import { verifySuccessBody, verifyErrorBody, commonTestSetupAction, commonTestTearDownAction, testRequest, HttpMethodType} from '../../../../test-helpers/testHelpers';
import { UserDataController, RolesCodeValue, User } from '../../../../database/models';
import { userFactory } from '../../../../database/factory';
// import { SharedDBManager } from '../../../../database/dataBaseManager';

/**
 * Test for account route
 */
describe('Test account routes', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('debug test', () => {});

    it('should fail to fetch me', async () => {
        await request(SharedExpressApp.app)
        .get('/api/account/me')
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            // done();
        });
    });

    it('should fetch me', async () => {
        await request(SharedExpressApp.app)
        .get('/api/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            const body = resp.body;
            await verifySuccessBody(body, async (data: any) => {
                expect(data.preferredUsername).to.equal('istest1@idir');
            });
            // done();
        });
    });

    it('should fetch me {test.idr3}', async () => {
        await request(SharedExpressApp.app)
        .get('/api/account/me')
        .set('Authorization', `Bearer ${testIdr3Token()}`)
        .expect(200)
        .then(async (resp) => {
            const body = resp.body;
            await verifySuccessBody(body, async (data: any) => {
                expect(data.preferredUsername).to.equal('istest3@idir');
            });
            // done();
        });
    });

    it('should update me', async () => {
        const fname = 'Test';
        const lname = 'Idr1';
        const user = await UserDataController.shared.fetchOne({preferredUsername : 'istest1@idir'});
        expect(user).not.to.equal(undefined);
        await request(SharedExpressApp.app)
        .put('/api/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
            firstName: fname,
            lastName: lname
        })
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (data: any) => {
                expect(data.firstName).to.equal(fname);
                expect(data.lastName).equal(lname);
            });
            // Revert
            await UserDataController.shared.saveInDB(user);
            // Finish
            // done();
        });
    });

    it('should fail to update me', async () => {
        await request(SharedExpressApp.app)
        .put('/api/account/me')
        .send({
            firstName: 'XYZ',
            lastName: 'ABC'
        })
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            // done();
        });
    });

    it('should not update my role', async () => {
        const user = await UserDataController.shared.fetchOne({preferredUsername : 'istest1@idir'});
        await request(SharedExpressApp.app)
        .put('/api/account/me')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
            roles: [1, 2, 3]
        })
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async  (data: any) => {
                const updatedUser = await UserDataController.shared.fetchOne({preferredUsername : 'istest1@idir'});
                expect(updatedUser.roles).to.eql(user.roles);
            });
            // Finish
            // done();
        });
    });

    it('should fetch user with {id}', async () => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await request(SharedExpressApp.app)
        .get(`/api/account/user/${newUser.user_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            // Very resp body
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.user_id).to.equal(newUser.user_id);
            });
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            // done();
        });
    });

    it('should not fetch user with {id}', async () => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await request(SharedExpressApp.app)
        .get(`/api/account/user/${newUser.user_id}`)
        .expect(401)
        .then(async (resp) => {
            // Very resp body
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            // done();
        });
    });

    it('should update user with {id}', async () => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        const updateUserData = {
            firstName: 'Laba',
            lastName: 'Goba',
            accountStatus: 1,
            roles: [1]
        };
        await request(SharedExpressApp.app)
        .put(`/api/account/user/${newUser.user_id}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(updateUserData)
        .expect(200)
        .then(async (resp) => {
            // Very resp body
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.user_id).to.equal(newUser.user_id);
                expect(data.lastName).to.equal(updateUserData.lastName);
                expect(data.firstName).to.equal(updateUserData.firstName);
                expect(data.roles.length).to.equal(updateUserData.roles.length);
                expect(data.accountStatus).to.equal(updateUserData.accountStatus);
                // Fetch user
                const dbUser: User = await UserDataController.shared.findById(newUser.user_id);
                expect(dbUser.lastName).to.equal(updateUserData.lastName);
                expect(dbUser.firstName).to.equal(updateUserData.firstName);
                expect(dbUser.roles.length).to.equal(updateUserData.roles.length);
                expect(dbUser.accountStatus).to.equal(updateUserData.accountStatus);
            });
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            // done();
        });
    });

    it('should not update user with {id}', async () => {
        const newUser = await userFactory(RolesCodeValue.viewer);
        await UserDataController.shared.saveInDB(newUser);
        const updateUserData = {
            firstName: 'Laba',
            lastName: 'Goba',
            accountStatus: 1,
            roles: [1]
        };
        await request(SharedExpressApp.app)
        .put(`/api/account/user/${newUser.user_id}`)
        .send(updateUserData)
        .expect(401)
        .then(async (resp) => {
            // Very resp body
            await verifyErrorBody(resp.body);
            // Clean
            await UserDataController.shared.remove(newUser);
            // Finish
            // done();
        });
    });

    it('should fetch roles', async () => {
        await request(SharedExpressApp.app)
        .get('/api/account/roles')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then((resp) => {
            const body = resp.body;
            verifySuccessBody(body, async (data: any) => {
                for (const item of data) {
                    expect(item.role_code_id).to.not.equal(undefined);
                }
            });
            // done();
        });
    });

    it('should act as editor [test-idr3]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/account/me',
            expect: 200,
            token: testIdr3Token()
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                expect(data.roles[0].code).to.be.equal('DAE');
            });
        });
    });

    it('should act as editor [test-idr1]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/account/me',
            expect: 200,
            token: testIdr1Token()
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                expect(data.roles[0].code).to.be.equal('ADM');
            });
        });
    });

    it('should act as editor [test-idr2]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/account/me',
            expect: 200,
            token: testIdr2Token()
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                expect(data.roles[0].code).to.be.equal('I_ADM');
            });
        });
    });
});
// -----------------------------------------------------------------------------------------------------------

