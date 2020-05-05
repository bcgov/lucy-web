/**
 * Imports
 */
import * as _ from 'underscore';
import { BaseLogger } from '../utilities/logger';
import { DataController } from '../../database/data.model.controller';
import { capitalize } from '../utilities';

export class ApplicationDataControllers {
    private _controllers: {[key: string]: DataController} = {};

    constructor(input: {[key: string]: DataController}) {
        this._controllers = input;
    }

    getController(name: string): DataController | undefined {
        return this._controllers[name] || this._controllers[capitalize(name)];
    }
}

/**
 * @description Load all controller and module
 */
export const DBControllerLoader = (modelModule: any, logger: BaseLogger) => {
    const result: {[key: string]: DataController} = {};
    _.each(modelModule, (moduleObj: any, name: string) => {
        if (name.toLowerCase().includes('controller')) {
            if (moduleObj.shared) {
                // logger.info(`Created Controller: ${name}`);
                result[name] = moduleObj.shared as DataController;
            } else {
                if (name !== 'RecordController'
                && name !== 'DataModelController'
                && name !== 'SpaceTimeController') {
                    logger.info(`No Shared Controller: ${name}`);
                    console.dir(moduleObj);
                }
            }
        }
    });

    return new ApplicationDataControllers(result);
};
// ----------------------------------------
