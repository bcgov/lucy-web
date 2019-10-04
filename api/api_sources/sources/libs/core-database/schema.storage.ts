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
 * File: schema.storage.ts
 * Project: lucy
 * File Created: Wednesday, 11th September 2019 11:32:44 am
 * Author: pushan
 * -----
 * Last Modified: Wednesday, 11th September 2019 11:32:57 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import { BaseSchema } from './baseSchema';

/**
 * @description Global Storage Map for schema Structure
 */
const _tableSchemaMap: {[key: string]: string} = {};
const _modelSchemaMap: {[key: string]: string} = {};
const _schemaMap: {[key: string]: any} = {};
const _schemaDataModelControllerMap: {[key: string]: any} = {};

export const registerSchema = (schema: BaseSchema) => {
    const tableName = schema.table.name;
    const modelName = schema.modelName;
    _tableSchemaMap[tableName] = schema.className;
    _modelSchemaMap[modelName] = schema.className;
    _schemaMap[schema.className] = schema;
};

export const registerDataModelController = (schema: any, controller: any) => {
    _schemaDataModelControllerMap[schema.name] = controller;
};

export const schemaWithName = (name: string) => {
    return _schemaMap[name];
};

export const schemaForTable = (table: string) => {
    const schemaName = _tableSchemaMap[table] || '';
    return _schemaMap[schemaName];
};

export const schemaForModel = (model: string ) => {
    const schemaName = _modelSchemaMap[model] || '';
    return _schemaMap[schemaName];
};

export const schemaForModelClass = (model: any) => {
    const modelName = model.constructor.name;
    const schemaName = _modelSchemaMap[modelName] || '';
    return _schemaMap[schemaName];
};

export const controllerForSchemaName = (schemaName: string) => {
    // console.dir(_schemaDataModelControllerMap);
    return _schemaDataModelControllerMap[schemaName];
};

// ------------------------------------------------------------
