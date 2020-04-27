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
 * File: json.utility.ts
 * Project: lucy
 * File Created: Monday, 29th Jan 2020 11:05:18 am
 * Author: Pushan
 * -----
 * Last Modified: Monday, 27th April 2020 7:57:29 pm
 * Modified By: Pushan
 * -----
 */

import { capitalize } from './helpers.utilities';

/**
 * Utility class for json or object
 */
export const prettyJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
};

export const flatJSON = (obj: any, rootKey?: string): any => {
    let result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function') {
            // Check type is array or not
            const value: any = obj[key];
            const nextKey = rootKey ? `${rootKey}.${key}` : key;
            if (value === undefined) {
                continue;
            }
            if (value === null) {
                result[nextKey] = null;
                continue;
            }
            if (value.constructor === Array) {
                result[nextKey] = formattedArrayCSV(value as any[]);
                continue;
            }
            if (typeof value === 'object') {
                result = { ...result, ...flatJSON(value, nextKey)};
            } else {
                result[nextKey] = value;
            }
        }
    }
    return result;
};

export const flatString = (obj: any, tab: string = '',  group?: boolean): string => {
    let result = ``;
    if (obj === undefined || obj === null) {
        return '';
    }
    if (typeof obj === 'function') {
        return '';
    }
    if (typeof obj !== 'object') {
        return `${tab}${obj}`;
    }
    if (obj.constructor === Array) {
        const array: any[] = obj as any[];
        for (const item of array) {
            const flatStringData = flatString(item, tab , group);
            if (flatStringData) {
                result = result + (group ? `${tab}(${flatStringData}),` : `${tab}${flatStringData},`);
            }
        }
        result = result.replace(/.$/, '');
        return result;
    }
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function') {
            const v: any = obj[key];
            if (typeof v === 'object') {
                // Get flat string
                const fs = flatString(v, tab, group);
                if (fs) {
                    result = result + (group ? `${tab}[${fs}],`  : `${tab}${fs},`);
                }
            } else  if (v !== undefined) {
                result = result + `${tab}${v},`;
            }
        }
    }
    result = result.replace(/.$/, '');
    return result;
};

/**
 * @description Convert any array to csv string
 * @param any[] array: Input Array
 */
export const flatArrayCSV = (array: any[]): string => {
    // Checking length
    if (array.length > 0 ) {
        // Constructing header
        const firstObject = array[0];
        const header = Object.keys(firstObject).reduce( (acc , key) => {
            if (!acc) {
                return `${key}`;
            } else {
                return `${acc},${key}`;
            }
        }, '');
        // Constructing Body
        const body = array.reduce((acc, value) => {
            if (!acc) {
                return flatString(value);
            } else {
                return `${acc}\n${flatString(value)}`;
            }
        }, '');
        // Constructing final csv
        return `${header}\n${body}`;

    }
    return '';
};

export const formattedArrayCSV = (data: any[]) => {
    // Get header info
    const headersInfo: any = getHeaderInfo(data);
    const headers: string[] = Object.keys(headersInfo);
    if (headers.length === 0) {
        return '';
    }
    let finalCsvString = '';
    // Create header string
    const header = headers.reduce((acc, key: string) => {
        const info = headersInfo[key];
        const maxColumnLength = info.maxColumnLength || key.length;
        const formattedKey = maxColumnLength !== key.length ? key.padEnd(maxColumnLength, ' ') : key;
        const result = acc ? `${acc}, ${capitalize(formattedKey)}` : capitalize(formattedKey);
        return result;
    }, '');

    // Create body
    const body = data.reduce((acc, item) => {
        let lineItem = ``;
        for (const headerKey of headers) {
            const value = item[headerKey] || 'NA';
            const valueString = `${value}`;
            const info = headersInfo[headerKey] || {};
            const maxColumnLength = info.maxColumnLength || header.length;
            const formattedString = valueString.padEnd(maxColumnLength, ' ');
            lineItem = lineItem ? `${lineItem}, ${formattedString}` : formattedString;
        }
        const result = acc ? `${acc}\n${lineItem}` : lineItem;
        return result;
    }, '');

    // Final String
    finalCsvString = `${header}\n${body}`;
    return finalCsvString;

};

/**
 * @description Create map of distinct header/property element of the array objects
 * @param any[] array: Input data
 * @returns object
 */
export const getHeaderInfo = (array: any[]): any => {
    // Process all headers
    const headerInfoObj: any = {};

    // Gathering header information
    for (const item of array) {
        // Check item is object type or not
        if ( typeof item !== 'object') {
            continue;
        }

        // Check item is non array and non null
        if (item.constructor === Array || item === null) {
            continue;
        }
        // Now Process each item
        const offset = 4;
        for (const prop of Object.keys(item)) {
            const value = item[prop];
            const type = typeof value;
            // Ignoring any non value type object
            if (type === 'object' || type === 'function' || type === 'undefined') {
                continue;
            }
            let valueRep = `${value}`;
            if (value === null) {
                valueRep = 'NA';
            }
            // Check existing header info
            const info = headerInfoObj[prop] || { maxColumnLength: (prop.length + offset) };

            // Checking max length element for respective header
            if (info.maxColumnLength < (valueRep.length + offset)) {
                info.maxColumnLength = (valueRep.length + offset);
            }
            headerInfoObj[prop] = info;
        }
    }
    return headerInfoObj;
};
// ------------------------------
