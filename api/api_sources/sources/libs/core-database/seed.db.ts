import * as _ from 'underscore';
import * as moment from 'moment';
import { getCSVDataFilePath } from '../core-database/schema.csv.loader';
import { SeedOptions } from './application.table';
import { GenericCSV, unWrap } from '../utilities';
import { BaseSchema } from './baseSchema';
import { controllerForSchemaName } from './schema.storage';
import { BaseDataController } from './base.data.controller';
import AppConfig from '../../AppConfig';
import { User } from '../../database/models';

export class SeedRunner {
    public static async seedDb(schemaName: string, schema: BaseSchema, tag: string, options: SeedOptions, creator: User) {
        const isImported = await this.checkSeedStatus(tag);

        // Skip if the seed file is imported already
        if (isImported) {
            console.log(`[SEED - ${schemaName}]: IMPORTED ALREADY`);
            return;
        }

        const currentEnv = AppConfig.getCurrentEnv();
        const environmentsToSeed = options.environments || [];
        environmentsToSeed.push('local');

        // Seed the data only if the current environment is either local or included in options
        if (environmentsToSeed.includes(currentEnv)) {
            console.log(`[SEED - ${schemaName}]: IN PROGRESS`);
            try {
                const csv = new GenericCSV(getCSVDataFilePath(options.fileName));
                const csvData = await csv.load();

                if (csvData.length > 0) {
                    // Mapping data to match the schema
                    const mappedData = await this.mapDataWithSchema(schema, csvData, creator, options);

                    // Store the mapped data into the database
                    await this.storeDataIntoDB(schemaName, mappedData, creator);

                    // Add an entry to the seed table for this seed operation
                    await this.updateSeedTable(schemaName, tag, creator);

                    console.log(`[SEED - ${schemaName}]: SUCCESS`);
                } else {
                    console.log(`[SEED - ${schemaName}]: NO DATA TO SEED`);
                }
            } catch (err) {
                console.log(`[SEED - ${schemaName}]: FAILED`);
                throw err;
            }
        } else {
            console.log(`[SEED - ${schemaName}]: SKIPPED FOR CURRENT ENVIRONMENT`);
        }
    }

    static async checkSeedStatus(tag: string): Promise<boolean> {
        const con: BaseDataController = await controllerForSchemaName('SeedSchema');
        if (con) {
            const existingSeed = await con.fetchOne({ reference: tag });
            return !!existingSeed;
        } else {
            throw new Error(`Controller not defined for schema: SeedSchema`);
        }
    }

    static async updateSeedTable(seedTarget: string, reference: string, creator: User) {
        const con: BaseDataController = await controllerForSchemaName('SeedSchema');
        const data = {
            seedTarget,
            reference
        };

        if (con) {
            con.createNewObject(data, creator);
        } else {
            throw new Error(`Controller not defined for schema: SeedSchema`);
        }
    }

    public static async storeDataIntoDB(schemaName: string, mappedData: any[], creator: User) {
        const con: BaseDataController = await controllerForSchemaName(schemaName);

        if (con) {
            for (const data of mappedData) {
                await con.createNewObject(data, creator);
            }
        } else {
            throw new Error(`Controller not defined for schema: ${schemaName}`);
        }

    }

    public static async mapDataWithSchema(schema: BaseSchema, data: any[], creator: User, options?: SeedOptions) {
        const columns = schema.table.columnsDefinition;
        const mappedData: any[] = [];

        for (const record of data) {
            const dataObj: any = {};
            const recordObj: any = { ...record };

            // Removing the columns specified in the options
            if (options && options.allColumnsExcept) {
                for (const key of options.allColumnsExcept) {
                    delete recordObj[key];
                }
            }

            // Mapping the columns with a different name mentioned in the options
            if (options && options.mapper) {
                _.each(options.mapper, (newKey: any, key: string) => {
                    if (key in recordObj) {
                        recordObj[newKey] = recordObj[key];
                        delete recordObj[key];
                    }
                });
            }

            // Grouping the fields mentioned in the options
            if (options && options.groupFields) {
                for (const group of options.groupFields) {
                    const groupKey = group.key;
                    const fields = group.fields;

                    _.each(fields, (newKey: any, key: string) => {
                        if (key in recordObj) {
                            recordObj[groupKey] = {
                                ...recordObj[groupKey],
                                [newKey]: recordObj[key]
                            };
                            delete recordObj[key];
                        }
                    });
                }
            }

            for (const key in recordObj) {
                if (recordObj.hasOwnProperty(key)) {
                    const value = recordObj[key];
                    for (const field in columns) {
                        if (columns.hasOwnProperty(field)) {
                            const columnData = columns[field];

                            if (key === columnData.name || key === field) {
                                if (columnData.refSchema && typeof +value === typeof 1) {
                                    const con: BaseDataController = controllerForSchemaName(columnData.refSchema);

                                    if (con) {
                                        if (unWrap(columnData.meta, {}).embedded) {
                                            switch (field) {
                                                case 'spaceGeom':
                                                    const spaceGeomObj = await con.schemaDataMapper(value);
                                                    dataObj[field] = await con.createNewObject(spaceGeomObj, creator);
                                                    break;
                                                default:
                                                    throw new Error('Embedded column needs to be handled');
                                            }
                                        } else {
                                            dataObj[field] = +value;
                                        }
                                    } else {
                                        throw new Error(`No controller defined for the schema: ${columnData.refSchema}`);
                                    }
                                } else if (columnData.definition && typeof value === typeof '1') {
                                    const columnType = columnData.definition.split(' ')[0];
                                    switch (columnType) {
                                        case 'BOOLEAN':
                                            dataObj[field] = (value.toLowerCase() === 'true');
                                            break;
                                        case 'INT':
                                            dataObj[field] = parseInt(value, 10);
                                            break;
                                        case 'DATE':
                                            dataObj[field] = moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD');
                                            break;
                                        default: dataObj[field] = value;
                                    }
                                } else {
                                    dataObj[field] = value;
                                }
                            }
                        }
                    }
                }
            }

            mappedData.push(dataObj);
        }

        return mappedData;
    }
}
