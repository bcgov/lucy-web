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
 * File: schema.model.gen.ts
 * Project: lucy
 * File Created: Wednesday, 17th July 2019 9:07:01 am
 * Author: pushan
 * -----
 * Last Modified: Wednesday, 17th July 2019 9:07:09 am
 * Modified By: pushan
 * -----
 */
import * as path from 'path';
import * as _ from 'underscore';
import { BaseTableSchema } from '../sources/database/applicationSchemaInterface';
import { incrementalWrite } from '../sources/libs/utilities';

const addDoc = (input: string, description: string, ipTabs?: string, others?: any): string => {
    const tab = ipTabs || '';
    let output = input + `\n${tab}/**`;
    output = output + `\n${tab} * @description ${description}`;
    _.each(others, (key, value) => {
        output = output + `\n${tab} * @${key} ${value}`;
    });
    output = output + `\n${tab} */`;
    return output;
};

const addInterfaceProp = (input: string, props: any, forceOptional?: boolean , ipTab?: string) => {
    const tab = ipTab || '';
    let output = input;
    _.each(props, (info: any, k) => {
        if (typeof info === 'string') {
            output = output + `\n${tab}\t${k}: ${info};`;
        } else {
            const { type, optional} = info;
            if (forceOptional) {
                output = output + `\n${tab}\t${k}?: ${type};`;
            } else {
                output = output + `\n${tab}\t${k}${optional ? '?' : ''}: ${type};`;
            }
        }
    });
    return output;
};



export const createInterface = (interfaceName: string, description: string, props: any, optional?: boolean) => {
    const template = `\n\n/** Interface **/` +
                `${addDoc('', description)}` +
                `\nexport interface ${interfaceName} {` +
                `${addInterfaceProp('', props, optional)}` +
                `\n}\n// -- End: ${interfaceName} --\n`;
    return template;
};

const exportRelatedSchema = (schema: BaseTableSchema) => {
    const schemas: string[] = schema.table.relationSchemas;
    let importStmt = '';
    _.each(schemas, (schemaName: string) => importStmt = importStmt + `\n\t${schemaName},`);
    importStmt = importStmt.replace(/.$/, '');
    return `\nimport {${importStmt}\n} from '../database-schema';\n`;
};
const exportModel = (schema: BaseTableSchema) => {
    const models: string[] = schema.table.relationModels;
    let importStmt = '';
    _.each(models, (modelName: string) => importStmt = importStmt + `\n\t${modelName},`);
    importStmt = importStmt.replace(/.$/, '');
    return `\nimport {${importStmt}\n} from '../models';\n`;
};

export const modelClassCreator = (schema: BaseTableSchema, cls?: string) => {
    const className = cls || schema.modelName || 'SampleClass';
    const schemaName = schema.className;
    const n = '\n';
    const t = '\t';
    let props = `\n${t}/**\n${t} * Class Properties\n${t} */\n`;
    const propInfo = {};
    _.each(schema.table.columnsDefinition, (column, col) => {
        props = addDoc(props, `Getter/Setter property for column {${column.name}}`, t);
        if (col === 'id') {
            props = `${props}${n}${t}@PrimaryGeneratedColumn()${n}${t}@ModelProperty({type: PropertyType.number})${n}${t}${column.name}: number;${n}`;
        } else {
            if (column.foreignTable) {
                const rel = `${n}${t}@ManyToOne( type => ${column.refModel || '#MODEL'}, { eager: true})`;
                const jc = `${n}${t}@JoinColumn({ name: ${schemaName}.columns.${col}, referencedColumnName: ${column.refSchema || '#SCHEMA-NAME'}.pk})`;
                props = `${props}${rel}${jc}${n}${t}@ModelProperty({type: PropertyType.${column.type}})${n}${t}${col}: ${column.refModel || column.type};${n}`;
            } else {
                const cols = `${n}${t}@Column({ name: ${schemaName}.columns.${col}})`;
                props = `${props}${cols}${n}${t}@ModelProperty({type: PropertyType.${column.type}})${n}${t}${col}: ${column.type};${n}`;
            }
            propInfo[col] = { type: column.refModel || column.type, optional: false};
        }
    });
    let defClass = ``;
    defClass = defClass + `// ** Model: ${className} from schema ${schemaName} **${n}`;
    defClass = defClass + `${n}import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';`;
    defClass = defClass + `${n}import { ${schemaName} } from '../database-schema';`;
    defClass = defClass + exportRelatedSchema(schema);
    defClass = defClass + `${n}import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';`;
    defClass = defClass + `${n}import { DataModelController } from '../data.model.controller';`;
    defClass = defClass + exportModel(schema);
    defClass = defClass + `${createInterface(`${className}Spec`, `${className} create interface`, propInfo)}`;
    defClass = defClass + `${createInterface(`${className}UpdateSpec`, `${className} update interface`, propInfo, true)}`;
    defClass = addDoc(defClass, `Data Model Class for ${schemaName}`);
    defClass = defClass + `${n}@ModelDescription({\n\tdescription: 'Data Model Class for ${schemaName}',\n\tschema: ${schemaName},\n\tapiResource: false\n})`;
    defClass = defClass + `${n}@Entity( { name: ${schemaName}.dbTable} )\nexport class ${className} {\n${props}\n}\n`;
    let defClassController = `// ** DataModel controller of ${className} **\n`;
    defClassController = addDoc(defClassController, `Data Model Controller Class for ${schemaName} and ${className}`);
    defClassController = defClassController + `${n}export class ${className}Controller extends DataModelController<${className}> {`;
    defClassController = defClassController + `${n}${t}/**`;
    defClassController = defClassController + `${n}${t}* @description Getter for shared instance`;
    defClassController = defClassController + `${n}${t}*/`;
    defClassController = defClassController + `${n}${t}public static get shared(): ${className}Controller {`;
    defClassController = defClassController + `${n}${t}${t}return this.sharedInstance<${className}>(${className}, ${schemaName}) as ${className}Controller;`;
    defClassController = defClassController + `${n}${t}}\n}\n`;
    const final = `${defClass}${n}${n}${defClassController}${n}// -------------------------------------${n}`;

    incrementalWrite(path.resolve(__dirname, `../sources/database/models/${className}.ts`), final);
    return final;
};


