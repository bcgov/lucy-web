//
// Express application wrapper
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
/**
 * Imports
 */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cross from 'cors';
import * as path from 'path';

import {Logger} from '../logger';
import AppConfig from '../../AppConfig';
import { routes } from './routes';
import { SharedDBManager } from '../../database/dataBaseManager';
import { ApplicationManager } from '../../application-manager';
import { authenticationMiddleWare, errorHandler } from '../core';


// declare const __dirname: any;

/**
 * @description Express app wrapper class
 */
class ExpressApp {

    // Shared Instance
    private static instance: ExpressApp;

    // Express app
    public app: any = express();

    // Logger
    private logger: Logger = new Logger('ExpressApp');

    /**
     * @description Getter for shared instance
     */
    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    /**
     * Constructing
     */
    constructor() {
        this.logger.info('Creating express app...');
    }

    /**
     * @description Initializing express app
     */
    public async initExpress(): Promise<any> {
        // Body parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        // Cross origin
        this.app.use(cross());

        // Schema-spy local url
        const schemaSpy = path.resolve(__dirname, '../../../schemaspy');
        this.app.use('/api/dev/schemaspy', express.static(schemaSpy));

        // Code coverage
        const coverage = path.resolve(__dirname, '../../../coverage');
        this.app.use('/api/dev/coverage', express.static(coverage));


        // Auth middleware
        this.app.use(await authenticationMiddleWare());

        // App router
        routes(this.app);

        // Global error handler
        this.app.use(errorHandler);

        return this.app;
    }

    /**
     * @description Starting server
     */
    public start() {
        const port = AppConfig.port;
        this.app.listen(port, () => {
            this.logger.info('Server running on port => ' + port);
            ApplicationManager.shared.state.isReady = true;
            ApplicationManager.shared.save();
        });
    }

    /**
     * @description Initializing server
     */
    public async init() {
        this.logger.info('Starting API Server');
        ApplicationManager.shared.init();
        try {
            await SharedDBManager.connect();
            ApplicationManager.shared.state.isDBUp = true;
            this.start();
        } catch (err) {
            this.logger.error(`*** Unable to start API ***`);
            this.logger.error(`*** Error: ${err} **`);
            process.exit(1);
        }

    }
}

/**
 * @description Getter of Shared instance of main Express Application Wrapper
 */
export const SharedExpressApp =  ExpressApp.getInstance();
// -----------------------------------------------------------------------------------------------------------
