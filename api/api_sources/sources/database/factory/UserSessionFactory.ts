import { Connection} from 'typeorm';
import * as faker from 'faker';
import { userFactory } from './UserFactory';
import { User, UserSession, LoginAccessCodeValue} from '../models';

export const sessionFactory = async (login: LoginAccessCodeValue, connection: Connection): Promise <UserSession> => {
    // 1. Create User
    const user: User = await userFactory(login, connection);

    // 2. Create 
    const session: UserSession = UserSession.controller.create();
    session.lastActiveAt = faker.date.recent();
    session.lastActiveAt = faker.date.recent();
    session.token = faker.random.alphaNumeric();
    session.tokenExpiry = faker.date.future();
    session.tokenExpiryTime = faker.random.number();
    session.user = user;

    return session;

};