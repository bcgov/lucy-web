//
// Base route controller
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
// Created by Pushan Mitra on 2019-05-10.

// @IMPORT
// LIB
import * as assert from 'assert';
import * as _ from 'underscore';
import * as express from 'express';
import * as passport from 'passport';
import { validationResult, check } from 'express-validator';
// SOURCE
import { Logger } from '../logger';
import { errorBody } from '../core';
import { roleAuthenticationMiddleware } from './auth.middleware';
import { RolesCodeValue, UserDataController } from '../../database/models';
import { DataController} from '../../database/data.model.controller';
import { isEmpty, unWrap } from '../../libs/utilities';
import { ResourceInfo } from './route.const';
// import { getRouteConfigs } from './route.des';

/**
 * Common Message for API success
 * @const CommonSuccessMessage
 */
const CommonSuccessMessage = 'API call success';

/**
 * Express route handler closure type
 * @export type RouteHandler
 */
export type RouteHandler = (req: express.Request, res: express.Response) => Promise<any>;

/**
 * Express middleware handler closure type
 * @export type RouteMiddlewareHandler
 * @param express.Request req
 * @param express.Response resp
 * @param any|closure next
 * @returns Promise<any>
 */
export type RouteMiddlewareHandler = (req: express.Request, res: express.Response, next: any) => Promise<any>;

export interface ValidationKeys {
    key: string;
    insideKeys?: ValidationKeys[];
}

/**
 * @description Update request object with validation keys
 * @param any req : Express req
 * @param object obj : update object
 */
export const UpdateRequest = (req: any, obj: object) => {
    const existing = req.validation || {};
    req.validation = { ...existing, ...obj};
};


export enum HTTPMethod {
    get = 'get',
    post = 'post',
    put = 'put',
    patch = 'patch',
    delete = 'delete'
}

export interface ResponseSchema {
    type: string;
    $ref?: string;
}

export interface APIResponse {
    description: string;
    schema: ResponseSchema;
}
export interface RouteDescription {
    path: string;
    validators?: () => any[];
    middleware?: () => any[];
    description?: string;
    index?: number;
    method: HTTPMethod;
    responses?: {[key: number]: APIResponse};
    secure?: boolean;
    skipValidation?: boolean;
}

export type RouteBasicDescription = Pick<RouteDescription, 'path' | 'validators' | 'middleware' |  'description' | 'index' | 'secure' | 'responses'>;



export interface RouteConfig {
    description: RouteDescription;
    handler: string;
    isMethod?: boolean;
}
/**
 * @description Base express route controller. Provides
 * 1. Common functionality for all routes
 * 2. Provide logger support
 * 3. Common Error handling
 * 4. Common Message Wrapping
 * 5. Created for sub classing only
 * @export class BaseRouteController<DataController>
 */

export class RouteController {
    // Generic share instance
    protected static _sharedInstance: any;
    // DataController associated with route
    protected dataController: DataController;
    // Express route
    router: express.Router = express.Router();
    // Logger
    logger: Logger;
    // User Data Controller
    userController: UserDataController = UserDataController.shared;

    // Configs
    private configs: RouteConfig[];

    _configMap: {[key: string]: RouteConfig} = {};

    /**
     * @description Getter for share instance
     */
    static sharedInstance(): RouteController {
        return (this._sharedInstance || (this._sharedInstance = new this()));
    }

    /**
     * @description Constructor, create logger and other instances
     */
    constructor() {
        // Initiate logger
        this.logger = new Logger(this.constructor.name);
        if (this.isSecure) {
            this.router.use(this.authHandle);
        }
        if (this.controllerRouteInfo.dataController) {
            this.dataController = this.controllerRouteInfo.dataController;
        }
        this.applyRouteConfig();
        this.setup();
    }

    /**
     * @description Additional setup method for sub-classes
     */
    setup() {
        // Subclass to override additional setup method
    }

    get className(): string {
        return this.constructor.name;
    }

    get isSecure(): boolean {
        return unWrap(this.controllerRouteInfo.secure, false);
    }

    apiName(request: express.Request) {
        return `${request.originalUrl}[${request.method}]`;
    }

    /**
     * @description Adding config values
     */
    applyRouteConfig() {
        // Check config applied or not
        if (this.configs && this.configs.length > 0) {
            return;
        }
        // Get config
        this.configs = _.map(this.constructor.prototype._configMap, (val: RouteConfig) => val);

        // Local compare method for sorting
        const compare = (x: number, y: number): number => {
            if (x > y) {
                return 1;
            } else if ( x < y) {
                return -1;
            } else {
                return 0;
            }
        };

        // Sort Configs
        const sorted = [...this.configs].sort((c1: RouteConfig, c2: RouteConfig) => {
            return compare(c1.description.index || 0, c2.description.index || 1);
        });
        this.configs = sorted;
        // console.log(`${this.className}`);
        // Apply config to route
        for (const config of this.configs) {
            try {
                // Getting endpoint
                const paths: string[] = config.description.path.split('#');
                let endPoint: string = paths.length > 0 ? paths[1] : paths[0];
                if (!endPoint) {
                    endPoint = config.description.path;
                }
                // Getting validator middleware
                const validators = config.description.validators ? config.description.validators() : [];
                // Getting other middleware
                const middleware = config.description.middleware ? config.description.middleware() : [];
                // Combining them
                let allMiddleware = this.combineValidator(middleware, validators);
                // Checking security level of the api
                // 1. Skip if controller is secure
                if (config.description.secure && !this.isSecure) {
                    allMiddleware = [this.authHandle, ...allMiddleware];
                }
                if (config.isMethod) {
                    const routeMethod: Function = this[config.handler].bind(this);
                    this.router[config.description.method](endPoint, allMiddleware, async (req: express.Request, res: express.Response) => {
                        await this.handleRoute(req, res, routeMethod, config.handler);
                    });

                } else {
                    this.router[config.description.method](endPoint, allMiddleware, this[config.handler]);
                }
            } catch (excp) {
                this.logger.error(`Exception  while applying route config: ${excp}`);
                this.logger.error(`Config: ${JSON.stringify(config, null, 2)}`);
            }
        }
        /*_.each(this.configs, (config: RouteConfig) => {

        });*/
    }

    async handleRoute(req: express.Request, res: express.Response, handler: any, tag: string, applyDataHandle?: boolean) {
        // Check error
        // Check for error
        const errors = validationResult(req);
        const infoTag = `${tag}(${this.apiName(req)})`;
        if (!errors.isEmpty()) {
            this.logger.error(`${infoTag}: Validation error:\n ${JSON.stringify(errors.array(), null, 2)}`);
            this.logReq(req, tag);
            return res.status(422).json({
                message: 'Input validation error',
                time: Date(),
                errors: errors.array()
            });
        }
        // Get data
        // Get Data From handler
        try {
            const data: any = req.body;
            const [status, body, error]  = applyDataHandle ? await handler(data, req, res) : await handler(req, data, res);
            if (status > 0) {
                return res.status(status).json(error ? this.getErrorJSON(body, []) : this.successResp(body));
            } else {
                this.logger.error(`handleRouteMethod: ${infoTag}: [FAIL]`);
                return this.commonError(500, `handleRouteMethod:${infoTag}`, new Error(`${infoTag} : Unable to process req`), res);
            }
        } catch (excp) {
            return this.commonError(500, `handleRouteMethod:${infoTag}`, excp, res);
        }
    }

    /**
     * @description Get Error message json for express response
     * @param string message
     * @param string errors
     */
    public getErrorJSON(message: string, errors: object[]) {
        return {
            message,
            errors
        };
    }

    /**
     * @description Create Success response message json
     * @param any data
     * @param string message
     */
    public successResp(data?: any, message?: string) {
        return {
            message: message || CommonSuccessMessage,
            time: Date(),
            data: data || {}
        };
    }

    /**
     * @description Method to log and handle common error for express route handler
     * @param number status HTTP Status Code
     * @param string tag Tag for log
     * @param any error Error object
     * @param express.Response resp
     * @param string message
     */
    public commonError(status: number, tag: string, error: any, resp: express.Response, message?: string) {
        this.logger.error(`[API-${tag}] | Call Error => ${error} | message => ${message}`);
        const errMsg = message || `${error}`;
        resp.status(status).json(errorBody(errMsg, [error]));
    }

    /**
     * @description Get validation result from req
     * @param any req Express Req
     * @param string tag Debug string
     * @param boolean optional fail  Fail processing
     */
    public validation<T>(req: any, tag?: string, fail?: boolean): T {
        const value: T = req['validation'] as T;
        if (fail) {
            assert(value, `[${tag || 'req'}]:Unable to get validation value`);
        }
        return value;
    }

    public idValidation(paramKey: string = 'id') {
        return [
            check(paramKey).isInt().custom(async (value: number, {req}) => {
                const item = await this.dataController.findById(value);
                assert(item, `[resource-validation]: item does not exists with id: ${value}`);
                UpdateRequest(req, { id: item});
                req.resource = item;
            })
        ];
    }

    /**
     * @description Combine validators
     * @param args variable length arg
     */
    public combineValidator(...args: any[][]): any[] {
        let result: any[] = [];
        for (const item of args) {
            result = result.concat(item);
        }
        return result;
    }

    /**
     * @description Passport JWT middleware
     * @returns RouteMiddlewareHandler
     */
    get authHandle(): RouteMiddlewareHandler {
        return async (req: express.Request, resp: express.Response, next: any) => {
            const tag = `authHandler-(${this.apiName(req)})`;
            try {
                passport.authenticate('jwt', {session: false}, (err, user) => {
                    console.log('user ~~~~~~~~ ', user);
                    console.log('err ~~~~~~~~', err);
                    if (err) {
                        const msg = `Authorization fail with error ${err}`;
                        this.commonError(401, tag, err, resp, msg);
                    } else if (!user) {
                        this.commonError(401, tag, 'Un-authorize access', resp, 'Un-authorize access (No User) check auth provider url');
                    } else {
                        req.user = user;
                        next();
                    }
                })(req, resp, next);
            } catch (excp) {
                this.logger.error(`${tag}: Exception ${JSON.stringify(excp, null, 2)}`);
                this.commonError(500, tag, excp, resp);
            }
        };
    }

    logReq(req: express.Request, tag: string) {
        this.logger.error(`${tag}: api => ${this.apiName(req)}`);
        if (!isEmpty(req.params) ) {
            this.logger.error(`${tag}: Received parma(s):\n ${JSON.stringify(req.params, null, 2)}`);
        }
        if (!isEmpty(req.body)) {
            this.logger.error(`${tag}: Received body:\n ${JSON.stringify(req.body, null, 2)}`);
        }
        if (!isEmpty(req.query)) {
            this.logger.error(`${tag}: Received query:\n ${JSON.stringify(req.query, null, 2)}`);
        }
    }

    /**
     *
     * @param string tag Tag handler for debugging
     * @param (req: express.Request, data: T) handler closure to handle req
     */
    routeConfig<T>(tag: string, handler: (data: T, req: express.Request, resp: express.Response) => Promise<[number, any]>): RouteHandler {
        return async (req: express.Request, resp: express.Response) => {
            await this.handleRoute(req, resp, handler, tag, true);
        };
    }

    get controllerRouteInfo(): ResourceInfo {
        return this.constructor.prototype._routeResourceInfo || {
            dataController: this.dataController,
            secure: false
        };
    }
}

export class BaseRouteController<Controller extends DataController> extends RouteController {
    // DataController
    protected dataController: Controller;
    /**
     * @description Getter for share instance
     */
    static sharedInstance<Controller>(): BaseRouteController<DataController> {
        return (this._sharedInstance || (this._sharedInstance = new this()));
    }
}

/**
 * @description This is generic route controller to handle secure routes. Created for sub classing.
 * @export class SecureRouteController
 */
export class SecureRouteController<T extends DataController> extends BaseRouteController<T> {
    get isSecure(): boolean {
        return true;
    }
    constructor() {
        super();
        // Register auth middleware
        // this.router.use(passport.authenticate('jwt', {session : false}));
    }
}

/**
 * @description Generic route controller for admin only routes. Created for sub classing.
 */
export class BaseAdminRouteController<T extends DataController> extends SecureRouteController<T> {
    constructor() {
        super();
    }

    setup() {
        // Register role middleware
        this.router.use(roleAuthenticationMiddleware([RolesCodeValue.admin]));
    }
}

/**
 * @description Generic route controller to check User has write access or not
 */
export class WriterRouteController<T extends DataController> extends SecureRouteController<T> {
    constructor() {
        super();
    }

    setup() {
        // Register role middleware
        this.router.use(roleAuthenticationMiddleware([RolesCodeValue.admin, RolesCodeValue.editor]));
    }
}
// --------------------------------------------------------------------------------------------------

