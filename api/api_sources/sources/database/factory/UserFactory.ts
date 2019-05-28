import * as faker from 'faker';
import { Connection} from 'typeorm';

import { User} from '../models/User';
import { LoginAccessCodeValue, LoginAccessCode } from '../models/LoginAccessCode';

export const userFactory = async (accessCodeValue: LoginAccessCodeValue, connection: Connection): Promise<User> => {
    const user = new User();
    user.email = faker.internet.email(),
    user.firstName = faker.name.firstName(),
    user.lastName = faker.name.lastName(),
    user.accessCode = await LoginAccessCode.controller.fetchOne(connection,{code: accessCodeValue});
    return user;
};