/** Base route controller **/

// @IMPORT
// LIB
import * as express from 'express';
import * as passport from 'passport';
// SOURCE
import { Logger } from "../logger";
import { errorBody } from '../core';


let CommonSuccessMessage: string = "API call success";

export interface ValidationKeys {
    key: string,
    insideKeys?: ValidationKeys[]
}


export class BaseRoutController<DataController>  {
    route: express.Router = express.Router(); 
    logger: Logger;
    dataController: DataController;
    constructor() {
        this.logger = new Logger(this.constructor.name)
    }

    public getErrorJSON(message: string,errors: object[]) {
        return {
            message, 
            errors
        }
    }

    public getSuccessJSON(data?: any, message?: string) {
        return {
            message: message || CommonSuccessMessage,
            data: data || {}
        }
    }

    public commonError(status: number, tag: string, error: any, resp: express.Response, message?: string) {
        this.logger.error(`API-${tag} Call Error => ${error}`);
        let errMsg = message || `${error}`
        resp.status(status).json(errorBody(errMsg, [error]));
    }

}

export class SecureRouteController<T> extends BaseRoutController<T> {
    constructor(){
        super();
        // Register auth middleware
        this.route.use(passport.authenticate('jwt', {session : false}));
    }
}
