//
// Typeorm Database connection manager class
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
import {createConnection, Connection } from 'typeorm';
import { LoggerBase} from '../server/logger';
import { SeedManager } from './seed.manager';
import * as modelsModule from './models';
import { ApplicationDataControllers, DBControllerLoader } from '../libs/core-database';
const dbConfig = require('../../ormconfig');

/**
 * @description Database manager class
 * @export class DBManager
 */
export class DBManager extends LoggerBase {
    // Share Instance
    private static instance: DBManager;

    // Controllers
    dataControllers: ApplicationDataControllers;

    // DB connection object
    connection: Connection;

    // Props
    maxRetry = 3;
    noOfRetry = 1;

    // Getter for share instance
    /**
     * @description Static getter for share instance
     * @return DBManager
     */
    public static get shared(): DBManager {
        return this.instance || (this.instance = new this());
    }

    /**
     * @description Connect database call internally
     * @method _connect
     * @return Promise<boolean>
     */
    async _connect(): Promise<boolean> {
        if (this.connection && this.connection.isConnected) {
            DBManager.logger.info('ALREADY CONNECTED');
            return new Promise<boolean>((res) => {
                res(true);
            });
        } else if (global['connection'] ) {
            this.connection = global['connection'] as Connection;
            DBManager.logger.info('CONNECTED GLOBALLY');
            return new Promise<boolean>((res) => {
                res(true);
            });
        }
        return new Promise<boolean>((resolve, reject) => {
            DBManager.logger.info('CONNECTING DB ...');
            createConnection(dbConfig).then((connection: Connection) => {
                this.connection = connection;
                DBManager.logger.info('[DB CONNECTED]');
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
                    reject(err);
                });
            });
        });
    }

    private loadControllers() {
        this.dataControllers = DBControllerLoader(modelsModule, DBManager.logger);
    }

    /**
     * @description Setup data base structure
     */
    async setupDB() {
        const connection = this.connection;
        // Get Schema
        const schema = process.env.DB_SCHEMA || 'invasivesbc';
        await connection.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
        await connection.query(`SET search_path TO ${schema}, public;`);
        await connection.query(`SET SCHEMA '${schema}';`);
    }

    /**
     * @description API to connect db
     * @method connect
     */
    async connect(): Promise<void> {
        try {
            await this._connect();
            await this.setupDB();
            this.loadControllers();
            return;
        } catch (err) {
            throw Error(`Unable to connect DB, please check log`);
        }
    }

    /**
     * @description API to close db connection
     * @method close
     */
    async close(): Promise<void> {
        if (this.connection && this.connection.isConnected) {
            await this.connection.close();
        }
        return;
    }

    /**
     * @description API to seed db
     * @method seed
     */
    async seed(): Promise<void> {
        await SeedManager.shared.seedAdmin();
        return;
    }
}

/**
 * @description Exporting Shared Database manager
 * @export const SharedDBManager
 */
export const SharedDBManager = DBManager.shared;

// -------------------------------------------------------
