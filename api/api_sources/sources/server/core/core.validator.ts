/**
 * Imports
 */
import { check, ValidationChain } from 'express-validator';
import * as assert from 'assert';
import * as _ from 'underscore';
import { DataController} from '../../database/data.model.controller';
import { Logger } from '../logger';

/**
 * @description Convert any validator chain to optional one
 * @param closure validators : Closure which return array of validator
 */
export const MakeOptionalValidator = (validators: (() => any[])) => _.map(validators(), checkVal => checkVal.optional());

export function idValidator<Controller extends DataController>(fieldName: string, controller: Controller, handle: (data: any, req: any) => Promise<void>) {
    return check(fieldName).isInt().custom(async (value: number, {req}) => {
        const data = await controller.findById(value);
        assert(data, `${fieldName}: No such item exists with id: ${value}`);
        req[fieldName] = data;
        await handle(data, req);
    });
}

/**
 * @description Create Validator to check item exists on db or not
 * @param any[] items: check input array with key in req and dataController to verify
 * @returns any[]
 */
export const ValidatorExists = (items: {[key: string]: DataController}): any[] => {
    const result: any[] = [];
    _.each(items, (con: DataController, key: string) => {
        result.push(check(key).isInt().custom(async (val: number, {req}) => {
            const item = await con.findById(val);
            assert(item, `${key}: Item not exists with id: ${val}`);
            if (!req.body) {
                req.body = {};
            }
            req.body[key] = item;
        }));
    });
    return result;
};

/**
 * @description express-validator validation chain object
 */
export type Validate = (chain: ValidationChain) => ValidationChain;

/**
 * @description Validation object
 */
export interface ValidationInfo {
    message?: string;
    validate: Validate;
    optional?: boolean;
}

const getValidator = (key: string, info: ValidationInfo, logger?: Logger): ValidationChain => {
    let item: ValidationChain;
    if (info.optional !== undefined && info.optional === true) {
        item = info.validate(check(key)).optional().withMessage(`${key}: ${ info.message || 'Invalid variable'}`);
    } else {
        item = info.validate(check(key)).withMessage(`${key}: ${ info.message || 'Invalid variable'}`);
    }
    if (logger) {
        logger.info(`Validator[${key}] => optional: ${info.optional}`);
    }
    return item;
};

/**
 * @description Create array of check validators
 * @param object query: Fields with verify function
 * @returns any[]: Array of check validators
 */
export const ValidatorCheck = (query: {[key: string]: ValidationInfo}, rootKey?: string, logger?: Logger) => {
    const result: any[] = [];
    _.each(query, ( info: ValidationInfo, key) => {
        try {
            const finalKey = rootKey ? `${rootKey}.${key}` : key;
            result.push(getValidator(finalKey, info, logger));
        } catch (excp) {
            throw new Error(`ValidatorCheck: ${key} error: ${excp} \n ${JSON.stringify(info, null, 2)}`);
        }
    });
    return result;
};

/**
 * @description Add array of validators
 * @param string arrayKey: Key of array element in request
 * @param object query: Custom validation logic
 */
export const ObjectValidatorCheck = (objectKey: string, query: {[key: string]: ValidationInfo}, isArray: boolean) => {
    const result: any[] = [];
    if (objectKey && Object.keys(query).length > 0) {
        _.each(query, ( info: ValidationInfo, key) => {
            const checkKey = isArray ? `${objectKey}.*.${key}` : `${objectKey}.${key}`;
            try {
                result.push(getValidator(checkKey, info));
            } catch (excp) {
                throw new Error(`ArrayValidatorCheck: ${key} error: ${excp} \n ${JSON.stringify(info, null, 2)}`);
            }
        });
    }
    return result;
};

// -----------------------------------------
