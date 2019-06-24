//
// Test helpers method
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
/**
 * Imports
 */
import { UserDataController, RoleCodeController, RolesCodeValue, User } from '../database/models';

/**
 * @description Closure type to verify any data
 */
export type VerifyData = (data: any) => void;

/**
 * @description Check Success json structure of any test
 * @param any body
 * @param VerifyData otherFieldVerify
 */
export const verifySuccessBody = async (body: any, otherFieldVerify?: VerifyData) => {
    expect(body.data).toBeDefined();
    expect(body.message).toBeDefined();
    if (otherFieldVerify) {
        await otherFieldVerify(body.data);
    }
};

/**
 * @description Check error json structure of any test
 * @param any body
 * @param VerifyData otherFieldVerify
 */
export const verifyErrorBody = async (body: any, otherFieldVerify?: VerifyData) => {
    expect(body.errors).toBeDefined();
    expect(body.message).toBeDefined();
    if (otherFieldVerify) {
        await otherFieldVerify(body.errors);
    }
};

/**
 * @description Create Admin user in mock data-map
 * @returns Promise<User>
 */
export const createAdmin = async (): Promise<User> => {
    const admin = await UserDataController.shared.create();
    admin.email = 'amir@freshworks.io';
    admin.preferredUsername = 'ashayega@idir';
    admin.firstName = 'Amir';
    admin.lastName = 'Shyega';
    admin.roles = [await RoleCodeController.shared.getCode(RolesCodeValue.admin)];
    UserDataController.shared.saveInDB(admin);
    return admin;
};
// -----------------------------------------------------------------------------------------------------------

