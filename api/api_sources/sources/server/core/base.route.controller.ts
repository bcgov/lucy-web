/** Base route controller **/

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
 */
export type RouteMiddlewareHandler = (req: express.Request, res: express.Response, next: any) => Promise<any>;

export interface ValidationKeys {
    key: string;
    insideKeys?: ValidationKeys[];
}


export class BaseRoutController<DataController>  {
    router: express.Router = express.Router();
    logger: Logger;
    dataController: DataController;
    userController: UserDataController = UserDataController.shared;
    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    public getErrorJSON(message: string, errors: object[]) {
        return {
            message,
            errors
        };
    }

    public successResp(data?: any, message?: string) {
        return {
            message: message || CommonSuccessMessage,
            data: data || {}
        };
    }

    public commonError(status: number, tag: string, error: any, resp: express.Response, message?: string) {
        this.logger.error(`[API-${tag}] | Call Error => ${error}`);
        const errMsg = message || `${error}`;
        resp.status(status).json(errorBody(errMsg, [error]));
    }

}

export class SecureRouteController<T> extends BaseRoutController<T> {
    constructor() {
        super();
        // Register auth middleware
        // this.router.use(passport.authenticate('jwt', {session : false}));
        this.router.use(this.authHandle);
    }

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

export class BaseAdminRouteController<T> extends SecureRouteController<T> {
    constructor() {
        super();

        // Register role middleware
        this.router.use(roleAuthenticationMiddleware([RolesCodeValue.admin]));
    }
}
