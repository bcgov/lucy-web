//
// Application State
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
//

import * as fs from 'fs';
import AppConfig from '../AppConfig';
import { LoggerBase } from '../server/logger';
/**
 * @description Application state
 * @export interface ApplicationState
 */
export  interface ApplicationState {
    isSeeded: boolean;
    isDBUp: boolean;
    isReady: boolean;
    lastDeployDate: Date;
    lastExitDate?: Date;
    lastErrorDetails: object;
}

/**
 * @description File name to write application state
 * @const string status_fileName
 */
const status_fileName = '/app_status.json';

/**
 * @description Application state manager
 * @export class ApplicationManager
 */
export class ApplicationManager extends LoggerBase {
    // Shared instance
    private static instance: ApplicationManager;

    // State instance variable
    state: ApplicationState;

    // Getter for Shared instance;
    public static get shared(): ApplicationManager {
        return this.instance || (this.instance = new this());
    }

    // Constructing
    constructor() {
       super();
    }

    /**
     * @description Initialize application state
     * @method init
     */
    init() {
        const statusFile = AppConfig.dataDirPath + status_fileName;
        if (fs.existsSync(statusFile)) {
            const buffer = fs.readFileSync(statusFile, {encoding: 'utf8', flag: 'r'});
            this.state = JSON.parse(buffer);
            ApplicationManager.logger.info(`Load application state from file: ${buffer}`);
            this.state.isReady = false;
            this.state.isDBUp = false;
            return;
        } else {
            this.state = {
                isSeeded: false,
                isReady: false,
                isDBUp: false,
                lastDeployDate: new Date(),
                lastErrorDetails: {}
            };
        }
    }

    /**
     * @description Save application state
     * @method save
     * @param void void param
     * @require void
     */
    save() {
        ApplicationManager.logger.info(`App Status saved`);
    }
}

//  ----------------
