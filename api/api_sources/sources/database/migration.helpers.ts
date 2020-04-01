//
// Typeorm Database migration helper classes
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
import { Connection, MigrationInterface, createConnection } from 'typeorm';
import { LoggerBase} from '../server/logger';
import { SharedDBManager } from './dataBaseManager';

/**
 * @description Database config for orm
 * @const object dbConfig
 */
const dbConfig = require('../../ormconfig');

/**
 * @description Migration Helper class
 * @export class DatabaseMigrationHelper
 */
export class DatabaseMigrationHelper {
    /**
     * @description Static shared instance
     */
    private static instance: DatabaseMigrationHelper;

    /**
     * @description Getter for shared instance
     * @return DatabaseMigrationHelper
     */
    public static get shared(): DatabaseMigrationHelper {
        return this.instance || (this.instance = new this());
    }

    /**
     * @description Create SQL query string to add timestamps column in given table
     * @param string tableName
     * @return string
     */
    public createTimestampsColumns(tableName: string): string {
        return `ALTER TABLE ${tableName} ADD COLUMN create_at TIMESTAMP DEFAULT NOW();
        ALTER TABLE ${tableName} ADD COLUMN update_at TIMESTAMP DEFAULT NOW();`;
    }

    /**
     * @description Create query to insert data into table
     * @param string table
     * @param any data
     * @return void
     */
    public insertJSONInDB(table: string, data: any) {
        const queryPart1 = `INSERT INTO ${table}`;
        let insertStmt = ``;
        let keys = ``;
        for (const k in data) {
            if (k === 'additionalInitDataInfo') {
                // Skip
                continue;
            }
            keys = keys + `${k},`;
        }
        keys = keys.replace(/.$/, '');
        for (const key in data) {
            if (key === 'additionalInitDataInfo') {
                // Skip
                continue;
            }
            const item = data[key];
            if (item === 'DEFAULT') {
                insertStmt = insertStmt + ` ${item},`;
            } else if (typeof item === 'string') {
                insertStmt = insertStmt + ` '${item}',`;
            } else {
                insertStmt = insertStmt + ` ${item},`;
            }
        }
        insertStmt = insertStmt.replace(/.$/, '');
        return `${queryPart1} (${keys}) VALUES (${insertStmt});`;
    }

    /**
     * @description Create query to insert data array into table
     * @param string table
     * @param any[] data
     * @return void
     */
    public insertJSONArrayInDB(table: string, data: any[]) {
        const queryPart1 = `INSERT INTO ${table} VALUES (`;
        let insertStmt = ``;
        for (const item of data) {
            if (item === 'DEFAULT') {
                insertStmt = insertStmt + ` ${item},`;
            } else if (typeof item === 'string') {
                insertStmt = insertStmt + ` '${item}',`;
            } else {
                insertStmt = insertStmt + ` ${item},`;
            }
        }
        return `${queryPart1}${insertStmt});`;
    }

}

/**
 * @description Database Migration Manager
 * @export class AppDatabaseMigrationManager
 */
export class AppDatabaseMigrationManager extends LoggerBase {
     /**
     * @description Static shared instance
     */
    private static instance: AppDatabaseMigrationManager;

    /**
     * @description Getter for shared instance
     * @return DatabaseMigrationHelper
     */
    public static get shared(): AppDatabaseMigrationManager {
        return this.instance || (this.instance = new this());
    }

    async setupDatabase() {
       try {
            // Delete schema
            const newConfig: any = {
                type: dbConfig.type,
                host: dbConfig.host,
                username: dbConfig.username,
                password: dbConfig.password,
                database: dbConfig.database
            };
            return new Promise( res => {
                AppDatabaseMigrationManager.logger.info(`Setting up database`);
                createConnection(newConfig).then(async (connection: Connection) => {
                    // Get Schema
                    const schema = process.env.DB_SCHEMA || 'invasivesbc';
                    await connection.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
                    await connection.query(`SET search_path TO ${schema}, public;`);
                    await connection.query(`SET SCHEMA '${schema}';`);
                    // Set Timezone
                    const timezone = process.env.TIMEZONE || 'America/Vancouver';
                    await connection.query(`SET TIME ZONE '${timezone}';`);
                    // await connection.query(`CREATE TABLE IF NOT EXISTS ${dbConfig.migrationsTableName}();`);
                    await connection.close();
                    res();
                }).catch( err => {
                    AppDatabaseMigrationManager.logger.error(`Unable to perform setup DATABASE{1}: ${err}`);
                    res();
                });
            });
       } catch (excp) {
           AppDatabaseMigrationManager.logger.error('Unable to perform setup DATABASE{0}');
           return;
       }

    }

    /**
     * @description Recursively revert each migration
     * @param Connection con
     * @param number count
     */
    private async _revert(con: Connection, count: number): Promise<any> {
        if (count === 0) {
            AppDatabaseMigrationManager.logger.info('Revert Migration [DONE]');
            return;
        } else {
            try {
                if (count - 1 <= con.migrations.length) {
                    const migration: MigrationInterface = con.migrations[count - 1];
                    AppDatabaseMigrationManager.logger.info(`_revert | Reverting migration ${migration.constructor.name} [${count - 1}]`);
                } else {
                    AppDatabaseMigrationManager.logger.info(`_revert | Reverting migration [${count - 1}]`);
                }
                await con.undoLastMigration({ transaction: true});
            } catch (excp) {
                AppDatabaseMigrationManager.logger.error(`_revert | Exception received while running revert migration => ${count}: ${excp}`);
                throw excp;
            }
            return this._revert(con, (count - 1));
        }
    }

    /**
     * @description Revert all existing migrations
     * @param Connection connection
     * @return Promise<void>
     */
    public async revert(connection: Connection) {

        // Get current migrations count
        let result: any[] = [ { count: 0 }];
        try {
            result = await connection.query(`SELECT COUNT(*) FROM ${dbConfig.schema}.${dbConfig.migrationsTableName}`);
        } catch (exp) {
            AppDatabaseMigrationManager.logger.info (`Exception: ${exp}`);
            AppDatabaseMigrationManager.logger.info('Possible No table exception');
        }

        try {
            AppDatabaseMigrationManager.logger.info(`revert | Migration count: ${JSON.stringify(result, null, 2)}`);
            if (result[0].count > 0) {
                await this._revert(connection, parseInt(result[0].count, 10));
            } else {
                AppDatabaseMigrationManager.logger.info('No migration to revert');
            }
            return;
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`revert | Exception received while running revert migrations: ${excp}`);
            throw excp;
        }
    }

    public async revertLastMigration() {
        await this.setupDatabase();
        await SharedDBManager.connect();
        const connection = SharedDBManager.connection;
        await connection.undoLastMigration();
        await SharedDBManager.close();
        return;
    }

    async runMigration(connection: Connection) {
        try {
            await connection.runMigrations({transaction: true});
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`RunMigration | Exception received while running migration on database: ${excp}`);

            // Close DB Connection
            await SharedDBManager.close();
            // Reopen
            // await SharedDBManager.connect();
            // Run Migration Again
            // await SharedDBManager.connection.runMigrations();
            throw excp;
        }
    }

    /**
     * @description Revert all existing migration then run fresh migrations
     * @return Promise<void>
     */
    public async refresh(): Promise<void> {
        try {
            await this.setupDatabase();
            await SharedDBManager.connect();
            const connection = SharedDBManager.connection;
            AppDatabaseMigrationManager.logger.info('Connection Created');
            await this.revert(connection);
            await this.runMigration(connection);
            await SharedDBManager.close();
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`refresh | Exception received while refresh database: ${excp}`);
            // Close DB Connection
            await SharedDBManager.close();
            // Rethrow exception
            throw excp;
        }
    }

    /**
     * @description Revert latest migration and run
     */
    public async revertLatestAndRun(): Promise<void> {
        try {
            await this.setupDatabase();
            await SharedDBManager.connect();
            const connection = SharedDBManager.connection;
            await connection.undoLastMigration();
            await this.runMigration(connection);
            await SharedDBManager.close();
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`revertLatestAndRun | Exception received while refresh database: ${excp}`);

            // Close DB Connection
            await SharedDBManager.close();
            // Rethrow exception
            throw excp;
        }
    }

    /**
     * @description Run fresh migrations
     * @return Promise<void>
     */
    public async migrate(): Promise<void> {
        try {
            await this.setupDatabase();
            await SharedDBManager.connect();
            const connection: Connection = SharedDBManager.connection;
            await this.runMigration(connection);
            await SharedDBManager.close();
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`migrate | Exception received while migrate database: ${excp}`);
            // Close DB Connection
            await SharedDBManager.close();
            // Rethrow exception
            throw excp;
        }
    }
}
// -----------------------------------------------------------------------------------------

