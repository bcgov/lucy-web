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
import * as express from 'express';
import * as passport from 'passport';
// SOURCE
import { Logger } from '../logger';
import { errorBody } from '../core';
import { roleAuthenticationMiddleware } from './auth.middleware';
import { RolesCodeValue, UserDataController } from '../../database/models';

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
 * @description Base express route controller. Provides
 * 1. Common functionality for all routes
 * 2. Provide logger support
 * 3. Common Error handling
 * 4. Common Message Wrapping
 * 5. Created for sub classing only
 * @export class BaseRoutController<DataController>
 */
export class BaseRoutController<DataController>  {
    // Generic share instance
    private static _sharedInstance: any;
    // Express route
    router: express.Router = express.Router();
    // Logger
    logger: Logger;
    // DataController associated with route
    dataController: DataController;
    // User Data Controller
    userController: UserDataController = UserDataController.shared;

    /**
     * @description Getter for share instance 
     */
    static sharedInstance<DataController>(): BaseRoutController<DataController> {
        return (this._sharedInstance || (this._sharedInstance = new this()));
    }

    /**
     * @description Constructor, create logger and other instances
     */
    constructor() {
        this.logger = new Logger(this.constructor.name);
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
        this.logger.error(`[API-${tag}] | Call Error => ${error}`);
        const errMsg = message || `${error}`;
        resp.status(status).json(errorBody(errMsg, [error]));
    }
}

/**
 * @description This is generic route controller to handle secure routes. Created for sub classing.
 * @export class SecureRouteController
 */
export class SecureRouteController<T> extends BaseRoutController<T> {
    constructor() {
        super();
        // Register auth middleware
        // this.router.use(passport.authenticate('jwt', {session : false}));
        this.router.use(this.authHandle);
    }

    /**
     * @description Passport JWT middleware
     * @returns RouteMiddlewareHandler
     */
    get authHandle(): RouteMiddlewareHandler {
        return async (req: express.Request, resp: express.Response, next: any) => {
            try {
                passport.authenticate('jwt', {session: false}, (err, user) => {
                    if (err) {
                        const msg = `Authorization fail with error ${err}`;
                        this.commonError(401, 'authHandle', err, resp, msg);
                    } else if (!user) {
                        this.commonError(401, 'authHandle', 'Un-authorize access', resp, 'Un-authorize access');
                    } else {
                        req.user = user;
                        next();
                    }
                })(req, resp, next);
            } catch (excp) {
                this.commonError(500, 'authHandler', excp, resp);
            }
        };
    }
}

/**
 * @description Generic route controller for admin only routes. Created for sub classing.
 */
export class BaseAdminRouteController<T> extends SecureRouteController<T> {
    constructor() {
        super();

        // Register role middleware
        this.router.use(roleAuthenticationMiddleware([RolesCodeValue.admin]));
    }
}
// -----------------------------------------------------------------------------------------------------------

