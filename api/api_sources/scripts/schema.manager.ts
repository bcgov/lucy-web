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
 * File: schema.manager.ts
 * Project: lucy
 * File Created: Monday, 22nd July 2019 2:18:25 pm
 * Author: pushan
 * -----
 * Last Modified: Monday, 22nd July 2019 3:50:03 pm
 * Modified By: pushan
 * -----
 */
import * as _ from 'underscore';
import * as minimist from 'minimist';
import * as schema from '../sources/database/database-schema';
import { arrayToString, unWrap } from '../sources/libs/utilities';
import { modelClassCreator } from './schema.model.gen';
import { BaseSchema, SchemaHelper } from '../sources/libs/core-database';
import { SchemaCSVLoader } from '../sources/libs/core-database/schema.csv.loader';


/**
 * @description Script options
 */
interface OptionInfo {
    name: string;
    alias: string[];
    expected: string[];
    required: boolean;
    description: string;
}

/**
 * @description Print Option usage
 * @param OptionInfo option
 * @param string value Value entered in options
 */
const usage = (option: OptionInfo, value?: string) => {
    let usageString = `Usage: option: ${option.name}\n ** Description: ${option.description}`;
    usageString = usageString + `\n ** expected values: [${arrayToString(option.expected)}]`;
    if (value) {
        usageString = usageString + `\n ** WRONG INPUT = ${value}`;
    }
    usageString = usageString + `\n ** alias: [${arrayToString(option.alias)}]`;
    usageString = usageString + `\n ** example: --${option.name}=${option.expected[0] || null}`;
    console.log(usageString);
};


const optionCheck = async (options: any, option: OptionInfo, handler: (value: string) => void) => {
    const allNames = option.alias.concat(option.name);
    // console.dir(options);
    // console.dir(allNames);
    const check = Object.keys(options).filter(k => allNames.includes(k));
    let success = false;
    if (check) {
        let value = options[option.name];
        if (!value) {
            _.each(option.alias, (alias) => (value = options[alias]));
        }
        if (value) {
            if (option.expected.length > 0) {
                if (!option.expected.includes(value)) {
                    usage(option, value);
                    return;
                }
            }
            await handler(value);
            success = true;
        }
    }

    if (!success && option.required === true) {
        usage(option);
    }
};

const manageSchema = async (schemaObj: BaseSchema, options: any) => {
    let report: any = SchemaHelper.shared.createMigrationFiles(schemaObj);
    let requireModelUpdate = false;
    const printVersionReport = (r: any, key: string) => {
        console.log(`*** Schema Version => ${key}`);
        console.log(`*** SQL File Name => ${r.migrationFilePath}`);
        console.log(`*** Is new root migration file created?  => ${unWrap(r.createNew, false)}`);
        console.log(`*** Is existing migration file updated? => ${unWrap(r.updateExisting, false)} `);
        console.log(`*** Comment on root migration: ${r.comment}`);
    };
    console.log(`*** Report on ${schemaObj.className}`);
    printVersionReport(report.rootVersion, 'root');
    _.each(report.versions, (r, k: string) => printVersionReport(r, k));
    requireModelUpdate = report.requireDataModelUpdate;
    console.log(`*** Schema Need Class Update => ${requireModelUpdate}`);
    report = SchemaHelper.shared.createRevertMigrationFiles(schemaObj);
    console.log(`*** Revert Migration Classes`);
    if (Object.keys(report.versions).length > 0) {
        _.each(report.versions, (r, k: string) => printVersionReport(r, k));
    } else {
        console.log(`*** None`);
    }
    if ((requireModelUpdate && !options['ignore-model']) || options['update-model']) {
        console.log(`*** Require Model Update for schema`);
        console.log(`*** Model Name => ${schemaObj.modelName}`);
        const r = modelClassCreator(schemaObj);
        console.log(`*** Model File Creation Details`);
        console.dir(r);
    }

    // Create import sql files
    const reports: any[] = await SchemaCSVLoader.shared.createImportMigrations(schemaObj);
    for (const r of reports) {
        console.log(`********* Import: ${r.importName}`);
        console.log(`*** Import SQL File Name: ${r.sqlFileName}`);
        console.log(`*** Import CSV File Name: ${r.csvFile}`);
        console.log(`*** Import Action: ${r.comment}`);
    }
};

/**
 * @description Script Method
 */
(() => {
    const options = minimist(process.argv.slice(2));
    const scriptOptions: OptionInfo[] = [
        {
            name: 'schema',
            alias: ['s'],
            expected: [],
            required: true,
            description: 'Name of the schema',
        },
        {
            name: 'manage',
            alias: ['m'],
            expected: [],
            required: false,
            description: 'Manage schema'
        },
        {
            name: 'migration',
            alias: ['mg'],
            expected: ['yes', 'y', 'Y', 'YES'],
            required: false,
            description: 'Create Migration File'
        },
        {
            name: 'data',
            alias: ['d'],
            expected: ['yes', 'y', 'Y', 'YES'],
            required: false,
            description: 'Create Data Entry SQL'
        },
        {
            name: 'dataFile',
            alias: ['df', 'data-file'],
            expected: [],
            required: false,
            description: 'Data Entry file path'
        },
        {
            name: 'entryString',
            alias: ['es', 'entry-string'],
            expected: [],
            required: false,
            description: 'Column name for data entry'
        },
        {
            name: 'createModel',
            alias: ['cm', 'create-model', 'model'],
            expected: ['y', 'YES', 'Y', 'yes'],
            required: false,
            description: 'Create Data Model for Schema'
        },
        {
            name: 'modelName',
            alias: ['mn', 'model-name'],
            expected: [],
            required: false,
            description: 'Model Class name'
        }
    ];
    let schemaClass: any;
    optionCheck(options, scriptOptions[0], (value: string) => {
        schemaClass = schema[value];
        if (!schemaClass) {
            usage(scriptOptions[0], value);
        } else {
            console.log(`Processing schema=${value} ...`);
        }
    });
    if (schemaClass) {
        const schemaObj = new schemaClass();
        _.each(scriptOptions, (info: OptionInfo) => optionCheck(options, info, (value: string) => {
            if (info.name === 'name') {
                return;
            } else {
                switch (info.name) {
                    case 'migration':
                        console.log('Creating migration file...');
                        schemaObj.createMigrationFile();
                        break;
                    case 'manage':
                        console.log('Managing schema');
                        manageSchema(schemaObj, options);
                        break;
                    case 'data':
                        let entryString;
                        optionCheck(options, scriptOptions[4], es => (entryString = es));
                        if (entryString) {
                            console.log(`Creating Data Entry SQL for columns: ${entryString}...`);
                            schemaObj.createDataEntry(entryString);
                        } else {
                            console.log('Creating Data Entry SQL...');
                            schemaObj.createDataEntry();
                        }
                        break;
                    case 'createModel':
                        let clsName;
                        console.log('Creating Data Model Class...');
                        optionCheck(options, scriptOptions[6], cn => (clsName = cn));
                        console.log(`Using Model Name: ${clsName || 'default'}`);
                        modelClassCreator(schemaObj, clsName);
                        break;
                }
            }
        }));
    }
})();

