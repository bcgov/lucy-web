//
// Utility methods
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
// Created by Pushan Mitra on 2019-05-21.

/**
 * Imports
 */
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'underscore';
import * as yml from 'js-yaml';
import * as assert from 'assert';

/**
 * @description AsyncFor
 * @param number count
 * @param closure callback
 */
export const asyncFor = async (count: number, callback: any): Promise<any> =>  {
    if (typeof callback === 'function') {
        for (let i = 0; i < count; i++) {
            await callback(i);
        }
    } else {
        return;
    }
};

/**
 * @description Async sleep method with given time in sec
 * @param number time
 * @returns Promise<any>
 */
export const sleep = async (time: number): Promise<any> => {
    return new Promise(res => setTimeout(res, time));
};

/**
 * @description Action Closure type definition
 */
export type action = () => any;

/**
 * @description Unwrap object or return default
 * @param any value
 * @param any defaultValue
 * @returns any
 */
export const unWrap = (value?: any, defaultValue?: any): any => {
    return value !== undefined ? value : defaultValue;
};

/**
 * @description Unwrap object or return default
 * @param any value
 * @param T defaultValue
 * @returns T
 */
export function unWrapType<T> (value: any, defaultValue: T): T  {
    return value !== undefined ? (value as T) : defaultValue;
}

/**
 * @description Load json from yaml file
 * @param string yamlPath Path of yml file
 * @returns any
 */
export const yaml = (yamlPath: string): any => {
    return yml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
};

/**
 * @description Save Yaml file in given path
 * @param any data
 * @param string savePath
 * @param yml.DumpOptions options
 */
export const saveYaml = (data: any, savePath: string, options?: yml.DumpOptions): any => {
    const result = yml.safeDump(data, options);
    fs.writeFileSync(savePath, result, {
        flag: 'w',
        encoding: 'utf8'
    });
};

/**
 * @description Convert any array to comma separated string values
 * @param any[] array
 * @returns string
 */
export const arrayToString = (array: any[], sep?: string) => {
    let result = '';
    _.each(array, (v: any) => (result = result + `${v}${sep || ','}`));
    result = result.replace(/.$/, '');
    return result;
};

/**
 * @description Verify that key is present in object
 * @param any obj
 * @param any[] keys
 * @param string tag
 * @returns object
 */
export const verifyObject = (obj: any, keys: any[], tag: string) => {
    assert(obj, `${tag}: Object is undefined`);
    _.each(keys, (k: any) => assert(Object.keys(obj).includes(k) === true, `${tag}: key not available: ${k} for obj ${JSON.stringify(obj)}`));
    return obj;
};

/**
 * @description [Create] and Return temp storage dir of application
 * @returns string
 */
export const applicationTemFileDir = () => {
    const dirPath = path.resolve(__dirname, '../../../.temp');
    if (fs.existsSync(dirPath)) {
        return dirPath;
    } else {
        fs.mkdirSync(dirPath);
        return dirPath;
    }
};

/**
 * @description Return a new file name by attaching marker with that. Ex x.ext => x-Marker.ext
 * @param string fileName
 * @param number marker
 * @returns string
 */
export const incrementalFileName = (fileName: string, marker?: number) => {
    const components = fileName.split('.');
    const ext = components[components.length - 1];
    const fileNameWithoutExt = fileName.split(`.${ext}`)[0];
    return `${fileNameWithoutExt}-${ marker ||  Date.now()}.${ext}`;
};

/**
 * @description This method check any item exists on path or not if exists then write in a new
 *              path with timestamp mark on it.
 * @param string filePath
 * @param any data
 * @returns string new file path
 */
export const incrementalWrite = (filePath: string, data: any) => {
    if (fs.existsSync(filePath)) {
        const fileName = path.basename(filePath);
        const newFileName = incrementalFileName(fileName);
        const dirPath = filePath.split(fileName)[0];
        const newFilePath = `${dirPath}${newFileName}`;
        fs.writeFileSync(newFilePath, data, {
            flag: 'w',
            encoding: 'utf8'
        });
        return newFilePath;
    } else {
        fs.writeFileSync(filePath, data, {
            flag: 'w',
            encoding: 'utf8'
        });
        return filePath;
    }
};

/**
 * @description Write into provided file path if nothing exists on path
 * @param string filePath: File path to write back
 * @param any data: Data object to write
 */
export const writeIfNotExists = (filePath: string, data: any) => {
    if (fs.existsSync(filePath)) {
        return null;
    }
    fs.writeFileSync(filePath, data, { flag: 'w', encoding: 'utf8'});
    return filePath;
};

/**
 * @description Reverse Capitalize any given string
 * @param any s: Input string
 */
export const reverseCapitalize = (s: any) => {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toLocaleLowerCase() + s.slice(1);
};

/**
 * @description Return capitalize string of any given string
 * @param string s
 */
export const capitalize = (s: any): string => {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * @description Check status of value and return if defined or return default
 * @param any value
 * @param any defaultValue
 * @returns any
 */
export const ifDefined = (value: any, defaultValue: any) => {
    return value !== undefined ? value : defaultValue;
};

/**
 * @description Set Null to object
 * @param any obj
 * @param string key
 */
export function setNull<T> (obj: T, key: keyof T) { (obj[key as string] = null); }

/**
 * @description Check any object is empty or not
 * @param any obj : any object
 */
export const isEmpty = (obj: any) => (obj !== undefined && Object.keys(obj).length === 0);

/**
 * @description Iterate through input object with keys mentioned in key path and fetch values
 * @param any obj: Input object
 * @param string keyPath: keyPath separated by '.'
 */
export const valueAtKeyPath = (obj: any, keyPath: string) => {
    const getValue = (o: any, ks: string[]): any => {
        if (o === undefined) {
            return;
        }
        const k = ks.shift() || '';
        if (ks.length === 0) {
            return o[k];
        } else {
            return getValue(o[k], ks);
        }
    };

    const keys: string[] = keyPath.split('.');
    return getValue(obj, keys);
};

/**
 * @description This function copy a key of the source object to same key of destination object and if set of subKeys supplied then only coy subKeys.
 * @param string key: key of the source object
 * @param any source: source object
 * @param any destination: Destination object
 * @param string[] keys: array of sub keys with key object of the source
 */
export const copyKeyAndSubKeys = (key: string, source: any, destination: any, subKeys?: string[]) => {
    // Check main key exists in destination
    if (!destination[key]) {
        return;
    }
    // Copy Obj
    let copy = {};
    if (subKeys && subKeys.length > 0) {
        // Copy keys only
        for (const k of subKeys) {
            if (k !== 'id' && source[key][k]) {
                copy[k] = source[key][k];
            }
        }
    } else {
        // Copy enter object
        const all: any = { ...source[key] };
        if (all.id) {
            delete all.id;
        }
        copy = { ...all };
    }

    // Now update destinations key
    destination[key] = { ...(destination[key] || {}), ...copy };
};

/**
 * @description Create a query string from input object
 * @param object input
 */
export const getHTTPReqQueryString = (input: {[key: string]: any}) => {
    let result = '';
    _.each(input, (val: any, k: string) => {
        result = result + `${encodeURIComponent(k)}=${encodeURIComponent(val)}&`;
    });
    result = result.slice(0, -1);
    return `?${result}`;
};

export const Key = (input: {[key: string]: any}): string => {
    if (Object.keys(input).length > 0) {
        return Object.keys(input)[0];
    } else {
        return '';
    }
};

/**
 * @description Select a random key or index for given input
 * @param any input
 */
export const RandomizeSelection = (input: any) => {
    if (input.constructor === Array) {
        // Array input
        const array: any[] = input as any[];
        const count = array.length;
        if  (count > 0) {
            if (count === 1) {
                return array[0];
            }
            const randomIndex = Math.floor((Math.random() * count));
            if (randomIndex >= 0 && randomIndex < count) {
                return array[randomIndex];
            }
        }
        return;
    } else if (typeof input === 'object') {
        // Object index
        // Get all keys
        const keys: any[] = Object.keys(input);
        const randomIndex = Math.floor((Math.random() * keys.length));
        if (randomIndex >= 0 && randomIndex < keys.length) {
            const randomKey = keys[randomIndex];
            return {
                key: randomKey,
                value: input[randomKey]
            };
        }
    }
};

// -------------------------------
