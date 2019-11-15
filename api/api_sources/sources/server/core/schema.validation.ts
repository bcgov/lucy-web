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
 * File: schema.validation.ts
 * Project: lucy
 * File Created: Friday, 15th November 2019 9:53:04 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 15th November 2019 9:55:49 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as assert from 'assert';
import * as _ from 'underscore';
import * as moment from 'moment';
import { DataFieldDefinition, controllerForSchemaName, BaseSchema } from '../../libs/core-database';
import { ValidatorCheck, ValidatorExists, ValidationInfo} from './core.validator';
import { DataController} from '../../database/data.model.controller';
import { Logger } from '../logger';

export class SchemaValidator {
    /**
     * Shared instance
     */
    static _instance: SchemaValidator;
    static get shared(): SchemaValidator {
        return this._instance || ( this._instance = new this());
    }

    // Logger
    logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    validators(schema: BaseSchema, filterOnly?: boolean): any[] {
        return this._fieldValidator(schema.table.columnsDefinition, filterOnly);
    }

    private _fieldValidator(fields: {[key: string]: DataFieldDefinition}, filterOnly?: boolean): any[] {
        let validatorCheck = {};
        let validatorExists = {};
        _.each(fields, (field: DataFieldDefinition, key: string) => {
            if (key === 'id') {
                return;
            }
            const typeInfo: any = field.typeDetails;
            const validateKey: {[key: string]: ValidationInfo} = {};
            const validateExists: {[key: string]: DataController} = {};
            switch  (typeInfo.type) {
                case 'string':
                    if (typeInfo.isDate) {
                        validateKey[key] = {
                            validate: validate => validate.isString().custom(async (val: string, {req}) => {
                                assert(moment(val, 'YYYY-MM-DD').isValid(), `${key}: should be string in YYYY-MM-DD format`);
                            }),
                            message: 'should be string in YYYY-MM-DD format',
                            optional: !field.required
                        };
                    } else if (typeInfo.isTimestamp) {
                        validateKey[key] = {
                            validate: validate => validate.isString().custom(async (val: string, {req}) => {
                                assert(moment(val, 'YYYY-MM-DD hh:mm:ss').isValid(), `${key}: should be string in YYYY-MM-DD hh:mm:ss format`);
                            }),
                            message: 'should be string in YYYY-MM-DD format',
                            optional: !field.required
                        };
                    } else {
                        validateKey[key] = {
                            validate: validate => validate.isString().custom(async (value: string, {req}) => {
                                // 1. Check Size
                                assert(value, `${key}: Value must be defined`);
                                assert(value.length < typeInfo.size, `${key}: Exceed maximum size ${typeInfo.size}`);
                                // 2. Regx check
                                const verification = field.fieldVerification() || {};
                                if (verification.regx) {
                                    const regx = new RegExp(verification.regx.re, verification.regx.flag || 'gm');
                                    assert(value.match(regx), `${key}: should match regx: ${regx}`);
                                }
                            }),
                            message: 'should be string',
                            optional: !field.required
                        };
                    }
                    break;
                case 'number':
                    validateKey[key] = {
                        validate: validate => validate.isNumeric(),
                        message: 'should be number',
                        optional: !field.required
                    };
                    break;
                case 'boolean':
                    validateKey[key] = {
                        validate: validate => validate.isBoolean(),
                        message: 'should be boolean',
                        optional: !field.required
                    };
                    break;
                case 'object':
                    // Check Filter only or not
                    if (filterOnly) {
                        break;
                    }

                    // Check json type or not
                    if (typeInfo.subType === 'json') {
                        validateKey[key] = {
                            validate: validate => validate.custom(async (value: any, {req}) => {
                                // Check json or not
                                assert(value, `${key}: should be json`);
                                assert(typeof value === typeof {}, `${key}: should be json, received ${typeof value}`);
                                // TODO: Add logic to verify json-schema
                            }),
                            message: 'should be json',
                            optional: !field.required
                        };
                        break;
                    }

                    // Get schema name
                    const schemaName = typeInfo.schema;
                    // console.log(`${key}: 1: ${schemaName}`);
                    const controller = controllerForSchemaName(schemaName);
                    if (controller) {
                        // console.log(`${key}: 2`);
                        validateExists[key] = controller;
                    } else {
                        validateKey[key] = {
                            validate: validate => validate.isInt().custom(async (val: number, {req}) => {
                                const con = controllerForSchemaName(schemaName);
                                if (con) {
                                    const item = await con.findById(val);
                                    assert(item, `${key}: Item not exists with id: ${val}`);
                                    if (!req.body) {
                                        req.body = {};
                                    }
                                    req.body[key] = item;
                                }
                            }),
                            optional: !field.required
                        };
                    }
                    break;
            }
            validatorCheck = {...validatorCheck, ...validateKey};
            validatorExists = {...validatorExists, ...validateExists};
        });
        // console.dir(validatorExists);
        if (filterOnly) {
            return ValidatorCheck(validatorCheck);
        }
        return ValidatorExists(validatorExists).concat(ValidatorCheck(validatorCheck));
    }

}
