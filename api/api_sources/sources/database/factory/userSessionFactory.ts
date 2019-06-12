/**
 * Factories: UserSession, SessionActivity
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
export const sessionFactory = async (login: RolesCodeValue): Promise <UserSession> => {
    // 1. Create User
    const user: User = await userFactory(login);

    // 2. Create
    const session: UserSession = UserSessionDataController.shared.create();
    session.lastActiveAt = faker.date.recent();
    session.lastActiveAt = faker.date.recent();
    session.token = faker.random.alphaNumeric(150);
    session.tokenExpiry = faker.date.future();
    session.tokenLifeTime = faker.random.number();
    session.user = user;
    await UserSessionDataController.shared.saveInDB(session);
    return session;

};

/**
 * @description SessionActivity Factory method
 * @export const closure sessionActivityFactory
 * @param SessionActivityCodeValues code
 * @return Promise<SessionActivity>
 */
export const sessionActivityFactory = async (code: SessionActivityCodeValues): Promise<SessionActivity>  => {
    // 1. Create session
    const session: UserSession = await sessionFactory(RolesCodeValue.admin);
    const sessionActivity: SessionActivity = SessionActivityController.shared.create();
    sessionActivity.session = session;
    sessionActivity.code = await SessionActivityCodeController.shared.code(code);
    sessionActivity.info = faker.random.word();
    await SessionActivityController.shared.saveInDB(sessionActivity);
    return sessionActivity;
};

// ------------------------------------------
