//
// Login Data Model Tests
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
    jest.mock('../data.model.controller');
}*/

import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    User,
    UserDataController,
    RolesCodeValue,
    UserSession,
    UserSessionDataController,
    SessionActivity,
    SessionActivityCodeValues,
    SessionActivityController,
    RolesCode,
    RoleCodeController
} from '../models';
// import { SharedDBManager } from '../dataBaseManager';
import { userFactory, sessionFactory, sessionActivityFactory } from '../factory';

describe('Test Login Data Model', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should fetch different roles', async () => {

        const test = async (code: RolesCodeValue) => {
            const item: RolesCode = await  RoleCodeController.shared.getCode(code);
            should().exist(item);
            expect(item.roleCode).to.be.equal(code);
        };
        await test(RolesCodeValue.admin);
        await test(RolesCodeValue.editor);
        await test(RolesCodeValue.viewer);
        await test(RolesCodeValue.superUser);
        await test(RolesCodeValue.inspectAppAdmin);
        await test(RolesCodeValue.inspectAppOfficer);
    });

    it('should create/fetch model (admin)', async () => {
        const user = await userFactory(RolesCodeValue.admin);
        expect(user).not.equal(undefined);
        if (user) {
            // Fetching
            const dbUser: User  = await UserDataController.shared.fetchOne({ email : user.email});
            expect(dbUser).not.equal(undefined);
            expect(dbUser.email).to.equal(user.email);
            expect(dbUser.firstName).to.equal(user.firstName);
            expect(dbUser.lastName).to.equal(user.lastName);
            expect(dbUser.roles).not.equal(undefined);
            expect(dbUser.roles[0].code).to.equal(RolesCodeValue.admin);

            // Cleaning
            await UserDataController.shared.remove(user);
        }

        // done();
    });


    it('should fail to fetch user', async () => {
        const user: User = await UserDataController.shared.fetchOne({ email: 'ios.dev@email.com'});
        expect(user).to.equal(undefined);
        expect(UserSession).not.equal(undefined);
        expect(UserSessionDataController).not.equal(undefined);
        expect(SessionActivity).not.equal(undefined);
        expect(SessionActivityController).not.equal(undefined);
        expect(SessionActivityCodeValues).not.equal(undefined);
        expect(sessionActivityFactory).not.equal(undefined);
        expect(sessionFactory).not.equal(undefined);
        // done();
    });

    it('should create / fetch UserSession', async () => {
        // Create user-session
        const userSession = await sessionFactory(RolesCodeValue.admin);
        expect(userSession).not.equal(undefined);

        // Save user
        await UserDataController.shared.saveInDB(userSession.user);
        await UserSessionDataController.shared.saveInDB(userSession);

        // Save user current session
        await UserDataController.shared.setCurrentSession(userSession.user, userSession);

        const dbSession: UserSession = await UserSessionDataController.shared.fetchOne( {
            token: userSession.token
        });
        // Checking basic data
        expect(dbSession.lastLoginAt).to.eql(userSession.lastLoginAt);
        expect(dbSession.lastActiveAt).to.eql(userSession.lastActiveAt);
        expect(dbSession.tokenLifeTime).to.equal(userSession.tokenLifeTime);

        // Checking user relationship
        expect(dbSession.user).not.equal(undefined);
        expect(dbSession.user.email).to.equal(userSession.user.email);

        // Checking currentSession relationship of user
        UserDataController.shared.setCurrentSession(dbSession.user, dbSession);
        const currentSession: UserSession = await UserDataController.shared.getCurrentSession(dbSession.user);
        expect(currentSession).not.equal(undefined);
        expect(currentSession.session_id).to.equal(dbSession.session_id);

        await UserDataController.shared.remove(userSession.user);
        await UserSessionDataController.shared.remove(userSession);
        // done();
    });

    it('should create/fetch session activity', async () => {
        // Create session
        const sessionActivity: SessionActivity = await sessionActivityFactory(SessionActivityCodeValues.dataAdd);

        // Save
        await UserDataController.shared.saveInDB(sessionActivity.session.user);
        await UserSessionDataController.shared.saveInDB(sessionActivity.session);
        await SessionActivityController.shared.saveInDB(sessionActivity);

        // Fetch
        const fetchValues: SessionActivity = await SessionActivityController.shared.findById(sessionActivity.user_session_activity_id);

        // Test
        expect(fetchValues.session.session_id).to.eql(sessionActivity.session.session_id);
        expect(fetchValues.info).to.equal(sessionActivity.info);
        expect(fetchValues.activityCode).to.eql(sessionActivity.activityCode);

        // Remove
        const session = sessionActivity.session;
        const user = session.user;
        await SessionActivityController.shared.remove(sessionActivity);
        await UserSessionDataController.shared.remove(session);
        await UserDataController.shared.remove(user);

        // done();
    });

    it('should create and fetch user with Inspect App Admin/ officer', async () => {
        const test = async (code: RolesCodeValue) => {
            const user: User = await userFactory(code);
            should().exist(user);
            expect(user.roles[0].roleCode).to.be.equal(code);
            await UserDataController.shared.remove(user);
        };

        await test(RolesCodeValue.inspectAppAdmin);
        await test(RolesCodeValue.inspectAppOfficer);
    });
});

// ---------------
