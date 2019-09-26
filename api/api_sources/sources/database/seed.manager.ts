//
// Seed Manager Class
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

// TODO: Need Corrections

/**
 * Imports
 */
import * as csv from 'csvtojson';
import { Connection} from 'typeorm';
import { LoggerBase} from '../server/logger';
import * as path from 'path';
import { BaseModel} from './models';
import { SharedDBManager } from './index';

/**
 * Constants
 */
const seedFileAdmin = 'Admin-Sheet1.csv';
const seedFolderPath = '../../../../seeds/';
declare const __dirname: any;

/**
 * @description Get file path of seed file
 * @param string fileName
 */
const getFilePath = (fileName: string) => {
    return path.resolve(__dirname + seedFolderPath, seedFileAdmin);
};

/**
 * @description Generic seeder class
 * @export class Seeder<T, B>
 */
export class Seeder<D, T extends BaseModel> extends LoggerBase {

    async seed(seedFileName: string, entity: any, uniqueKey: string): Promise<void> {
        const seedAdminPath = getFilePath(seedFileAdmin);
        Seeder.logger.info(`Will seed from file: ${seedAdminPath}`);
        const seeds: D[] = await csv().fromFile(seedAdminPath);
        for (const d of seeds) {
            try {
                // TODO: Get proper logger
                // SeedManager.logger.info(`Seed ${seedFileName} Value: ${JSON.stringify(d)}`);
                const query: object = {};
                query[uniqueKey] = d[uniqueKey];
                const conn: Connection = SharedDBManager.connection;
                const existing: T = await entity.fetchOne(conn, query) as T;
                if (!existing) {
                    // TODO: Get proper logger
                    // SeedManager.logger.info('Will Create new Item');
                    // const newObj = new entity();
                    // const newItem: T = newObj as T;
                    // const newLoad: LoadData<D> = newObj as LoadData<D>;
                    // newLoad.loadMap(d);
                    // newItem.loadData(d);
                }
            } catch (err) {
                // TODO: Get proper logger
                // SeedManager.logger.info(`Error while seeding ${seedFileName} => ${err}`)
            }
        }
    }
}

/**
 * @description SeedManager class
 * @export class SeedManager
 */
export class SeedManager extends LoggerBase {
    private static instance: SeedManager;

    public static get shared(): SeedManager {
        return this.instance || (this.instance = new this());
    }
    constructor() {
        super();
    }

    get connection(): Connection {
        return SharedDBManager.connection;
    }

    async seedAdmin(): Promise<void> {
        return;
    }
}
// --------------------------------------------------------------------------------------------
