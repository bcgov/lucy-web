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
    RouteHandler,
    RouteController
} from './base.route.controller';
import { ResourceInfo, ValidationBypass } from './route.const';
import { roleAuthenticationMiddleware } from './auth.middleware';
import { SchemaValidator, SchemaValidationOption } from './schema.validation';
import { MakeOptionalValidator } from './core.validator';
import { ModelSpecFactory, RequestFactory } from '../../database/factory';

/**
 * @description The ResourceRouteController is generic route controller provide manipulation of resource or table row item. Typical functionality
 * 1. Provides CURD functionality of table row item
 * 2. Provides Automated request data manipulation
 * 3. Custom middleware configuring
 * 4. Securing resource
 */
export class BaseResourceRouteController extends RouteController {
    constructor() {
        super();
    }

    /**
     * @description Setting up Controller
     */
    setup() {
        if (this.constructor.prototype._routeResourceInfo) {
            // Getting resource info
            // console.dir(this.constructor.prototype._routeResourceInfo);
            const info: ResourceInfo = this.constructor.prototype._routeResourceInfo;
            this.dataController = info.dataController;
            // Check secure
            if (info.secure && info.secure === true) {
                this.router.use(this.authHandle);
            }
            // this['dependencies'] = this.dataController.dependencies;

            // Check users
            if (info.users) {
                this.router.use(roleAuthenticationMiddleware(info.users));
            }

            // Calling Dependencies
            if (info.dependency) {
                info.dependency();
            }

            // Getting controller specific middleware
            const middleware: any[] = info.middleware ? info.middleware() : [];
            if (middleware.length > 0) {
                this.router.use(middleware);
            }
            // Getting validator
            const validationBypass: ValidationBypass = info.validationBypass || {};

            // If validation Bypass for post
            // Getting create operation specific middleware
            const createMiddleware: any[] = info.createMiddleware ? info.createMiddleware() : [];
            if (validationBypass.skipForCreate) {
                // Configuring Create Route without validation
                this.router.post(`/`, createMiddleware, this.create);
            } else {
                // // Configuring Create Route with validation
                const validators: any[] = this._createValidator();
                this.router.post(`/`, this.combineValidator(middleware, validators, createMiddleware), this.create);
            }

            // Getting Update Middleware
            const updateMiddleware: any[] = info.updateMiddleware ? info.updateMiddleware() : [];
            if (validationBypass.skipForUpdate) {
                // Configuring Update Route without validation
                this.router.put(`/:id`, this.combineValidator(this.idValidation(), updateMiddleware), this.update);

            } else {
                // Options
                const opt: SchemaValidationOption = {
                    updateOnly: true,
                    caller: 'update'
                };
                const optional: any[] = MakeOptionalValidator(() => this._createValidator(opt));

                // Configuring Update Route with validation
                this.router.put(`/:id`, this.combineValidator(this.idValidation(), optional, updateMiddleware), this.update);
            }

            // View Middleware
            const viewMiddleware: any[] = info.viewMiddleware ? info.viewMiddleware() : [];
            if (validationBypass.skipForRead) {
                // Configuring View all Route with filter
                this.router.get(`/`, viewMiddleware, this.index);
            } else {
                const filters: any = MakeOptionalValidator(() => this._createValidator({
                    caller: 'filter'
                }, true));

                // Configuring View all Route with filter
                this.router.get(`/`, this.combineValidator(viewMiddleware, filters), this.index);
            }

            // Configuring config route
            this.router.get(`/config`, viewMiddleware, this.config);

            // Adding example route
            this.router.get(`/example`, this.example);

            // Configuring View {single} Route
            this.router.get(`/:id`, this.combineValidator(this.idValidation(), viewMiddleware) , this.index);
        }
    }

    /**
     * @description Create Route Handler
     */
    get create(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: create`, async (data: any, req: Request) => {
            return await this.createResource(req, data);
        });
    }

    /**
     * @description Update Route Handler
     */
    get update(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: update`, async (data: any, req: any) => {
            return await this.updateResource(req, data);
        });
    }

    /**
     * @description Index or Fetch route
     */
    get index(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: index`, async (d: any, req: any) => {
            return await this.all(req, d);
        });
    }

    /**
     * @description Handler for config route
     */
    get config(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: config`, async () => {
            return [200, this.dataController.schemaObject.config()];
        });
    }

    get example(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: example`, async (d: any, req: any) => {
            return this.exampleData(req);
        });
    }

    /**
     *
     * Methods for subclass to handle actions
     */
    /**
     * @description Create New Object
     * @param Request req
     * @param any data
     */
    public async createResource(req: any, data: any): Promise<[number, any]> {
        return [201, await this.dataController.createNewObject(data, req.user)];
    }

    /**
     * @description Update existing
     * @param Request req
     * @param any data
     */
    public async updateResource(req: any, data: any): Promise<[number, any]> {
        assert(req.resource, `${this.className}: update: No resource object found`);
        return [200, await this.dataController.updateObject(req.resource, data, req.user)];
    }

    /**
     * @description Fetch object
     * @param Request req
     * @param any data
     */
    public async all(req: any, data?: any): Promise<[number, any]> {
        return [200, req.resource !== undefined ? req.resource : await this.dataController.all(req.query)];
    }

    public async exampleData(req: any): Promise<[number, any]> {
        if (process.env.ENVIRONMENT === 'local' || process.env.ENVIRONMENT === 'dev') {
            const modelSpec: any = await ModelSpecFactory(this.dataController)();
            const spec: any = await RequestFactory<any>(modelSpec, { schema: this.dataController.schemaObject});
            return [200, spec];
        } else {
            return [200, {}];
        }
    }

    /**
     * @description Create Validator Logic based on Schema
     */
    private _createValidator(options?: SchemaValidationOption, filterOnly?: boolean): any[] {
        return SchemaValidator.shared.validators(this.dataController.schemaObject, filterOnly, undefined, options);
    }
}

/**
 * @description Generic subclass of BaseResourceRouteController
 */
export class ResourceRouteController<D extends DataController, CreateSpec, UpdateSpec> extends BaseResourceRouteController {
    // DataController
    protected dataController: D;
    /**
     * @description Create Route Handler
     */
    get create(): RouteHandler {
        return this.routeConfig<CreateSpec>(`${this.className}: create`, async (data: CreateSpec, req: Request) => {
            return await this.createResource(req, data);
        });
    }

    /**
     * @description Update Route Handler
     */
    get update(): RouteHandler {
        return this.routeConfig<UpdateSpec>(`${this.className}: update`, async (data: UpdateSpec, req: any) => {
            assert(req.resource, `${this.className}: update: No resource object found`);
            return [200, await this.dataController.updateObject(req.resource, data, req.user)];
        });
    }
}

// ----------------------------------------------------------------------------------------------
