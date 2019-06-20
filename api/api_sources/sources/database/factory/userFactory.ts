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
export const userFactory = async (accessCodeValue?: RolesCodeValue, noSave?: boolean, id?: number): Promise<User> => {
    const code = accessCodeValue || RolesCodeValue.admin;
    const user = UserDataController.shared.create();
    user.email = faker.internet.email();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.accountStatus = AccountStatus.active;
    user.roles = [ await RoleCodeController.shared.getCode(code)];
    if (!noSave) {
        await UserDataController.shared.saveInDB(user);
    } else {
        if (id) {
            user.user_id = id || 0;
        }
    }
    return user;
};

// -----------------------------------------------------------------------
