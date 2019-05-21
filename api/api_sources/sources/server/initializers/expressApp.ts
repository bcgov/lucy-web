//import { express } from 'express'

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cross from 'cors';
//import * as path from 'path';

import {Logger} from '../logger';

import AppConfig from '../../AppConfig';

import { routes } from './routes'

import { SharedDBManager } from '../../database'
import { ApplicationManager } from '../../application-manager'

// declare const __dirname: any;

class ExpressApp {

    private static instance: ExpressApp;
    
    public app: any = express();

    private logger: Logger = new Logger('ExpressApp');

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    constructor() { }

    public initExpress() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cross());

        routes(this.app);
    }

    public start() {
        const port = AppConfig.port;
        this.app.listen(port, () => {
            this.logger.info('Server running on port => ' + port);
            ApplicationManager.shared.state.isReady = true
            ApplicationManager.shared.save();
        });
    }

    

    public async init() {
        this.logger.info('Starting API Server');
        ApplicationManager.shared.init();
        this.initExpress();
        try {
            await SharedDBManager.connect();
            ApplicationManager.shared.state.isDBUp = true
            this.start();
        } catch(err) {
            this.logger.error(`*** Unable to start API ***`);
            this.logger.error(`*** Error: ${err} **`);
            process.exit(1);
        }

    }
}

export default ExpressApp.getInstance();
