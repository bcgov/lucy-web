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
import * as request from 'supertest';
import { should } from 'chai';
import { UserDataController, RoleCodeController, RolesCodeValue, User } from '../database/models';
import { action } from '../libs/utilities';
import { SharedDBManager } from '../database/dataBaseManager';
import { adminToken, editorToken, viewerToken } from './token';

/**
 * @description Closure type to verify any data
 */
export type VerifyData = (data: any) => Promise<void>;

/**
 * @description Check Success json structure of any test
 * @param any body
 * @param VerifyData otherFieldVerify
 */
export const verifySuccessBody = async (body: any, otherFieldVerify?: VerifyData) => {
    should().exist(body.data);
    should().exist(body.message);
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
    // console.dir(body);
    should().exist(body.errors);
    should().exist(body.message);
    if (otherFieldVerify) {
        await otherFieldVerify(body.errors);
    }
};

/**
 * @description Create Admin user in mock data-map
 * @returns Promise<User>
 */
export const createAdmin = async (): Promise<User> => {
    const existing = await UserDataController.shared.findById(1);
    if (existing) {
        return existing;
    }
    const admin = await UserDataController.shared.create();
    admin.email = 'istest1@idir';
    admin.preferredUsername = 'istest1@idir';
    admin.firstName = 'First';
    admin.lastName = 'Last';
    admin.roles = [await RoleCodeController.shared.getCode(RolesCodeValue.admin)];
    await UserDataController.shared.saveInDB(admin);
    return admin;
};

/**
 * @description Check add call mock setup as per env
 * @param action setup Closure
 * @param boolean immediately Boolean flag to run setup action immediately
 */
export const runMockSetup = async (setup: action, immediately?: boolean): Promise<void> => {
    if (process.env.DB_MOCK) {
        if (immediately) {
            setup();
        } else {
            await setup();
        }
    }
};

/**
 * @description Check call no mock setup
 * @param action setup Closure
 * @param boolean immediately Boolean flag to run setup action immediately
 */
export const runNoMockSetup = async (setup: action, immediately?: boolean): Promise<void> => {
    if (!process.env.DB_MOCK) {
        if (immediately) {
            setup();
        } else {
            await setup();
        }
    }
};

/**
 * @description Common test setup for each test suit
 */
export const commonTestSetupAction = async (): Promise<any> => {
    const resp: any = {};
    if (process.env.DB_MOCK) {
        const admin = await createAdmin();
        resp.admin = admin;
    } else {
        await SharedDBManager.connect();
    }
    return resp;
};

/**
 * @description Common test tear down action for each test suit
 */
export const commonTestTearDownAction = async (): Promise<void> => {
    if (!process.env.DB_MOCK) {
        await SharedDBManager.close();
    }
};

/**
 * @description AuthType of request
 */
export const enum AuthType {
    admin = 1,
    viewer = 2,
    sme = 3,
    noAuth = 4,
    token = 0
}

export const enum HttpMethodType {
    get = 'get',
    post = 'post',
    put = 'put',
    delete = 'delete'
}

export interface TestSetup {
    type: HttpMethodType;
    url: string;
    expect: number;
    auth?: AuthType;
    send?: any;
    token?: string;
}

/**
 * @description Generic test request creation
 * @param app Express App
 * @param callback Callback to customize request
 * @param except Expected status
 * @param auth  auth type
 * @param send send data
 */
export const testRequest = (app: any, setup: TestSetup) => {
    const actualAuth: number = (setup.auth || AuthType.token) as number;
    let token: string;
    switch (actualAuth) {
        case 1:
            // console.log('here....');
            token = adminToken();
            break;
        case 3:
            token = editorToken();
            break;
        case 2:
            token = viewerToken();
            break;
        case 4:
            token = '';
            break;
        default:
            token = setup.token || '';
            break;
    }
    if (token && token !== '') {
        return request(app)[setup.type](setup.url)
        .set('Authorization', `Bearer ${token}`)
        .send(setup.send)
        .expect(setup.expect);
    } else {
        return request(app)[setup.type](setup.url)
        .send(setup.send)
        .expect(setup.expect);
    }
};

// -----------------------------------------------------------------------------------------------------------

