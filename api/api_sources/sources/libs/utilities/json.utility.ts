/**
 * Utility class for json or object
 */
export const prettyJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
};

export const flatJSON = (obj: any, rootKey?: string): any => {
    let result = {};
    for (const k in obj) {
        if (obj.hasOwnProperty(k) && typeof obj[k] !== 'function') {
            // Check type is array or not
            const v: any = obj[k];
            const nextKey = rootKey ? `${rootKey}.${k}` : k;
            if (v === undefined) {
                continue;
            }
            if (v === null) {
                result[nextKey] = null;
                continue;
            }
            if (v.constructor === Array) {
                result[nextKey] = flatString(v, true);
                continue;
            }
            if (typeof v === 'object') {
                result = { ...result, ...flatJSON(v, nextKey)};
            } else {
                result[nextKey] = v;
            }
        }
    }
    return result;
};

export const flatString = (obj: any, group?: boolean): string => {
    let r = ``;
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
        const a: any[] = obj as any[];
        for (const item of a) {
            const fs = flatString(item, group);
            if (fs) {
                r = r + (group ? `(${fs}),` : `${fs},`);
            }
        }
        r = r.replace(/.$/, '');
        return r;
    }
    for (const k in obj) {
        if (obj.hasOwnProperty(k) && typeof obj[k] !== 'function') {
            const v: any = obj[k];
            if (typeof v === 'object') {
                // Get flat string
                const fs = flatString(v, group);
                if (fs) {
                    r = r + (group ? `[${fs}],`  : `${fs},`);
                }
            } else  if (v !== undefined) {
                r = r + `${v},`;
            }
        }
    }
    r = r.replace(/.$/, '');
    return r;
};
// ------------------------------
