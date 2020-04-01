/**
 * The utility to create Query and view
 */
import * as _ from 'underscore';
import { BaseSchema } from './baseSchema';
import { TableColumnDefinition } from './application.column';
import { schemaWithName } from './schema.storage';
import { unWrap } from '../utilities';

export interface QueryInfo {
    // The included Fields in Query
    fields?: string[];
    includesAllFields?: boolean;
    includeAllDataFields?: boolean;
    name: string;
    joinSchemas?: string[];
    keyMapper?: {[key: string]: string};
}

export class QueryCreator {

    /**
     * @description Generate Query-able fields info
     * @param BaseSchema schema: Schema
     * @param QueryInfo info: Query Info
     */
    private static _generateFieldDef (schema: BaseSchema, info: QueryInfo): any {
        const fields = {};
        if (info.includesAllFields || info.includeAllDataFields) {
            _.each(schema.table.columnsDefinition, (def: TableColumnDefinition, key) => {
                if (info.includesAllFields) {
                    fields[key] = {
                        col: def.name,
                        foreignTable: def.foreignTable,
                        schema: schemaWithName(def.refSchema || ''),
                        key: key
                    };
                } else {
                    if (!def.foreignTable) {
                        fields[key] = {
                            col: def.name,
                            key: key
                        };
                    }
                }
            });
        }

        if (!info.includesAllFields && info.fields) {
            const infoFields: string[] = info.fields || [];
            for (const f of infoFields) {
                if (!f.includes('.') && schema.table.columnsDefinition[f]) {
                    const column: TableColumnDefinition = schema.table.columnsDefinition[f];
                    fields[f] = {
                        col: column.name,
                        key: f
                    };
                } else {
                    const parts = f.split('.');
                    const k = parts[0];
                    if (schema.table.columnsDefinition[k]) {
                        const column: TableColumnDefinition = schema.table.columnsDefinition[k];
                        fields[f] = {
                            col: column.name,
                            key: f,
                            foreignTable: column.foreignTable,
                            schema: schemaWithName(column.refSchema || ''),
                            innerKeys: parts.length > 1 ? parts.slice(1) : []
                        };
                    }
                }
            }
        }
        return fields;
    }


    private static handleRelationColumn(field: any, schema: BaseSchema, info: QueryInfo) {
        // Check connected schema
        const relSchema: BaseSchema = field.schema;
        const ft: string = field.foreignTable;
        // console.dir(field);
        if (!relSchema) {
            return `"${ft}"."${field.col}" AS "${field.key}",\n`;
        }

        // Now Handle
        // Get View Column info
        const viewColInfo: any = relSchema.table.viewColumnInfo;

        // Check inner keys
        const innerKeys: string[] = field.innerKeys || [];
        if (innerKeys.length === 0) {
            return `"${ft}"."${viewColInfo.columnName}" AS "${field.key}",\n`;
        }

        const ik: string = innerKeys[0];
        // Get column name
        const colName: string = unWrap(relSchema.table.columnsDefinition[ik], {}).name || viewColInfo.column;

        return `"${ft}"."${colName}" AS "${field.key}",\n`;
    }

    static createQuery(schema: BaseSchema, info: QueryInfo): string {
        const fields = QueryCreator._generateFieldDef(schema, info) || {};
        // Now Create Select Statement
        let result = `SELECT `;
        const table = schema.tableName;
        const joinColum: any = {};
        // console.dir(fields);
        _.each(fields, (f: any) => {
            if (f.foreignTable && f.col) {
                const fschema: BaseSchema = f.schema;
                if (fschema && fschema.className) {
                    joinColum[fschema.className] = fschema;
                } else {
                    console.error(`No Schema for field: ${f.key} | ${f.col} | ${f.foreignTable}`);
                }
                result = result + this.handleRelationColumn(f, schema, info);
            } else {
                result = result + `"${table}"."${f.col}" AS "${f.key}",\n`;
            }
        });

        result = result.replace(/[\n]*$/, '');
        result = result.replace(/.$/, '');
        result = result + `\nFROM ${table}\n`;

        // Now Add Join table
        let joinStatement = ``;
        _.each(joinColum, (s: BaseSchema, key: string) => {
            joinStatement = joinStatement + `JOIN "${s.tableName}" USING (${s.table.id})\n`;
        });

        // Finishing join statement
        joinStatement = joinStatement.replace(/[\n]*$/, ';');

        // Adding with select
        result = result + joinStatement;
        return result;
    }
}
// -------------------------
