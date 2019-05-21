/** Base route controller **/

// @IMPORT
// LIB
import { Request, Response } from 'express';

// SOURCE
import { Logger } from "../logger"

let CommonSuccessMessage: string = "API call succes"

export interface ValidationKeys {
    key: string,
    insideKeys?: ValidationKeys[]
}

export default class BaseRoutController  {
    
    logger: Logger
    constructor() {
        
        this.logger = new Logger(this.constructor.name)
    }

    private _validate(object: any, keys: ValidationKeys[]): boolean {
        var result = true
        for (let k of keys) {
            let item = object[k.key]
            if (item) {
                if (k.insideKeys) {
                    result = result && this._validate(item, k.insideKeys)
                    if (!result) {
                        break
                    }
                } else {
                    result = true
                }
            } else {
                result = false
                break
            }
        }
        return result
    }

    public validation(req: Request, keys: ValidationKeys[]): boolean {
        let body = req.body
        return this._validate(body, keys)
    }

    public getErrorJSON(error: any) {
        return {
            succes: false,
            message: `${error}`
        }
    }

    public getSuccessJSON(message?: any, data?: any) {
        return {
            succes: true,
            message: message || CommonSuccessMessage,
            data: data || {}
        }
    }

    public commonError(status: number, tag: string, error: any, resp: Response) {
        this.logger.error(`API-${tag} Call Error => ${error}`);
        resp.status(status).send(this.getErrorJSON(error))
    }
}
