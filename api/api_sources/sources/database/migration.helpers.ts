import { Connection, createConnection} from 'typeorm';
import { LoggerBase} from '../server/logger';

var dbConfig = require('../../ormconfig');
export class DatabaseMigrationHelper {
    private static instance: DatabaseMigrationHelper;

    public static get shared(): DatabaseMigrationHelper {
        return this.instance || (this.instance = new this());
    }

    public createTimestampsColumns(tableName: string): string {
        return `ALTER TABLE ${tableName} ADD COLUMN create_at TIMESTAMP DEFAULT NOW();
        ALTER TABLE ${tableName} ADD COLUMN update_at TIMESTAMP DEFAULT NOW();`;
    }

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
        keys = keys.replace(/.$/, "");
        for (const key in data) {
            if (key === 'additionalInitDataInfo') {
                // Skip
                continue;
            }
            const item = data[key];
            if (item === 'DEFAULT') {
                insertStmt = insertStmt + ` ${item},`
            }
            else if (typeof item === 'string') {
                insertStmt = insertStmt + ` '${item}',`
            } else {
                insertStmt = insertStmt + ` ${item},`
            }
        }
        insertStmt = insertStmt.replace(/.$/, "");
        return `${queryPart1} (${keys}) VALUES (${insertStmt});`;
    }

    public insertJSONArrayInDB(table: string, data: any[]) {
        const queryPart1 = `INSERT INTO ${table} VALUES (`;
        let insertStmt = ``;
        for (const item of data) {
            if (item === 'DEFAULT') {
                insertStmt = insertStmt + ` ${item},`
            }
            else if (typeof item === 'string') {
                insertStmt = insertStmt + ` '${item}',`
            } else {
                insertStmt = insertStmt + ` ${item},`
            }
        }
        return `${queryPart1}${insertStmt});`;
    }

}

export class AppDatabaseMigrationManager extends LoggerBase {
    private static instance: AppDatabaseMigrationManager;

    public static get shared(): AppDatabaseMigrationManager {
        return this.instance || (this.instance = new this());
    }

    private async _revert(con: Connection, count: number): Promise<any> {
        if (count == 0) {
            AppDatabaseMigrationManager.logger.info('Revert Migration [DONE]');
            return;
        } else {
            try {
                AppDatabaseMigrationManager.logger.info(`_revert | Reverting migration ${count}`);
                await con.undoLastMigration({ transaction: true});
            } catch (excp) {
                AppDatabaseMigrationManager.logger.error(`_revert | Exception received while running revert migration => ${count}: ${excp}`);
            }
            return this._revert(con, (count - 1));
        }
    }

    public async revert(connection: Connection) {
        try {
            const result = await connection.query(`SELECT COUNT(*) FROM ${dbConfig.migrationsTableName}`)
            AppDatabaseMigrationManager.logger.info(`revert | Migration count: ${JSON.stringify(result)}`);
            if (result[0].count > 0) {
                await this._revert(connection, parseInt(result[0].count));
            } else {
                AppDatabaseMigrationManager.logger.info('No migration to revert');
            }
            return;
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`revert | Exception received while running revert migrations: ${excp}`);
        }
    } 

    public async refresh(): Promise<void> {
        try {
            const connection: Connection = await createConnection(dbConfig);
            await this.revert(connection);
            await connection.runMigrations({transaction: true});
            await connection.close();
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`revert | Exception received while refresh database: ${excp}`);
        }
    }

    public async migrate(): Promise<void> {
        try {
            const connection: Connection = await createConnection(dbConfig);
            await connection.runMigrations({transaction: true});
            await connection.close();
        } catch (excp) {
            AppDatabaseMigrationManager.logger.error(`revert | Exception received while refresh database: ${excp}`);
        }
    }
}

