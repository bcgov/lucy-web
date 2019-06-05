// User Factory
import * as faker from 'faker';

import { User} from '../models/User';
import { LoginAccessCodeValue, LoginAccessCodeController } from '../models/LoginAccessCode';

export const userFactory = async (accessCodeValue: LoginAccessCodeValue): Promise<User> => {
    const user = new User();
    user.email = faker.internet.email();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.accessCodes = [ await LoginAccessCodeController.shared.fetchOne({code: accessCodeValue})];
    return user;
};