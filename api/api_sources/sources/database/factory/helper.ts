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
 * File: helper.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 2:55:28 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 12th July 2019 2:55:32 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as _ from 'underscore';
import { DataController} from '../data.model.controller';

/**
 * @description Destroy model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @returns function/closure
 */
export function Destroy<Model, Controller extends DataController>(controller: Controller, beforeRemove?: (obj: Model) => Promise<void>) {
    return async (model: Model) => {
        if (beforeRemove) {
            await beforeRemove(model);
        }
        await controller.remove(model);
    };
}

/**
 * @description Save model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @returns function/closure
 */
export function Save<Model, Controller extends DataController>() {
    return async (model: Model, controller: Controller): Promise<Model> => {
        return await controller.saveInDB(model);
    };
}

/**
 * @description Create and save model object
 * @generic Model data model
 * @generic Controller type of data model controller
 * @param Controller controller
 * @returns function/closure
 */
export function Create<Model, Controller extends DataController>(controller: Controller) {
    return async (fake: (obj: Model) => Promise<void>): Promise<Model> => {
        const model: Model = controller.create();
        // fake
        await fake(model);
        // save
        await Save<Model, Controller>()(model, controller);
        // return
        return model;
    };
}

export function CodeFactory<Model, Controller extends DataController>(controller: Controller) {
    return async (id?: number): Promise<Model> => {
        const obj = id !== undefined ? await controller.findById(id || 1) : await controller.random();
        return obj;
    };
}

export function RequestFactory<Spec extends {[key: string]: any}>(spec: Spec, controller: DataController): any {
    const result = {};
    _.each(spec, (v, k) => {
        if (typeof v === 'object') {
            result[k] = v[controller.schema.id];
        } else {
            result[k] = v;
        }
    });
    return result;
}
