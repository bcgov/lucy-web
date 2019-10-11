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
 * File: cls.des.ts
 * Project: lucy
 * File Created: Thursday, 8th August 2019 3:14:17 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 8th August 2019 3:23:46 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import 'reflect-metadata';

/**
 * @description Global storage
 */
const classInfoStorage = {};

/**
 * @description Class Type
 */
export enum ClassType {
    model = 0,
    router = 1,
    lib = 2,
}

/**
 * @description Class information
 */
export interface ClassInfo {
    description?: string;
    schema?: any;
    parent?: Function;
    other?: any;
    apiResource?: boolean;
}

/**
 * @description Decorator to provide for run time info of class
 * @param ClassInfo info: Information of class
 */
export function ModelDescription(info: ClassInfo) {
    return function (target: Function) {
        classInfoStorage[target.name] = info;
        target.prototype.getClassInfo = () => {
            return classInfoStorage[target.name];
        };
    };
}

export function getClassInfo(cls: Function | string) {
    let name;
    if (typeof cls === 'string') {
        name = cls;
    } else {
        name = cls.name;
    }
    return classInfoStorage[name];
}

// ---------------------------------------------------------------
