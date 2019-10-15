//
// User Factory
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
import { User, AccountStatus, UserDataController} from '../models';
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
    user.preferredUsername = user.email;
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
