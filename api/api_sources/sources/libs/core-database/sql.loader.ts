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
 * File: sql.loader.ts
 * Project: lucy
 * File Created: Thursday, 3rd October 2019 9:21:09 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 3rd October 2019 9:22:34 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as fs from 'fs';
import * as path from 'path';

const sqlDirPath = 'schema-migration-sql';

/**
 * @description Get SQL dir path
 */
export const getSQLDirPath = () => path.resolve(__dirname, `../../../${sqlDirPath}`);

/**
 * @description Get file actual path
 * @param string fileName: Name of the sql file
 * @param string subPath: Sub dir or Schema Name (sql files for schema stored under schema folder)
 */
export const getSQLFilePath = (fileName: string, subPath?: string) => {
    if (subPath) {
        return path.resolve(__dirname, `../../../${sqlDirPath}/${subPath}/${fileName}`);
    }
    return path.resolve(__dirname, `../../../${sqlDirPath}/${fileName}`);
};

/**
 * @description Get Raw sql string the sql file
 * @param string fileName: Name of the sql file
 * @param string subPath: Sub dir or Schema Name (sql files for schema stored under schema folder)
 */
export const getSQLFileData = (fileName: string, subPath?: string) => {
    if (subPath) {
        // Get path
        const filePath = getSQLFilePath(fileName, subPath);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        } else {
            // Look in main dir
            const mainPath = getSQLFilePath(fileName);
            if (fs.existsSync(mainPath)) {
                // Create Dir
                if (!fs.existsSync(`${getSQLDirPath()}/${subPath}`)) {
                    fs.mkdirSync(`${getSQLDirPath()}/${subPath}`);
                }
                // Copy file to target part
                fs.copyFileSync(mainPath, filePath);
                // Remove file from
                fs.unlinkSync(mainPath);
                return fs.readFileSync(filePath, 'utf8');
            } else {
                throw new Error(`getSQLFileData: ${fileName}: ${subPath}: Item not exists`);
            }
        }
    }
    return fs.readFileSync(getSQLFilePath(fileName), 'utf8');
};
export const sampleSql = (): string => {
    const fileName = 'sample.sql';
    return fs.readFileSync(getSQLFilePath(fileName), 'utf8');
};

// ---------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------
