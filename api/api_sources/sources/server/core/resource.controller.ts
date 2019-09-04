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
 * File: resource.controller.ts
 * Project: lucy
 * File Created: Monday, 26th August 2019 9:36:06 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 26th August 2019 9:36:12 am
 * Modified By: pushan
 * -----
 */
import * as assert from 'assert';
import { Request } from 'express';
import { DataController} from '../../database/data.model.controller';
import {
    BaseRoutController,
    RouteHandler,
    MakeOptionalValidator
} from './base.route.controller';
import { ResourceInfo } from './route.const';
import { roleAuthenticationMiddleware } from './auth.middleware';


export class ResourceRouteController<D extends DataController, CreateSpec, UpdateSpec> extends BaseRoutController<D> {
    constructor() {
        super();
        if (this.constructor.prototype._routeResourceInfo) {
            // Getting resource info
            // console.dir(this.constructor.prototype._routeResourceInfo);
            const info: ResourceInfo = this.constructor.prototype._routeResourceInfo;
            this.dataController = info.dataController as D;
            // Check secure
            if (info.secure && info.secure === true) {
                this.router.use(this.authHandle);
            }

            // Check users
            if (info.users) {
                this.router.use(roleAuthenticationMiddleware(info.users));
            }

            // Getting controller specific middleware
            const middleware: any[] = info.middleware ? info.middleware() : [];
            if (middleware.length > 0) {
                this.router.use(middleware);
            }
            // Getting validator
            const validators: any[] = info.validators ? info.validators() : [];
            const optional: any[] = MakeOptionalValidator(() => info.validators ? info.validators() : []);

            // Getting operation specific middleware
            const createMiddleware: any[] = info.createMiddleware ? info.createMiddleware() : [];
            const updateMiddleware: any[] = info.updateMiddleware ? info.updateMiddleware() : [];
            const viewMiddleware: any[] = info.viewMiddleware ? info.viewMiddleware() : [];

            // Getting resource endpoint Endpoint
            // const endPoint = info.path.split('#')[1] || this.className.toLowerCase();

            // Configuring Create Route
            this.router.post(`/`, this.combineValidator(middleware, validators, createMiddleware), this.create);

            // Configuring View all Route with filter
            this.router.get(`/`, this.combineValidator(viewMiddleware), this.index);

            // Configuring View {single} Route
            this.router.get(`/:id`, this.combineValidator(this.idValidation(), viewMiddleware) , this.index);

            // Configuring Update Route
            this.router.put(`/:id`, this.combineValidator(this.idValidation(), optional, updateMiddleware), this.update);
        }
    }

    get create(): RouteHandler {
        return this.routeConfig<CreateSpec>(`${this.className}: create`, async (data: CreateSpec, req: Request) => {
            return [201, await this.dataController.createNewObject(data, req.user)];
        });
    }
    get update(): RouteHandler {
        return this.routeConfig<UpdateSpec>(`${this.className}: update`, async (data: UpdateSpec, req: any) => {
            assert(req.resource, `${this.className}: update: No resource object found`);
            return [200, await this.dataController.updateObject(req.resource, data, req.user)];
        });
    }
    get index(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: index`, async (d: any, req: any) => {
            return [200, req.resource !== undefined ? req.resource : await this.dataController.all(req.query)];
        });
    }
}

// ----------------------------------------------------------------------------------------------
