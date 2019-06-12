/**
 * Factories: User
 */
import * as faker from 'faker';

import { User, AccountStatus, UserDataController} from '../models/user';
import { RolesCodeValue, RoleCodeController } from '../models/appRolesCode';

/**
 * @description User Factory function
 * @export const closure userFactory
 * @param RolesCodeValue accessCodeValue
 * @return Promise<User>
 */
export const userFactory = async (accessCodeValue: RolesCodeValue): Promise<User> => {
    const user = UserDataController.shared.create();
    user.email = faker.internet.email();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.accountStatus = AccountStatus.active;
    user.roles = [ await RoleCodeController.shared.fetchOne({code: accessCodeValue})];
    await UserDataController.shared.saveInDB(user);
    return user;
};

// -----------------------------------------------------------------------
