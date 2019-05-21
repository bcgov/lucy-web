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
            keys = keys + `${k},`;
        }
        keys = keys.replace(/.$/, "");
        for (const key in data) {
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

