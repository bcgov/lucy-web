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
 * File: helper.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 2:55:28 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 12th July 2019 2:55:32 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as _ from 'underscore';
import * as moment from 'moment';
import * as faker from 'faker';
import { DataController} from '../data.model.controller';
import { getClassInfo } from '../../libs/core-model';
import { ApplicationTableColumn, controllerForSchemaName, schemaWithName, BaseSchema } from '../../libs/core-database';
import { userFactory } from './userFactory';

/**
 * @description Destroy model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @returns function/closure
 */
export function Destroy<Model, Controller extends DataController>(controller: Controller, beforeRemove?: (obj: Model) => Promise<void>) {
    return async (model: Model) => {
        if (beforeRemove) {
            await beforeRemove(model);
        }
        await controller.remove(model);
    };
}

/**
 * @description Save model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @returns function/closure
 */
export function Save<Model, Controller extends DataController>() {
    return async (model: Model, controller: Controller): Promise<Model> => {
        return await controller.saveInDB(model);
    };
}

/**
 * @description Create and save model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @param Controller controller
 * @returns function/closure
 */
export function Create<Model, Controller extends DataController>(controller: Controller) {
    return async (fake: (obj: Model) => Promise<void>): Promise<Model> => {
        const model: Model = controller.create();
        // fake
        await fake(model);
        // save
        await Save<Model, Controller>()(model, controller);
        // return
        return model;
    };
}

export function CodeFactory<Model, Controller extends DataController>(controller: Controller) {
    return async (id?: number): Promise<Model> => {
        const obj = id !== undefined ? await controller.findById(id || 1) : await controller.random();
        return obj;
    };
}

export function CodeTableFactory(controller: DataController) {
    return async (id?: number): Promise<any> => {
        const obj = id !== undefined ? await controller.findById(id || 1) : await controller.random();
        return obj;
    };
}

export const fetcher = async (input: any, list: any[]) => {
    // Check
    if (list.length === 0) {
        return input;
    }
    // Get info
    const {key, controller, isCode} = list.pop();
    if (isCode) {
        input[key] = await CodeTableFactory(controller)();
    } else {
        input[key] = await ModelFactory(controller)();
    }

    await fetcher(input, list);
};

export const deleteObjects = async (list: any[]) => {
    if (list.length === 0) {
        return;
    }
    const { object, controller} = list.pop();
    await controller.remove(object);

    await deleteObjects(list);
};

export function ModelSpecFactory(controller: DataController, dependency?: any[]) {
    return async (): Promise<any> => {
        const obj: any = {};
        const fetchList: any[] = [];
        // console.log(`${controller.constructor.name}: `);
        _.each(controller.schema.columnsDefinition, async (column: ApplicationTableColumn, key: string) => {
            if (key === 'id') {
                return;
            }
            const typeInfo: any = column.typeDetails;
            const keyname = key.toLocaleLowerCase();
            switch  (typeInfo.type) {
                case 'string':
                    if (typeInfo.isDate) {
                        obj[key] = `${moment(faker.date.recent()).format('YYYY-MM-DD')}`;
                    } else if (typeInfo.isTimestamp) {
                        obj[key] = `${moment(faker.date.recent()).format('YYYY-MM-DD hh:mm:ss')}`;
                    } else {
                        // console.log(`${key}:${JSON.stringify(typeInfo)}`);
                        if (keyname.includes('firstname')) {
                            obj[key] = faker.name.firstName();
                        } else if (keyname.includes('lastname')) {
                            obj[key] = faker.name.lastName();
                        } else if (keyname.includes('description') || keyname.includes('comment')) {
                            obj[key] = faker.random.word();
                        } else if (keyname.includes('phone') || keyname.includes('mobile')) {
                            obj[key] = faker.phone.phoneNumber();
                        } else {
                            obj[key] = faker.random.alphaNumeric(typeInfo.size - 1);
                        }
                    }
                    break;
                case 'number':
                    if (typeInfo.subType === 'int') {
                        obj[key] = Math.floor((Math.random() * 255) + 1);
                    } else if (keyname.includes('latitude') || keyname.includes('lat')) {
                        obj[key] = parseFloat(faker.address.latitude());
                    } else if (keyname.includes('longitude') || keyname.includes('long') || keyname.includes('lon')) {
                        obj[key] = parseFloat(faker.address.longitude());
                    } else {
                        obj[key] = faker.random.number();
                    }
                    break;
                case 'boolean':
                    obj[key] = faker.random.boolean();
                    break;
                case 'object':
                    // Check type is jsonb or not
                    if (typeInfo.subType === 'json') {
                        obj[key] = {
                            test: faker.random.word()
                        };
                        break;
                    }
                    // Get schema name
                    const schemaName = typeInfo.schema;
                    // console.log(`${key}: 1: ${schemaName}`);
                    const dbCon: DataController = controllerForSchemaName(schemaName) as DataController;
                    // Get schema
                    const schema: BaseSchema = schemaWithName(schemaName);
                    if (dbCon && schema) {
                        fetchList.push({
                            key: key,
                            controller: dbCon,
                            isCode: schema.hasDefaultValues
                        });
                    }
                    break;
            }
        });
        await fetcher(obj, fetchList);
        return obj;
    };
}

export function Destroyer(controller: DataController) {
    return async (item: any, skipObj?: boolean): Promise<void> => {
        const delList: any[] = [];
        _.each(controller.schema.columnsDefinition, async (column, key) => {
            if (key === 'id') {
                return;
            }
            const typeInfo: any = column.typeDetails;
            if (typeInfo === 'object' && item[key]) {
                if (typeInfo.subType === 'json') {
                    return;
                }
                const schemaName = typeInfo.schema;
                // console.log(`${key}: 1: ${schemaName}`);
                const dbCon: DataController = controllerForSchemaName(schemaName) as DataController;
                // Get schema
                const schema: BaseSchema = schemaWithName(schemaName);
                if (!schema.hasDefaultValues) {
                    delList.push({
                        key: key,
                        object: item[key],
                        controller: dbCon
                    });
                }
            }
        });
        await deleteObjects(delList);
        if (skipObj) {
            return;
        }
        await controller.remove(item);
    };
}

export function ModelFactory(controller: DataController) {
    return async (): Promise<any> => {
        const spec = await ModelSpecFactory(controller)();
        // console.dir(spec);
        return await controller.createNewObject(spec, await userFactory());
    };
}

export function RequestFactory<Spec extends {[key: string]: any}>(spec: Spec): any {
    const result: any = {};
    for (const key in spec) {
        if (spec.hasOwnProperty(key)) {
            const type = typeof spec[key];
            if (type === 'undefined') {
                continue;
            }
            if (type === typeof 1.1 || type === typeof 's' || type === typeof false) {
                result[key] = spec[key];
            } else if (type === 'object') {
                const obj: any = spec[key];
                const info: any = getClassInfo(obj.constructor.name) || {};
                if (info.schema && info.schema.columns.id && typeof obj[info.schema.columns.id] === 'number') {
                    const val = obj[info.schema.columns.id];
                    if (val && typeof val === typeof 1) {
                        result[key] = val;
                    }
                }
            }
        }
    }
    return result;
}
