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
 * File: schema.csv.loader.ts
 * Project: lucy
 * File Created: Friday, 25th October 2019 11:16:18 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 25th October 2019 11:16:22 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import * as _ from 'underscore';
import * as path from 'path';
import * as fs from 'fs';
import { BaseSchema } from './baseSchema';
import { CSVImportOptions } from './application.table';
import { arrayToString, CSVFieldTransformer, GenericCSV } from '../utilities';
import { getSQLFilePath, getSQLFileData } from './sql.loader';
import { SchemaHelper } from './schema.helper';

/**
 * CSV File Resources Utilities
 */
/**
 * CSV Root DIR
 */
const csvDirName = 'resources/csv';

/**
 * @description Get full file path for csv file
 * @param string fileName
 */
export const getCSVDataFilePath = (fileName: string) => path.resolve(__dirname, `../../../${csvDirName}/${fileName}`);

/**
 * @description Get csv file data
 * @param string fileName
 */
export const getCSVFileData = (fileName: string) => fs.readFileSync(getCSVDataFilePath(fileName), 'utf8')
;

/**
 * @description CSV Loader for schema
 */
export class SchemaCSVLoader {
    /**
     * Shared instance
     */
    static _instance: SchemaCSVLoader;
    static get shared(): SchemaCSVLoader {
        return this._instance || ( this._instance = new this());
    }

    _validRow(row: any[]) {
        if (row.length === 0) {
            return false;
        }
        let inValidCount = 0;
        for (const item of row) {
            if (item === '' || item === ' ') {
                inValidCount = inValidCount + 1;
                // console.log(`count: ${inValidCount} => ${row.length} => ${arrayToString(row)}`);
            }
        }
        // console.log(`[${arrayToString(row)}]`);
        return (row.length !== inValidCount);
    }
    sqlString(schema: BaseSchema, data: any[], columns: string) {
       // Now Create sql string
       const tableName = schema.tableName;
       const values = data;
       let base = `-- ## Inserting into table: ${tableName} ## --\n`;
       _.each(values, (row, index) => {
           if (!this._validRow(row)) {
               return;
           }
           let rowStr = ``;
           _.each(row, (col) => {
               if (typeof col === 'string' && col !== '') {
                   let strCol: string = col as string;
                   strCol = strCol.trim();
                   if (strCol === 'Y' || strCol === 'y' || strCol === 'YES' || strCol === 'N' || strCol === 'NO') {
                       rowStr = `${rowStr}'${strCol}',`;
                   } else if (strCol.includes(`'`)) {
                       strCol = strCol.replace(/'/gi, `''`);
                       rowStr = `${rowStr}'${strCol}',`;
                   }  else if (strCol.includes(`"`)) {
                       strCol = strCol.replace(/"/gi, `""`);
                       rowStr = `${rowStr}'${strCol}',`;
                   } else {
                       rowStr = `${rowStr}'${strCol}',`;
                   }
               } else {
                   rowStr = `${rowStr}${col}`;
               }
           });
           if (rowStr.length === 0) {
               return;
           }
           base = `${base}-- ## Inserting Item: ${index}  ## --\n`;
           base = `${base}INSERT INTO ${tableName}(${columns})\nVALUES\n`;
           rowStr = rowStr.replace(/.$/, '');
           base = `${base}(${rowStr});\n-- ## End of item: ${index} ## --\n`;
       });
       return base;
    }

    /**
     * Methods
     */
    /**
     * @description Generate Insert sql statements for schema
     * @param BaseSchema schema
     * @param CSVImportOptions options
     */
    async _generateSQL(schema: BaseSchema, options: CSVImportOptions): Promise<string> {
        // Get keys
        let keys: string[] = options.entryColumns;
        const ignoreDataColumns: string[] = options.ignoreDataColumns || [];
        const columnNames: string[] = [];
        // Check keys are present in columnDef
        const schemaKeys: string[] = Object.keys(schema.table.columnsDefinition);

        // Checking entry for all columns or not
        if (options.allColumns) {
            keys = Object.keys(schema.table.columnsDefinition).filter( k => k !== 'id');
        } else if (options.allColumnsExcept) {
            const exceptionColumn: string[] = options.allColumnsExcept || [];
            keys = Object.keys(schema.table.columnsDefinition).filter( k => k !== 'id' && !exceptionColumn.includes(k));
        }

        // Check keys are included or not
        for (const k of keys) {
            if (!schemaKeys.includes(k)) {
                // Throw exception
                // TODO: Check versions for key change
                throw new Error(`schema.csv: ${schema.className}: sql gen: ${k} not included in schema keys => ${arrayToString(schemaKeys)}`);
            }
            // Adding column name in columns
            columnNames.push(schema.table.columns[k]);
        }

        // Load CSV DATA
        // Creating csv utility obj
        const csv = new GenericCSV(getCSVDataFilePath(options.fileName));
        // Get transformer
        let transformer: {[key: string]: CSVFieldTransformer};
        let data: any[];
        if (options.transformer) {
            transformer = schema.csvFieldTransformer[options.transformer];
            data = await csv.load(transformer);
        } else {
            data = await csv.load();
        }

        if (ignoreDataColumns.length) {
            data = data.map(item => {
                for (const key of ignoreDataColumns) {
                    delete item[key];
                }

                return item;
            });
        }

        // Check data
        if (!data || data.length === 0) {
            // Empty Data
            throw new Error(`schema.csv: ${schema.className}: sql data: CSV Data error: ${options.fileName}`);
        }

        // Entry columns
        const columns = arrayToString(columnNames);
        // Now Create sql string
        return this.sqlString(schema, data, columns);
    }

    /**
     * @description Generate file name for csv import
     * @param BaseSchema schema
     * @param string key
     */
    _migrationFileNameForImport(schema: BaseSchema, key: string) {
         return `${schema.className}-${key}.sql`;
    }

     /**
     * @description Generate file path for csv import
     * @param BaseSchema schema
     * @param string key
     */
    _migrationFilePathForImport(schema: BaseSchema, key: string) {
        return getSQLFilePath(this._migrationFileNameForImport(schema, key), schema.className);
    }

    /**
     * @description Generate and save sql migration file for csv import
     * @param BaseSchema schema
     * @param CSVImportOptions options
     * @param string key
     * @param boolean dryRun optional
     */
    async crateMigrationForCSVImport(schema: BaseSchema, options: CSVImportOptions, key: string, dryRun?: boolean) {
        // Get File name
        const sqlFileName = this._migrationFileNameForImport(schema, key);
        // Get SQL Data
        const sql = await this._generateSQL(schema, options);
        // Sql file path
        const filePath = this._migrationFilePathForImport(schema, key);
        // Report
        const report: any = {
            importName: key,
            csvFile: options.fileName,
            sqlFileName: sqlFileName,
            path: filePath,
            comment: '',
            update: false,
            new: false
        };
        // Check file exists or not
        if (fs.existsSync(filePath)) {
            // Read
            const existing = getSQLFileData(sqlFileName, schema.className);
            // Compare
            if (existing !== sql) {
                // Updating
                SchemaHelper.shared._write(filePath, sql, dryRun, true);
                report.comment = 'Updating existing';
                report.update = true;
            } else {
                report.comment = 'Existing is same as current';
            }
        } else {
            // Creating new
            SchemaHelper.shared._write(filePath, sql, dryRun, false);
            report.comment = 'Creating new';
            report.new = true;
        }
        return report;
    }

    /**
     * @description Create migration files for schema
     * @param BaseSchema schema
     * @param dryRun dryRun
     */
    async createImportMigrations(schema: BaseSchema, dryRun?: boolean) {
        // Get all imports
        const csvImports = schema.table.importOptions;
        // Create report array
        const reports: Promise<any>[] = [];
        // Run migration gen for all import options
        _.each(csvImports, async (options: CSVImportOptions, key: string) => {
            reports.push(this.crateMigrationForCSVImport(schema, options, key, dryRun));
        });
        return await Promise.all(reports);
    }

    /**
     * @description Get all migration file name
     * @param BaseSchema schema
     */
    importMigrationFiles(schema: BaseSchema): any {
        const r = {};
        _.each(schema.table.importOptions, (opt, k) => {
            r[k] = this._migrationFileNameForImport(schema, k);
        });
        return r;
    }
}
// ----------------------
