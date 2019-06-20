/** 
 * Utility methods
*/
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

export const sleep = async (time: number): Promise<any> => {
    return new Promise(res => setTimeout(res, time));
};

export type action = () => any;

export const unWrap = (value?: any, defaultValue?: any): any => {
    return value !== undefined ? value : defaultValue;
};

// -------------------------------
