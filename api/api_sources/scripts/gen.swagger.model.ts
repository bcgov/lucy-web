//
// Generate Swagger model file def
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
// Created by Pushan Mitra on 2019-07-02.
//
/**
 * Imports
 */
import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'underscore';
import * as yaml from 'js-yaml';
import * as models from '../sources/database/models';
import { classInfo, PropertyType } from '../sources/libs/core-model';
import { BaseModel, Record, ApplicationCode } from '../sources/database/models';

const isModelClass = (typeValue: any) => {
    return (
        typeValue.prototype instanceof BaseModel ||
        typeValue.prototype instanceof Record ||
        typeValue.prototype instanceof ApplicationCode
        );
};

(() => {
    // console.dir(models);
    const map = {};
    for (const key in models) {
        if (models.hasOwnProperty(key) && key !== 'BaseModel') {
            const typeValue = models[key];
            if (typeof typeValue === 'function' && isModelClass(typeValue)) {

                let meta: any = {};
                const yml: any = { type: PropertyType.object, required: [], properties: {}};
                const ymlCreate: any = { type: PropertyType.object, required: [], properties: {}};
                const ymlUpdate: any = { type: PropertyType.object, properties: {}};
                if ( (meta = classInfo(typeValue))) {
                    // console.log(`${typeValue.name}`);
                    // console.dir(meta);
                    _.each(meta, (val: any, k: string) => {
                        // console.log(`${k}`);
                        // console.dir(val);
                        if (k === 'classInfo') {
                            return;
                        }
                        const info: any = val.info || {};
                        if (!info.optional) {
                            yml.required.push(k);
                            ymlCreate.required.push(k);
                        }
                        yml.properties[k] = {
                            type: info.type || 'string'
                        };
                        ymlCreate.properties[k] = {
                            type: (info.type === PropertyType.object ? PropertyType.number : (info.type || 'string'))
                        };
                        ymlUpdate.properties[k] = {
                            type: (info.type === PropertyType.object ? PropertyType.number : (info.type || 'string'))
                        };
                        if (info.ref) {
                            yml.properties[k]['$ref'] = `#/definitions/${info.ref}`;
                        }
                    });
                    map[typeValue.name] = yml;
                    if (meta.classInfo.apiResource) {
                        map[`${typeValue.name}CreateSpec`] = ymlCreate;
                        map[`${typeValue.name}UpdateSpec`] = ymlUpdate;
                    }
                }
            }
        }
    }
    // const final = yaml.safeDump(map);
    //  console.log(`${final}`);

    // Load full swagger file
    const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
    const swaggerWritePath = path.resolve(__dirname, '../swagger.raw.yaml');
    const swagger = yaml.safeLoad(fs.readFileSync(swaggerPath, 'utf8'));
    // console.dir(swagger);
    let existing = {};
    existing = {
        Error: swagger.definitions.Error || {
            required: ['message', 'errors'],
            properties: { message: {type: 'string'}, errors: { type: 'array'}}},
        UserInfo: swagger.definitions.UserInfo || {
            required: ['message', 'data'],
            properties: { message: {type: 'string'}, data: { type: 'object', $ref: '#/definitions/User'}}
        }
    };
    _.each(swagger.definitions, (value: any, key: string) => !map[key] ? (existing[key] = value) : 0);
    swagger.definitions = {...map, ...existing};
    const finalSwagger = yaml.safeDump(swagger);
    // console.dir(`${finalSwagger}`);
    // Write back
    fs.writeFileSync(swaggerWritePath, finalSwagger, {
        flag: 'w',
        encoding: 'utf8'
    });
})();


// ---------------------------------------------------------------
