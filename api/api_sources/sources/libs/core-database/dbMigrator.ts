/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: dbMigrator.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 11:15:54 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 1st November 2019 11:19:11 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import { BaseSchema } from './baseSchema';
import { TableVersion } from './application.table';
import { SchemaHelper } from './schema.helper';
import { SchemaCSVLoader } from './schema.csv.loader';
import { getSQLFileData } from './sql.loader';

/**
 * @description Interface to invoke sql query.
 */
export interface SQLQueryRunner {
    query(sql: string): Promise<any>;
}
export class DBMigrator {
    private upMigrationFiles: Set<[string, string]> = new Set<[string, string]>();
    private downMigrationFiles: Set<[string, string]> = new Set<[string, string]>();
    private importMigrationFiles: Set<[string, string]> = new Set<[string, string]>();

    /**
     * Constructor
     */
    constructor() {
        this.setup();
    }

    /**
     * className
     * @description Class name
     */
    public get className(): string {
        return this.constructor.name;
    }

    /**
     * Props
     */
    upMigrations(): [string, string][] {
        return Array.from(this.upMigrationFiles);
    }

    downMigrations(): [string, string][] {
        return Array.from(this.downMigrationFiles);
    }

    importMigrations(): [string, string] [] {
        return Array.from(this.importMigrationFiles);
    }

    addSchemaInitVersion(schema: BaseSchema) {
        this.upMigrationFiles.add([`${schema.className}.sql`, schema.className]);
    }

    addUpMigration(dir: string, file: string) {
        this.upMigrationFiles.add([file, dir]);
    }

    addDownMigration(dir: string, file: string) {
        this.downMigrationFiles.add([file, dir]);
    }

    /**
     * @description Adding version info for migrator
     * @param BaseSchema schema
     * @param string | number version
     */
    addSchemaVersion(schema: BaseSchema, version: string | number) {
        // Get version
        const v: TableVersion = schema.table.getVersion(version);
        if (v) {
            this.upMigrationFiles.add([SchemaHelper.shared.versionMigrationFileName(schema, v), schema.className]);
            this.downMigrationFiles.add([SchemaHelper.shared.versionRevertMigrationFileName(schema, v), schema.className]);
        }
    }

    /**
     * @description Import file names
     * @param BaseSchema schema
     * @param importKey importKey
     */
    addDataImportMigration(schema: BaseSchema, importKey: string) {
        const fileName = SchemaCSVLoader.shared.importMigrationFiles(schema)[importKey];
        if (fileName) {
            this.importMigrationFiles.add([fileName, schema.className]);
        }
    }

    /**
     * @description Check sql file is handled by migrator or not
     * @param string file
     * @param string dir
     */
    isSQLFileHandled(file: string, dir: string) {
        return this._checkHandelFile(this.upMigrations(), [file, dir]) ||
        this._checkHandelFile(this.downMigrations(), [file, dir]) || this._checkHandelFile(this.importMigrations(), [file, dir]);
    }

    /**
     * @description Run array of sql files
     * @param [string, string] files (tuple)
     * @param SQLQueryRunner queryRunner (interface to run sql query)
     */
    async runQuerySqlFiles(files: [string, string][], queryRunner: SQLQueryRunner, dryRun?: boolean): Promise<any[]> {
        const results: any[] = [];
        for (const file of files) {
            const fileName = file[0];
            const dir = file[1];
            let query = '';
            if (!dryRun) {
                query = getSQLFileData(fileName, dir);
            }
            results.push(await queryRunner.query(query));
            this.log(`Migrate File => ${dir}/${fileName}`, 'runQuerySqlFiles');
        }
        return results;
    }

    processSQLString(query: string) {
        const lines: string[] = query.split('\n');
        const sqlLines: string[] = lines.filter( l => !l.startsWith('--'));
        let newStr = ``;
        for (const l of sqlLines) {
            newStr = newStr + l + '\n';
        }
        return newStr;
    }

    async runSQLFileAsync(files: [string, string][], queryRunner: SQLQueryRunner, dryRun?: boolean) {
        const results: any[] = [];
        for (const file of files) {
            const fileName = file[0];
            const dir = file[1];
            let query = '';
            if (!dryRun) {
                query = getSQLFileData(fileName, dir);
                query = this.processSQLString(query);
                // Get each line
                const lines: string[] = query.split(';\n');
                // Remove last element
                lines.pop();
                for (const l of lines) {
                    try {
                        results.push(await queryRunner.query(`${l};`));
                    } catch (excp) {
                        this.log(`FileName: ${fileName},\nFailQuery: ${l}\nExcp: ${excp}`, 'runSQLFileAsync');
                    }
                }
            }
            this.log(`Migrate File => ${dir}/${fileName}`, 'runQuerySqlFiles');
        }
        return results;
    }

    /**
     * @description Subclass to add all migration related info
     */
    setup() {
        throw new Error('DBMigrator: sub-class must implement this methods');
    }

    /**
     * @description Logging migration activity
     * @param string info
     * @param string tag
     */
    log(info: string, tag: string = 'None') {
        console.log(this.getLogString(info, tag));
    }

    /**
     * Private methods
     */
    private getLogString(info: string, tag: string = 'NONE') {
        return `${this.className} | ${tag} | ${info}`;
    }

    private _checkHandelFile(list: [string, string][], input: [string, string]): boolean {
        return list.filter( i => i[0] === input[0] && i[1] === input[1]).length > 0;
    }
}
// -----------------------------------------------------------
