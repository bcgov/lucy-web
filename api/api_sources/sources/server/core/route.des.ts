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
 * File: route.des.ts
 * Project: lucy
 * File Created: Friday, 9th August 2019 12:17:35 pm
 * Author: pushan
 * -----
 * Last Modified: Friday, 9th August 2019 12:17:47 pm
 * Modified By: pushan
 * -----
 */
import 'reflect-metadata';
import { RouteDescription, RouteConfig } from './base.route.controller';

const StaticConfig: {[key: string]: RouteConfig[]} = {};

export function Route (des: RouteDescription) {
    return function<T>(obj: Object, prop: string, propDes?: PropertyDescriptor) {
        const existing: RouteConfig[] = StaticConfig[obj.constructor.name] || [];
        existing.push({description: des, handler: prop});
        StaticConfig[obj.constructor.name] = existing;
    };
}

export const getRouteConfigs = (cls: any | string) => {
    const key = typeof cls === 'string' ? cls : cls.constructor.name;
    return StaticConfig[key];
};

export const getAllRouteConfig = () => StaticConfig;

//  --------------------------------------------------------
