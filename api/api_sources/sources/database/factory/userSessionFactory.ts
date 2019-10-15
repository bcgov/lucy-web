//
// UserSession, SessionActivity Factory
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
// Created by Pushan Mitra on 2019-05-10.
/**
 * Imports
 */
import * as faker from 'faker';
import { userFactory } from './userFactory';
import { User, UserSession, UserSessionDataController, RolesCodeValue, SessionActivity, } from '../models';
import {SessionActivityCodeController, SessionActivityController, SessionActivityCodeValues} from '../models';

/**
 * @description UserSession Factory method
 * @export const closure sessionFactory
 * @param RolesCodeValue login
 * @return Promise<UserSession>
 */
export const sessionFactory = async (login?: RolesCodeValue, noSave?: boolean, id?: number): Promise <UserSession> => {
    // 1. Create User
    const user: User = await userFactory(login, noSave);

    // 2. Create
    const session: UserSession = UserSessionDataController.shared.create();
    session.lastActiveAt = faker.date.recent();
    session.token = faker.random.alphaNumeric(150);
    session.tokenExpiry = faker.date.future();
    session.tokenLifeTime = faker.random.number();
    session.user = user;
    if (!noSave) {
        await UserSessionDataController.shared.saveInDB(session);
    } else {
        if (id) {
            session.session_id = id || 0;
        }
    }
    return session;
};

/**
 * @description SessionActivity Factory method
 * @export const closure sessionActivityFactory
 * @param SessionActivityCodeValues code
 * @return Promise<SessionActivity>
 */
export const sessionActivityFactory = async (code?: SessionActivityCodeValues, noSave?: boolean, id?: number): Promise<SessionActivity>  => {
    // 1. Create session
    const session: UserSession = await sessionFactory(RolesCodeValue.admin, noSave);
    const sessionActivity: SessionActivity = SessionActivityController.shared.create();
    sessionActivity.session = session;
    sessionActivity.activityCode = await SessionActivityCodeController.shared.random();
    sessionActivity.info = faker.random.word();
    if (!noSave) {
        await SessionActivityController.shared.saveInDB(sessionActivity);
    } else {
        if (id) {
            sessionActivity.user_session_activity_id = id || 0;
        }
    }
    return sessionActivity;
};

// ------------------------------------------
