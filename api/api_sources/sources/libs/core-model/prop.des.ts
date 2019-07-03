
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
import { BaseModel } from '../../database/models';

export class PropertyType {
    static get string(): string {
        return typeof '';
    }

    static get number(): string {
        return typeof 0;
    }

    static get object(): string {
        return typeof {};
    }

    static get func(): string {
        return 'function';
    }

    static get boolean(): string {
        return typeof true;
    }

    static get date(): string {
        return 'string';
    }
}

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
    }
};
export const propertyMap = (obj: Object) => (Object.keys(propMap[obj.constructor.name] || {}))
                                                .concat(Object.keys(propMap[BaseModel.name]));

export const classInfo = (className: string) => ({ ...propMap[className], ...propMap[BaseModel.name]});

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


