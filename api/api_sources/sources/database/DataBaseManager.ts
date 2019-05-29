import {createConnection, Connection} from 'typeorm';
//import AppConfig from '../../appConfig'
import { LoggerBase} from '../server/logger';
import { RetryManager } from '../server/core/retry.manager'

// import { User, UserRole } from './models/User';
import { SeedManager } from './seed.manager'


export * from './models'

var dbConfig = require('../../ormconfig');

export class DBManager extends LoggerBase {
    private static instance: DBManager;

    connection: Connection;

    maxRetry = 3;
    noOfRetry = 1;


    public static get shared(): DBManager {
        return this.instance || (this.instance = new this());
    }

    async _connect(): Promise<boolean> {
        if (this.connection && this.connection.isConnected) {
            DBManager.logger.info('ALREADY CONNECTED');
            return new Promise<boolean>((res) => {
                res(true);
            });
        }
        return new Promise<boolean>((resolve, reject) => {
            createConnection().then((connection: Connection) => {
                this.connection = connection;
                DBManager.logger.info(`[DB Connection] success with config: ${JSON.stringify(this.connection.options)}`);
                resolve(true);
            }).catch((err) => {
                DBManager.logger.error(`[DB Connection] Error: ${err}`);
                DBManager.logger.error(`[DB Config]: ${JSON.stringify(dbConfig)}`);

                // Try to connect with options directly 
                createConnection(dbConfig).then((connection: Connection) => {
                    this.connection = connection;
                    DBManager.logger.info(`[DB Connection] success with config: ${JSON.stringify(this.connection.options)}`);
                    resolve(true);
                }).catch(() => {
                    DBManager.logger.error(`[DB Connection - 2] Error: ${err}`);
                    DBManager.logger.error(`[DB Config - 2]: ${JSON.stringify(dbConfig)}`);
                    reject(err)
                });
                
            })
        });

    }

    async connect(): Promise<void> {
        const retryManager = new RetryManager<void>();
        try {
            await retryManager.tryAction(this, '_connect');
            DBManager.logger.info('DB Connection DONE');
            return
        } catch (err) {
            throw Error(`Unable to connect DB, please check log`);
        }
    }

    async close(): Promise<void> {
        if (this.connection) {
            return await this.connection.close();
        }
        return;
    }

    

    async seed(): Promise<void> {
        await SeedManager.shared.seedAdmin();
        return
    }
}

export const SharedDBManager = DBManager.shared 