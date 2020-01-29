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
                result[nextKey] = flatString(value, true);
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

export const flatString = (obj: any, group?: boolean): string => {
    let result = ``;
    if (obj === undefined || obj === null) {
        return '';
    }
    if (typeof obj === 'function') {
        return '';
    }
    if (typeof obj !== 'object') {
        return `${obj}`;
    }
    if (obj.constructor === Array) {
        const array: any[] = obj as any[];
        for (const item of array) {
            const flatStringData = flatString(item, group);
            if (flatStringData) {
                result = result + (group ? `(${flatStringData}),` : `${flatStringData},`);
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
                const fs = flatString(v, group);
                if (fs) {
                    result = result + (group ? `[${fs}],`  : `${fs},`);
                }
            } else  if (v !== undefined) {
                result = result + `${v},`;
            }
        }
    }
    result = result.replace(/.$/, '');
    return result;
};
// ------------------------------
