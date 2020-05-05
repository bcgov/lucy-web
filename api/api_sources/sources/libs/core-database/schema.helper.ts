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
 * File: schema.helper.ts
 * Project: lucy
 * File Created: Tuesday, 22nd October 2019 2:53:17 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:53:23 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as fs from 'fs';
import * as _ from 'underscore';
import { ApplicationTableColumn } from './application.column';
import { TableVersion, SchemaChangeDefinition, ColumnChangeType, SqlInfo } from './application.table';
import { BaseSchema } from './baseSchema';
import { getSQLDirPath, getSQLFileData } from './sql.loader';

/**
 * @description Storing Version migration file info
 */
interface SchemaVersionMigrationFileInfo {
    fileName: string;
    fileContent: string;
    filePath: string;
}

/**
 * @description Storing All sql file related to schema
 */
interface SchemaSQLFileInfo {
    migrations: {[key: string]: string};
    revertMigrations: {[key: string]: string};
    allFiles: string[];
}

/**
 * @description Generate Version SQL file for schema
 */
export class SchemaHelper {
    /**
     * Shared instance
     */
    static _instance: SchemaHelper;
    static get shared(): SchemaHelper {
        return this._instance || ( this._instance = new this());
    }

    /**
     * Utilities
     */

    /**
     * @description Generate SQL Stmt for colum
     * @param ApplicationTableColumn col: Table column
     * @param string tableName
     */
    _genColumnDef(col: ApplicationTableColumn, tableName: string): string {
        const colDef = col.createColumnSql(tableName);
        const colComment = `COMMENT ON COLUMN ${tableName}.${col.name} IS '${col.comment}';`;
        return `\n-- ## Adding Column ${col.name} on table ${tableName}\n${colDef}\n${colComment}\n-- ## --\n`;
    }

    /**
     * @description Generate SQL for column change SQL stmt
     * @param ColumnChangeDefinition change
     * @param string tableName
     */
    _genChangeColumn(change: SchemaChangeDefinition, tableName: string): string {
        let result = '';
        let comment = '';
        const existingColumn: ApplicationTableColumn = change.existingColumn;
        if (change.deleteColumn && change.type !== ColumnChangeType.UPDATE) {
            change.type = ColumnChangeType.DROP;
        }
        switch (change.type || ColumnChangeType.KEY_CHANGE) {
            case ColumnChangeType.DROP: {
                // Dropping Column
                comment = `## -- Dropping Column ${existingColumn.name} on table ${tableName} --`;
                const dropCol = existingColumn.dropColumnSql(tableName);
                result = result + `\n${comment}\n${dropCol}\n-- ## --`;

                // Add Down sql
                const newColumn = this._genColumnDef(existingColumn, tableName);
                if (!change.downSqlStatement) {
                    change.downSqlStatement = `## -- Down Migration: Adding column back --\n${newColumn}`;
                }
                break;
            }
            case ColumnChangeType.RENAME: {
                if (change.newColumnName) {
                    comment = `-- ## Renaming Column ${existingColumn.name} on table ${tableName} --`;
                    const rename = `ALTER TABLE ${tableName} RENAME ${existingColumn.name} TO ${change.newColumnName};`;
                    result = result + `\n${comment}\n${rename}\n-- ## --`;
                    if (!change.downSqlStatement) {
                        change.downSqlStatement = `ALTER TABLE ${tableName} RENAME ${change.newColumnName} TO ${existingColumn.name}`;
                    }
                }
                break;
            }
            case ColumnChangeType.UPDATE: {
                if (change.column && existingColumn) {
                    const newDef = change.column;
                    comment = `-- ## Updating existing column ${existingColumn.name} on table ${tableName} --\n`;
                    if (change.deleteColumn) {
                        comment  = comment + `-- ## First Deleting existing column ${existingColumn.name} --\n`;
                        result = result + `${comment}${existingColumn.dropColumnSql(tableName)}\n`;
                        // Get new definition
                        result = result + `-- ## Creating new Column Def --`;
                        const newColumn = ApplicationTableColumn.createColumn(newDef);
                        const columnDef = this._genColumnDef(newColumn, tableName);
                        result = result + `${columnDef}`;
                        if (!change.downSqlStatement) {
                            let downSqlStatement = `-- ## Delete existing column --\n`;
                            // Drop new def
                            downSqlStatement = downSqlStatement + `${newColumn.dropColumnSql(tableName)}\n`;
                            // Add back existing
                            downSqlStatement = downSqlStatement + `-- ## Add previous version --\n`;
                            downSqlStatement = downSqlStatement + `${this._genColumnDef(existingColumn, tableName)}`;
                            change.downSqlStatement = downSqlStatement;
                        }
                    } else {
                        comment = comment + `-- ## Updating existing column ${existingColumn.name} --\n`;
                        result = result + `\n${comment}\n${existingColumn.updateColumnSql(tableName, newDef)}\n-- ## --\n`;

                        if (!change.downSqlStatement)  {
                            change.downSqlStatement = existingColumn.updateColumnSql(tableName, existingColumn);
                        }
                    }

                }
                break;
            }
        }

        if (change.sqlStatement) {
            comment = `-- ## Adding Custom Change SQL Statement -- ##`;
            result = `\n${comment}\n${change.sqlStatement};\n-- ## --` + result;
        }
        return result;
    }

     /**
     * @description Generate SQL for column change revert
     * @param ColumnChangeDefinition change
     * @param string tableName
     */
    _downChangeColumn(change: SchemaChangeDefinition, tableName: string) {
        if (change.downSqlStatement) {
            return `-- ## Reverting changes --\n${change.downSqlStatement};\n--  ## --`;
        } else {
            return `-- ## No Revert Changes for ${change.existingKey} and ${change.type} ## --`;
        }
    }

    /**
     * @description Generating Migration SQL for whole version
     * @param TableVersion version
     * @param string tableName
     */
    _genVersionMigration(version: TableVersion, tableName: string): string {
        const header = `-- ## Changing table: ${tableName}\n-- ## Version: ${version.name}\n-- ## Info: ${version.info || 'None'}`;
        let newColumns = `\n-- ## Adding New Columns ## --`;
        _.each(version.columns, (col: ApplicationTableColumn) => {
            newColumns = newColumns + `\n${this._genColumnDef(col, tableName)}`;
        });
        newColumns = newColumns + '\n';
        let changes = `\n-- ## Updating ${tableName} ## --`;
        _.each(version.schemaChanges, (change: SchemaChangeDefinition) => {
            changes = changes + `\n${this._genChangeColumn(change, tableName)}`;
        });
        changes = changes + '\n';

        return `${header}${newColumns}${changes}`;
    }

    /**
     * @description Generating Revert Migration SQL for whole version
     * @param TableVersion version
     * @param string tableName
     */
    _genVersionRevertMigration(version: TableVersion, tableName: string) {
        const header = `-- ## Reverting table: ${tableName}\n-- ## Version: ${version.name}\n-- ## Info: ${version.info || 'None'}`;
        let newColumns = `\n-- ## Removing New Columns ## --`;
        _.each(version.columns, (col: ApplicationTableColumn) => {
            newColumns = newColumns + `\n${col.dropColumnSql(tableName)}`;
        });
        newColumns = newColumns + '\n';
        let changes = `\n-- ## Updating ${tableName} ## --`;
        _.each(version.schemaChanges, (change: SchemaChangeDefinition) => {
            changes = changes + `\n${this._downChangeColumn(change, tableName)}`;
        });
        changes = changes + '\n';

        return `${header}${newColumns}${changes}`;
    }

    /**
     * @description Get sql file name for version
     * @param BaseSchema schema
     * @param string ver
     */
    _versionFileName(schema: BaseSchema, ver: TableVersion) {
        return `${schema.className}-${ver.fileName}.up.sql`;
    }

    /**
     * @description Get revert migration sql file name for version
     * @param BaseSchema schema
     * @param string ver
     */
    _versionRevertMigrationFileName(schema: BaseSchema, ver: TableVersion) {
        return `${schema.className}-${ver.fileName}.down.sql`;
    }

    /**
     * @description Get migration sql file path for version
     * @param BaseSchema schema
     * @param string ver
     */
    _versionMigrationFilePath(schema: BaseSchema, ver: TableVersion) {
        return `${getSQLDirPath()}/${schema.className}/${this._versionFileName(schema, ver)}`;
    }

    /**
     * @description Get revert migration sql file path for version
     * @param BaseSchema schema
     * @param string ver
     */
    _versionRevertMigrationFilePath(schema: BaseSchema, ver: TableVersion) {
        return `${getSQLDirPath()}/${schema.className}/${this._versionRevertMigrationFileName(schema, ver)}`;
    }

    /**
     * @description Info for migration sql file for version
     * @param BaseSchema schema
     * @param string ver
     */
    versionMigrationInfo(schema: BaseSchema, version: TableVersion): SchemaVersionMigrationFileInfo {
        // Migration File Name
        const migrationFileName = this._versionFileName(schema, version);

        // Migration File data
        const fileContent: string = this._genVersionMigration(version, schema.tableName);

        return {
            fileName: migrationFileName,
            filePath: this._versionMigrationFilePath(schema, version),
            fileContent: fileContent
        };
    }

    /**
     * @description Info for revert migration sql file for version
     * @param BaseSchema schema
     * @param string ver
     */
    versionRevertMigrationInfo(schema: BaseSchema, version: TableVersion): SchemaVersionMigrationFileInfo {
        return {
            fileName: this._versionRevertMigrationFileName(schema, version),
            filePath: this._versionRevertMigrationFilePath(schema, version),
            fileContent: this._genVersionRevertMigration(version, schema.tableName)
        };
    }

    /**
     * @description Write to filePath. Skip whole process if dryRun set true. Also delete existing if flag is set
     * @param string path
     * @param any content
     * @param boolean dryRun default true
     * @param boolean deleteExisting optional
     */
    _write(path: string, content: any, dryRun: boolean = false, deleteExisting?: boolean) {
        if (!dryRun) {
            if (deleteExisting) {
                fs.unlinkSync(path);
            }
            fs.writeFileSync(path, content, {
                flag: 'w',
                encoding: 'utf8'
            });
        }
    }


    private _genInitialSql(schema: BaseSchema, columnDef: string) {
        if (schema.table.initialSqlCommands.length > 0) {
            let after = '';
            let before = '';
            const update = (target: string, sqlInfo: SqlInfo) => {
                target = target + `\n-- ${sqlInfo.comment || 'SQL'} --`;
                target = target + `\n${sqlInfo.sql};\n`;
                return target;
            };
            for (const sqlInfo of schema.table.initialSqlCommands) {
                if (sqlInfo.before) {
                    before = update(before, sqlInfo);
                } else {
                    after = update(after, sqlInfo);
                }
            }
            return `${before}${columnDef}\n${after}`;
        }
        return columnDef;
    }

    /**
     * @description Generate set of migration file for schema
     * @param BaseSchema schema
     * @param boolean dryRun optional
     */
    createMigrationFiles(schema: BaseSchema, dryRun?: boolean) {
        // Report
        const report = {
            rootVersion: {},
            versions: {},
            requireDataModelUpdate: false
        };

        // Check and create root or main migration file
        const migrationFilePath: string = schema.migrationFilePath();

        // Current root version
        const columDef = schema.createMigrationFile(undefined, true);
        // Now add additional sql
        const current = this._genInitialSql(schema, columDef);
        // Check item exists on migration file path or not
        if (fs.existsSync(migrationFilePath)) {
            // Match both content
            const existing = schema.migrationSQL;
            if (existing !== current) {
                // Remove existing and update with current
                this._write(migrationFilePath, current, dryRun, true);
                report.rootVersion = {
                    migrationFilePath: migrationFilePath,
                    updateExisting: true,
                    comment: 'Updating Root Migration file for Schema'
                };
                report.requireDataModelUpdate = true;
            } else {
                report.rootVersion = {
                    migrationFilePath: migrationFilePath,
                    updateExisting: false,
                    comment: 'Current Migration file is same as last one'
                };
            }
        } else {
            this._write(migrationFilePath, current, dryRun, false);
            report.rootVersion = {
                migrationFilePath: migrationFilePath,
                updateExisting: false,
                createNew: true,
                comment: 'Create a new migration file'
            };
            report.requireDataModelUpdate = true;
        }

        // Now check each version and create or update sql file
        _.each(schema.table.versions, (version: TableVersion) => {
            // Get existing version info
            const info = this.versionMigrationInfo(schema, version);

            // Check sql file exists
            if (fs.existsSync(info.filePath)) {

                // Check existing version file content
                const existing = getSQLFileData(info.fileName, schema.className);
                if (existing !== info.fileContent) {
                    this._write(info.filePath, info.fileContent, dryRun, true);

                    report.versions[version.name] = {
                        migrationFilePath: info.filePath,
                        updateExisting: true,
                        comment: 'Update existing migration file'
                    };
                    report.requireDataModelUpdate = true;
                } else {
                    report.versions[version.name] = {
                        migrationFilePath: info.filePath,
                        updateExisting: false,
                        comment: 'Current migration file is same as last one'
                    };
                }

            } else {
                // Create Version SQL file
                this._write(info.filePath, info.fileContent, dryRun, false);
                report.requireDataModelUpdate = true;
                report.versions[version.name] = {
                    migrationFilePath: info.filePath,
                    createNew: true,
                    comment: 'Create new migration file for content'
                };
            }
        });
        return report;
    }

    /**
     * @description Generate set of revet migration file for schema
     * @param BaseSchema schema
     * @param boolean dryRun optional
     */
    createRevertMigrationFiles(schema: BaseSchema, dryRun?: boolean) {
        // Report
        const report = {
            versions: {}
        };

        // Check each version revert migration file
        _.each(schema.table.versions, (version: TableVersion) => {
            const info = this.versionRevertMigrationInfo(schema, version);
            this._write(info.filePath, info.fileContent, dryRun);
            report.versions[version.name] = {
                migrationFilePath: info.filePath,
                comment: 'Revert migration file'
            };
        });

        return report;
    }

    /**
     * @description Getting all sql file grouped related to table schema
     * @param BaseSchema schema
     */
    allSqlFiles(schema: BaseSchema): SchemaSQLFileInfo {
        const result: SchemaSQLFileInfo = {
            migrations: {},
            revertMigrations: {},
            allFiles: []
        };

        result.allFiles.push(schema.migrationFilePath());
        result.migrations.root = schema.className;

        _.each(schema.table.versions, (version: TableVersion) => {
            // File for version
            const mg =  this._versionMigrationFilePath(schema, version);
            result.migrations[version.name] = this._versionFileName(schema, version);
            result.allFiles.push(mg);
            const rmg = this._versionRevertMigrationFilePath(schema, version);
            result.revertMigrations[version.name] = this._versionRevertMigrationFileName(schema, version);
            result.allFiles.push(rmg);
        });

        return result;
    }

    /**
     * @description Remove all migration file generated by schema
     * @param BaseSchema schema
     * @param boolean dryRun
     */
    removeAllMigrationFile (schema: BaseSchema, dryRun?: boolean) {
        if (!dryRun) {
            fs.unlinkSync(schema.sqlFileDir);
        }
        return true;
    }

    // Get all migration file name
    /**
     * @description Get all migration file name
     * @param BaseSchema schema
     */
    migrationFiles(schema: BaseSchema): {[key: string]: string} {
        return this.allSqlFiles(schema).migrations;
    }

    /**
     * @description Get all revert migration file name
     * @param BaseSchema schema
     */
    revertMigrationFiles(schema: BaseSchema): {[key: string]: string} {
        return this.allSqlFiles(schema).revertMigrations;
    }

    // Get version migration and revert migration
    versionMigrationFileName(schema: BaseSchema, version: TableVersion) {
        return this._versionFileName(schema, version);
    }

    versionRevertMigrationFileName(schema: BaseSchema, version: TableVersion) {
        return this._versionRevertMigrationFileName(schema, version);
    }
}
// ----------------------
