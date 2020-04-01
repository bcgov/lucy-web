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
import {
    ApplicationTableColumn,
    controllerForSchemaName,
    schemaWithName, BaseSchema,
    TableRelation
} from '../../libs/core-database';
import { userFactory } from './userFactory';
import { unWrap } from '../../libs/utilities';
import { ObjectLiteral } from 'typeorm';

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

export interface FactoryOptions {
    embedded?: boolean;
    isSpecification?: boolean;
    rootSchema?: string;
    schemaChain: string[];
}

export const fetcher = async (input: any, list: any[], options: FactoryOptions = { schemaChain: []}) => {
    // Check
    if (list.length === 0) {
        return input;
    }
    // Get info
    const {key, controller, isCode, fieldMeta} = list.pop();
    if (isCode) {
        input[key] = await CodeTableFactory(controller)();
    } else {
        // Now check field data
        let r: any;
        if (unWrap(fieldMeta.meta, {}).embedded) {
            r = await ModelSpecFactory(controller)(options);
        } else {
            r = await ModelFactory(controller)(options);
        }
        if (r && Object.keys(r).length > 0) {
            input[key] = r;
        } else {
            input[key] = { ...input };
        }
    }

    await fetcher(input, list, options);
};

interface TableRelationInfo {
    relation: TableRelation;
    key: string;
    rootController?: DataController;
}
export const createRelation = async (input: any, list: TableRelationInfo[], options: FactoryOptions = { schemaChain: []}) => {
    if (list.length === 0) {
        return input;
    }
    const info: TableRelationInfo | undefined = list.pop();
    let con;
    if (info && unWrap(info.relation.meta, {}).embedded && (con = controllerForSchemaName(info.relation.schema || ''))) {
        if (info.relation.schema === options.rootSchema) {
            // console.dir(info.relation);
            return input;
        }
        let r: any;
        if (options.isSpecification) {
            r = await ModelSpecFactory(con)(options);
        } else {
            r = await ModelFactory(con)(options);
        }
        if (Object.keys(r).length > 0) {
            input[info.key] = [r];
        } else {
            input[info.key] = { ...input };
        }
    }
    // return input;
    await createRelation(input, list, options);
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
    return async (options: FactoryOptions = { schemaChain: []}, inputData?: any): Promise<any> => {
        if (controller.schemaObject.hasDefaultValues) {
            return CodeTableFactory(controller)((inputData && typeof inputData === 'number') ? inputData : undefined);
        }
        const obj: any = {};
        const fetchList: any[] = [];
        const schemaName: string = controller.schemaObject.className;
        if (options.schemaChain.includes(schemaName)) {
            return obj;
        }
        _.each(controller.schema.columnsDefinition, async (column: ApplicationTableColumn, key: string) => {
            if (key === 'id') {
                return;
            }

            if (obj[key] !== undefined) {
                return;
            }
            const typeInfo: any = column.typeDetails;
            const keyname = key.toLocaleLowerCase();

            // Check any input
            if (inputData && inputData[key]) {
                obj[key] = inputData[key];
                return;
            }

            // Check joint column
            if (column.jointColumnInfo.jointColumnKeys.length > 0 && column.jointColumnInfo.referenceSchema !== '') {
                // Get schema
                const otherRefController: DataController = controllerForSchemaName(column.jointColumnInfo.referenceSchema);
                if (otherRefController) {
                    const refObj = await ModelFactory(otherRefController)({
                        schemaChain: [schemaName]
                    });
                    if (refObj) {
                        const refColumnMapping = column.jointColumnInfo.referenceColumnMapping;
                        for (const refKey of Object.keys(refColumnMapping)) {
                            if (refObj[refKey]) {
                                obj[refColumnMapping[refKey]] = refObj[refKey];
                            }
                        }

                        // Check
                        if (!obj[key]) {
                            // Now Value resolved from joint column info, sending error
                            throw new Error(`ModelSpecFactory: ${schemaName} : joint column info: ${key}: no data`);
                        }
                        return;
                    } else {
                        // Wrong refSchema to create obj
                        throw new Error(`ModelSpecFactory: ${schemaName} : joint column info: ${key}: wrong schema ${column.jointColumnInfo.referenceSchema}: no test obj`);
                    }
                } else {
                     // Wrong refSchema
                     throw new Error(`ModelSpecFactory: ${schemaName} : joint column info: ${key}: wrong schema ${column.jointColumnInfo.referenceSchema}`);
                }
            }

            // Check example values from
            let example: any;
            if (example = controller.schemaObject.example(key)) {
                obj[key] = example;
                return;
            }

            // Generate data
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
                        if (typeInfo.max && typeInfo.min) {
                            obj[key] = faker.random.number({max: typeInfo.max, min: typeInfo.min, precision: typeInfo.precision});
                        } else {
                            obj[key] = faker.random.number();
                        }
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
                    const typeSchemaName = typeInfo.schema;
                    if (typeSchemaName === controller.schemaObject.className || typeSchemaName === options.rootSchema) {
                        break;
                    }
                    // console.log(`${key}: 1: ${schemaName}`);
                    const dbCon: DataController = controllerForSchemaName(typeSchemaName) as DataController;


                    // Get schema
                    const schema: BaseSchema = schemaWithName(schemaName);
                    if (dbCon && schema) {
                        fetchList.push({
                            key: key,
                            controller: dbCon,
                            isCode: schema.hasDefaultValues,
                            fieldMeta: column,
                            isSpec: options.isSpecification,
                            rootSchema: options.rootSchema
                        });
                    }
                    break;
            }
        });

        if (options.isSpecification === undefined) {
            options.isSpecification = true;
        }
        if (!options.rootSchema) {
            options.rootSchema = controller.schemaObject.className;
        }
        options.schemaChain.push(controller.schemaObject.className);
        await fetcher(obj, fetchList,  options);
        const relationList: TableRelationInfo[] = [];
        _.each(controller.schema.relations, (r: TableRelation, k: string) => relationList.push({
            relation: r,
            key: k,
            rootController: controller
        }));
        if (relationList.length > 0) {
            await createRelation(obj, relationList, options);
        }

        // Update options
        if (options && options.schemaChain) {
            const sc: string = options.schemaChain.pop() || '';
            if (sc && sc !== controller.schemaObject.className) {
                console.error(`Wrong Last Element: ${sc}, \n** root: ${options.rootSchema || 'NA'}, \n** chain: ${options.schemaChain}`);
                options.schemaChain.push(sc);
            }
        }
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
    return async (options: FactoryOptions = { schemaChain: []}, inputData?: any): Promise<any> => {
        const schema: BaseSchema = controller.schemaObject;
        if (schema.hasDefaultValues) {
            const obj = inputData !== undefined && typeof inputData === 'number' ? await controller.findById(inputData || 1) : await controller.random();
            return obj;
        }
        const opts: FactoryOptions = Object.assign(options, {
            isSpecification: false,
        });
        const spec = await ModelSpecFactory(controller)(opts, inputData);
        if (Object.keys(spec).length > 0) {
            return await controller.createNewObject(spec, await userFactory());
        } else {
            // console.log(`Get Empty Response for ${controller.schemaObject.className} root: ${options.rootSchema}, chain: ${options.schemaChain}`);
        }
    };
}

export interface RequestOption {
    schema?: BaseSchema;
}

export function RequestFactory<Spec extends {[key: string]: any}>(spec: Spec, options: RequestOption = {}): any {
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
                if (options.schema && options.schema.table.embeddedRelations.includes(key)) {
                    const newOptions: RequestOption = {
                        schema: info.schema
                    };
                    if (obj.constructor === Array) {
                        const array: ObjectLiteral[] = obj as ObjectLiteral[];
                        result[key] = array.map((item) => RequestFactory<ObjectLiteral>(item, newOptions));
                    } else {
                        result[key] = RequestFactory<ObjectLiteral>(spec[key], newOptions);
                    }
                    continue;
                }
                if (info.schema && info.schema.columns.id && typeof obj[info.schema.columns.id] === 'number') {
                    const val = obj[info.schema.columns.id];
                    if (val && typeof val === typeof 1) {
                        result[key] = val;
                    }
                } else {
                    result[key] = spec[key];
                }
            }
        }
    }
    return result;
}
