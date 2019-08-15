
//
// Core Data Model Functionality
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import 'reflect-metadata';
import { BaseModel, ApplicationCode } from '../../database/models';
import { getClassInfo, ClassInfo } from './cls.des';
import { PropertyType } from './const';


/**
 * Global propMap
 * @description Static object to hold properties of classes with base model
 */
const propMap: any = {
    BaseModel: {
        updateAt: {
            info: { type: PropertyType.string}
        },
        createdAt: {
            info: { type: PropertyType.string}
        }
    },
    ApplicationCode: {
        description: {
            info: { type: PropertyType.string }
        },
        activeIndicator: {
            info: { type: PropertyType.boolean }
        }
    }
};

/**
 * @description Get property info of any object
 * @param object obj
 */
export const propertyMap = (obj: object) => (Object.keys(propMap[obj.constructor.name] || {}))
                                                .concat(Object.keys(propMap[BaseModel.name]));
/**
 * @description Getting class info of any class with name
 * @param any typeObject
 */
// export const classInfo = (className: string) => ({ ...propMap[className], ...propMap[BaseModel.name]});
export const classInfo = (typeValue: any) => {
    let result: any = {};
    if (typeValue.prototype instanceof ApplicationCode) {
        result = { ...propMap[ApplicationCode.name]};
    }
    const info: ClassInfo = getClassInfo(typeValue);
    let more: any = {};
    if (info && info.parent) {
        more = { ...classInfo(info.parent)};
        more.classInfo = undefined;
    }
    return { ...propMap[typeValue.name], ...result, ...propMap[BaseModel.name], ...more, classInfo: info || {}};
};

/**
 * @description Decorator to collect defined property of class
 * @param any info
 */
export function ModelProperty (info?: any) {
    return function (obj: Object, prop: string, propDes?: PropertyDescriptor) {
        try {
            // console.log(`Call ===== ${obj.constructor.name} ==> ${prop} => ${JSON.stringify(propDes)}`);
            if (propMap[obj.constructor.name]) {
                propMap[obj.constructor.name][prop] = { des: (propDes || {}), info: (info || {})} || {};
            } else {
                const proInfo = {};
                proInfo[`${prop}`] = { des: (propDes || {}), info: (info || {})} || {};
                propMap[obj.constructor.name] = proInfo;
            }
        } catch (excp) {
            console.error(`Error While processing data: ${prop}`);
        }
    };
}


