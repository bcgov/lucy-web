/**
 * Express Application
 */

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cross from 'cors';

import {Logger} from '../logger';
import AppConfig from '../../AppConfig';
import { routes } from './routes';
import { SharedDBManager } from '../../database/dataBaseManager';
import { ApplicationManager } from '../../application-manager';
import { authenticationMiddleWare, errorHandler } from '../core';


// declare const __dirname: any;

class ExpressApp {

    private static instance: ExpressApp;
    public app: any = express();

    private logger: Logger = new Logger('ExpressApp');

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    constructor() {
    }

    public async initExpress(): Promise<any> {
        // Body parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        // Cross origin
        this.app.use(cross());

        // Auth middleware
        this.app.use(await authenticationMiddleWare());

        // App router
        routes(this.app);

        // Global error handler
        this.app.use(errorHandler);

        return this.app;
    }

    public start() {
        const port = AppConfig.port;
        this.app.listen(port, () => {
            this.logger.info('Server running on port => ' + port);
            ApplicationManager.shared.state.isReady = true;
            ApplicationManager.shared.save();
        });
    }

    public async init() {
        this.logger.info('Starting API Server');
        ApplicationManager.shared.init();
        try {
            console.dir(SharedDBManager);
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

export const SharedExpressApp =  ExpressApp.getInstance();
