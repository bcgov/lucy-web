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
 * File: table.exporter.ts
 * Project: lucy
 * File Created: Thursday, 19th March 2020 9:23:35 pm
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Thursday, 19th March 2020 9:23:41 pm
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
import { BaseSchema } from './baseSchema';
import { ApplicationTableColumn } from './application.column';
import { BaseDataController } from './base.data.controller';
import { controllerForSchemaName, schemaWithName } from './schema.storage';
export class TableExporter {
    public static export(schema: BaseSchema, data: any) {
        const result: any = {};
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            if (key === schema.table.columns.id) {
                // Id key
                result['id'] = data[key];
                continue;
            }
            if (schema.table.columnsDefinition[key]) {
                const column: ApplicationTableColumn = schema.table.columnsDefinition[key];
                const meta = column.meta || {};
                // Key type object
                if (typeof data[key] === 'object') {
                    if (column.refSchema) {
                        // Key is foreign ref type
                        // Get controller for schema
                        const con: BaseDataController = controllerForSchemaName(column.refSchema || '');
                        if (meta.embedded) {
                            // Key is embedded colum type
                            if (con) {
                                // Process data further
                                result[key] = con.processForExport(data[key]);
                            } else {
                                // No Controller so use as it is
                                result[key] = data[key];
                            }
                        } else {
                            // Key is code or other table integration
                            result[key] = data[key] !== null ? data[key].displayLabel : 'NA';
                        }
                    } else {
                        // Key type is json
                        result[key] = data[key];
                    }
                } else {
                    // Non Object type colum
                    result[key] = data[key];
                }
            } else if (data[key].constructor === Array) {
                // Now check for relationship obj
                const values: any[] = data[key];
                if (schema.table.relations[key]) {
                    // Get Controller
                    const relation = schema.table.relations[key];
                    const con: BaseDataController = controllerForSchemaName(relation.schema || '');
                    if (con) {
                        // Further process each object
                        result[key] = values.map( i => con.processForExport(i));
                    } else {
                        // No controller assign normal
                        result[key] = values;
                    }
                }
            } else {
                // Check created by or updated by object
                if (typeof data[key] === 'object' && data[key] !== null && data[key].displayLabel) {
                    result[key] = data[key].displayLabel;
                }
            }
        }
        return result;
    }


    public static exportKeys(schema: BaseSchema): string[] {
        let result: string[] = [];
        for (const key in schema.table.columnsDefinition) {
            if (!schema.table.columnsDefinition.hasOwnProperty(key)) {
                continue;
            }
            const column: ApplicationTableColumn = schema.table.columnsDefinition[key];
            const meta: any = column.meta || {};
            if (meta.embedded && column.refSchema) {
                const refSchema: BaseSchema = schemaWithName(column.refSchema);
                if (refSchema) {
                    const refSchemaExportKeys = this.exportKeys(refSchema);
                    const updatedRefKeys = refSchemaExportKeys.map( oldKey => `${key}.${oldKey}`);
                    result = result.concat(updatedRefKeys);
                }
            } else {
                try {
                    result.push(key);
                } catch (excp) {
                    console.dir(result);
                }
            }
        }
        return result;
    }

    public static dataFlattening(
        schema: BaseSchema,
        data: any,
        keyMapper: {[key: string]: string} = {},
        keyPriorities: {[key: string]: number} = {})
        : any {
        const exportKeys = this.exportKeys(schema);
        const dataKeys = Object.keys(data);
        const mergedKeys = exportKeys.concat(dataKeys);
        const uniqueKeys: Set<string> = new Set<string>(mergedKeys);
        const unSortedKeys: string[] = Array.from(uniqueKeys);
        const sortedKeys = unSortedKeys.sort((item1, item2) => {
            const priority1 = keyPriorities[item1] || 1;
            const priority2 = keyPriorities[item2] || 1;
            if (priority1 > priority2) {
                return -1;
            } else if (priority2 > priority1) {
                return 1;
            } else {
                return 0;
            }
        });

        const result: any = {};
        for (const key of sortedKeys) {
            result[keyMapper[key] || key] = (data[key] !== undefined) ? data[key] : '';
            delete data[key];
        }
        return result;
    }
}
 // ------------------------------------------------------
