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
 * File: create.schema.ts
 * Project: lucy
 * File Created: Thursday, 14th November 2019 1:31:14 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 14th November 2019 1:31:23 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import * as fs from 'fs';
import * as minimist from 'minimist';
import * as _ from 'underscore';
import { reverseCapitalize, yaml, camelToSnakeCase, saveYaml, unWrap } from '../sources/libs/utilities';
import { getYAMLFilePath } from '../sources/libs/core-database';

const printUsage = () => {
    console.log(`node/ts-node script -s #SchemaName (or --schema=#name)`);
    console.log(`node/ts-node script -s #SchemaName -f #filename (or --schema=#name) (or --file=#fileName)`);
    console.log(`node/ts-node script -s #SchemaName -f #filename  -n(optional, to force create new file) (or --schema=#name) (or --file=#fileName)`);
};

/**
 * Script method
 */
(() => {
    // Get options
    const options: any = minimist(process.argv.slice(2));
    _.each(options, (o: any, k: string) => {
        if (k !== '_' && o instanceof Array) {
            console.log(`You have entered more than one same option [${k}: ${o}]`);
            printUsage();
            process.exit(0);
        }
    });
    // Get Schema name in option -s --schema
    let schemaName: string = options.schema || options.s;
    if (!schemaName) {
        console.log(`Please provide schema name.`);
        printUsage();
        process.exit(0);
        return;
    }
    if (schemaName.includes('Schema')) {
        schemaName = schemaName.split('Schema')[0];
    }
    // Class name
    const schemaClassName = `${schemaName}Schema`;
    // Table name
    const tableName = camelToSnakeCase(schemaName);
    // Get file name
    const fileName = unWrap(options.file, '') || unWrap(options.f, '') || reverseCapitalize(`${schemaName}.schema.yaml`);

    // Load file if exists
    // Get file path
    const filePath = getYAMLFilePath(fileName);
    let existing: any = {
        version: '1.0',
        description: `Schema file for table ${tableName}`,
        externalTables: [],
        includes: [],
        schemas: {}
    };
    let isExists = false;
    if (fs.existsSync(filePath)) {
        isExists = true;
        existing = yaml(filePath);
        // Parsing basic schema info
        if (!existing.schemas) {
            console.log(`Unable to parse existing schema file: ${fileName}`);
            printUsage();
            process.exit(0);
            return;
        }
        // Checking schema with same name exists or not
        if (existing.schemas[schemaClassName]) {
            console.log(`Schema exists on ${fileName}, please check the file`);
            printUsage();
            process.exit(0);
            return;
        }
        console.log(`Updating existing file ${fileName}`);
    }

    // Create Schema obj
    const schemaObj = {
        name: tableName,
        description: '#Add description of the table',
        meta: {},
        displayLayout: {},
        layout: {},
        computedFields: {},
        relations: {},
        columns: {
            id: {
                name: `${tableName}_id`,
                comment: 'Auto generated sequential primary key column.',
                definition: 'SERIAL PRIMARY KEY'
            }
        },
        versions: [],
        fields: {}
    };
    // Add data to existing
    existing.schemas[schemaClassName] = schemaObj;
    let savedFileName = fileName;
    if ((options.n || options.new) && isExists) {
        // Save to new file path
        const newFileName = `${reverseCapitalize(schemaName)}.${Date.now()}.schema.yaml`;
        const newFilePath = getYAMLFilePath(newFileName);
        saveYaml(existing, newFilePath, { skipInvalid: true});
        savedFileName = newFileName;
    } else {
        // Save yaml
        saveYaml(existing, filePath,  { skipInvalid: true});
    }
    // Logging
    console.log(`** Saved Schema: ${schemaName}`);
    console.log(`** Schema File: ${savedFileName}`);
    console.log(`** New schema class name: ${schemaClassName}`);
    console.log(`** Table name: ${tableName}`);
})();
// -------------------------------------
