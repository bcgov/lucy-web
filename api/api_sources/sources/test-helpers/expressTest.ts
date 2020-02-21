/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: expressTest.ts
 * Project: InvasivesBC
 * File Created: Monday, 7th October 2019 11:44:05 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 7th October 2019 11:44:08 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as request from 'supertest';
import * as _ from 'underscore';
import {
    expect
} from 'chai';
import { DataController } from '../database/data.model.controller';
import { BaseSchema } from '../libs/core-database';
import { AuthType, verifySuccessBody, verifyErrorBody, testModel } from './testHelpers';
import { adminToken, editorToken, viewerToken, inspectAppAdminToken, inspectAppOfficerToken } from './token';
import { ModelSpecFactory, RequestFactory, Destroyer, ModelFactory } from '../database/factory';

export interface ExpressSetup {
    url?: string;
    auth?: AuthType;
    token?: string;
    expect?: number;
    ignoreSchemaVerification?: boolean;
}

export class ExpressResourceTest {
    static verifyObjectBody(body: any, schema: BaseSchema) {
       testModel(body, schema);
    }

    /**
     * @description Get auth token for test
     * @param AuthType auth: Auth type for test
     * @param string defaultToken: Token for auth
     */
    static getToken(auth: AuthType, defaultToken?: string): string {
        const actualAuth: number = (auth || AuthType.token) as number;
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
            case 6:
                token = inspectAppAdminToken();
                break;
            case 5:
                token = inspectAppOfficerToken();
                break;
            case 4:
                token = '';
                break;
            default:
                token = defaultToken || '';
                break;
        }
        return token;
    }

    /**
     * @description Test Create / Post API
     * @param Express.app app: Express application
     * @param ExpressSetup setup: test setup
     * @param DataController controller: Model Controller
     */
    static async testCreate(app: any, setup: ExpressSetup, controller: DataController): Promise<any> {
        return new Promise(async (res, rej) => {
            // Schema
            const schema: BaseSchema = controller.schemaObject;
            // Create Data
            const spec: any = await ModelSpecFactory(controller)();
            const req: any = RequestFactory<any>(spec, { schema: schema});
            // Url
            const url: string = setup.url || controller.schemaObject.apiPath();
            // Checking token
            const actualAuth: number = (setup.auth || AuthType.token) as number;
            const token: string = this.getToken(actualAuth, setup.token);

            // Expect
            const expectedStatus = setup.expect || 201;
            if (token && token !== '') {
                request(app).post(url)
                .set('Authorization', `Bearer ${token}`)
                .send(req)
                .expect(expectedStatus)
                .then(async resp => {
                    if (expectedStatus === 201) {
                        await verifySuccessBody(resp.body);
                        this.verifyObjectBody(resp.body.data, schema);
                        await Destroyer(controller)(resp.body.data);
                    } else {
                        await verifyErrorBody(resp.body);
                        await Destroyer(controller)(spec, true);
                    }
                    res();
                })
                .catch(async err => {
                    await Destroyer(controller)(spec, true);
                    rej(err);
                });
            }
        });
    }

    static async testUpdate(app: any, setup: ExpressSetup, controller: DataController): Promise<any> {
        return new Promise(async (res, rej) => {
            // Schema
            const schema: BaseSchema = controller.schemaObject;
            // Create Data
            const model = await ModelFactory(controller)();
            const spec = await ModelSpecFactory(controller)();
            const req: any = RequestFactory<any>(spec, {schema: schema});

            // Url
            const baseUrl: string = setup.url || controller.schemaObject.apiPath();

            // Modify url
            const url = `${baseUrl}/${controller.getIdValue(model)}`;
            // Checking token
            const actualAuth: number = (setup.auth || AuthType.token) as number;
            const token: string = this.getToken(actualAuth, setup.token);

            // Expect
            const expectedStatus = setup.expect || 200;

            if (token && token !== '') {
                request(app).put(url)
                .set('Authorization', `Bearer ${token}`)
                .send(req)
                .expect(expectedStatus)
                .then(async resp => {
                    if (expectedStatus === 200) {
                        await verifySuccessBody(resp.body);
                        this.verifyObjectBody(resp.body.data, schema);
                        await Destroyer(controller)(resp.body.data);
                    } else {
                        await Destroyer(controller)(model);
                        await verifyErrorBody(resp.body);
                    }
                    await Destroyer(controller)(spec, true);
                    res();
                })
                .catch(async err => {
                    await Destroyer(controller)(model);
                    await Destroyer(controller)(spec, true);
                    rej(err);
                });
            }
        });
    }

    static testGetSingle(app: any, setup: ExpressSetup, controller: DataController): Promise<any> {
        return new Promise(async (res, rej) => {
            // Schema
            const schema: BaseSchema = controller.schemaObject;
            // Create Data
            const model = await ModelFactory(controller)();
            // Url
            const baseUrl: string = setup.url || controller.schemaObject.apiPath();

            // Modify url
            const url = `${baseUrl}/${controller.getIdValue(model)}`;
            // Checking token
            const actualAuth: number = (setup.auth || AuthType.token) as number;
            const token: string = this.getToken(actualAuth, setup.token);

            // Expect
            const expectedStatus = setup.expect || 200;

            if (token && token !== '') {
                request(app).get(url)
                .set('Authorization', `Bearer ${token}`)
                .expect(expectedStatus)
                .then(async resp => {
                    if (expectedStatus === 200) {
                        await verifySuccessBody(resp.body);
                        this.verifyObjectBody(resp.body.data, schema);
                        await Destroyer(controller)(resp.body.data);
                    } else {
                        await Destroyer(controller)(model);
                        await verifyErrorBody(resp.body);
                    }
                    res();
                })
                .catch(async err => {
                    await Destroyer(controller)(model);
                    rej(err);
                });
            }
        });
    }

    static testGetAll(app: any, setup: ExpressSetup, controller: DataController): Promise<any> {
        return new Promise(async (res, rej) => {
            // Schema
            const schema: BaseSchema = controller.schemaObject;
            // Create Data
            const model = await ModelFactory(controller)();
            // Url
            const url: string = setup.url || controller.schemaObject.apiPath();

            // Checking token
            const actualAuth: number = (setup.auth || AuthType.token) as number;
            const token: string = this.getToken(actualAuth, setup.token);

            // Expect
            const expectedStatus = setup.expect || 200;

            if (token && token !== '') {
                request(app).get(url)
                .set('Authorization', `Bearer ${token}`)
                .expect(expectedStatus)
                .then(async resp => {
                    if (expectedStatus === 200) {
                        await verifySuccessBody(resp.body);
                        const dataAll: any[] = resp.body.data;
                        expect(dataAll.length).to.be.greaterThan(0);
                        const filter = _.filter(dataAll, item => controller.getIdValue(item) === controller.getIdValue(model));
                        expect(filter.length).to.be.equal(1);
                        if (!setup.ignoreSchemaVerification) {
                            this.verifyObjectBody(filter[0], schema);
                        }
                        await Destroyer(controller)(model);
                    } else {
                        await Destroyer(controller)(model);
                        await verifyErrorBody(resp.body);
                    }
                    res();
                })
                .catch(async err => {
                    await Destroyer(controller)(model);
                    rej(err);
                });
            }
        });
    }

    static testGetFilteredItem(app: any, setup: ExpressSetup, controller: DataController, filterInfo: {[key: string]: any}): Promise<any> {
        return new Promise(async (res, rej) => {
            // Schema
            // const schema: BaseSchema = controller.schemaObject;
            // Create Data
            const model1 = await ModelFactory(controller)();
            const model2 = await ModelFactory(controller)();
            await ModelFactory(controller)();

            _.each(filterInfo, (v, k) => {
                if (model1[k]) {
                    model1[k] = v;
                }
                if (model2[k]) {
                    model2[k] = v;
                }
            });

            // Save two items
            await controller.saveInDB(model1);
            await controller.saveInDB(model2);
            // Url
            const url: string = setup.url || controller.schemaObject.apiPath();

            // Checking token
            const actualAuth: number = (setup.auth || AuthType.token) as number;
            const token: string = this.getToken(actualAuth, setup.token);

            // Expect
            const expectedStatus = setup.expect || 200;

            if (token && token !== '') {
                request(app).get(url)
                .set('Authorization', `Bearer ${token}`)
                .query(filterInfo)
                .expect(expectedStatus)
                .then(async resp => {
                    if (expectedStatus === 200) {
                        await verifySuccessBody(resp.body);
                        const dataAll: any[] = resp.body.data;
                        expect(dataAll.length).to.be.equal(2);
                        const all: any[] = await controller.all();
                        expect(all.length).to.be.greaterThan(2);
                        await Destroyer(controller)(model1);
                        await Destroyer(controller)(model2);
                    } else {
                        await Destroyer(controller)(model1);
                        await Destroyer(controller)(model2);
                        await verifyErrorBody(resp.body);
                    }
                    res();
                })
                .catch(async err => {
                    await Destroyer(controller)(model1);
                    await Destroyer(controller)(model2);
                    rej(err);
                });
            }
        });
    }
}

// ----------------------------------------------------------------
