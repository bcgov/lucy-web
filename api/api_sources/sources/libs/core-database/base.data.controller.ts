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
 * File: base.data.controller.ts
 * Project: lucy
 * File Created: Thursday, 12th September 2019 12:47:16 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 12th September 2019 12:50:33 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
import {
    Connection,
    Repository,
    ObjectLiteral,
    QueryRunner
} from 'typeorm';
import { ApplicationTable } from './application.table';
import { BaseSchema } from './baseSchema';
import { registerDataModelController } from './schema.storage';

export interface ControllerMetaData {
    modelName: string;
    schemaName: string;
}
export interface BaseDataController {
    schema: ApplicationTable;
    schemaObject: BaseSchema;
    dependencies: any[];
    meta: ControllerMetaData;
    findById(id: number): Promise<any>;
    remove(object: any): Promise<void>;
    removeById( id: number): Promise<void>;
    all(filter?: any): Promise<any>;
    create(): any;
    saveInDB(obj: any): Promise<any>;
    random(): Promise<any>;
    createNewObject(newObj: any, creator: any, ...others: any[]): Promise<any>;
    updateObject(existing: any, update: any, modifier: any, ...others: any[]): Promise<any>;
    factory (): Promise<any>;
    getIdValue(obj: any): any;
}



/**
 * @description Base DataModelController. This class provides -
 *  1. Creation of generic share instance of each subclass
 *  2. Interaction with database
 *  3. Generic in nature associated with model and schema
 * @export class DataModelController<T>
 */
export class BaseDataModelController<T extends ObjectLiteral> implements BaseDataController {
    // Shared instance: Managed by subclasses
    protected static shareInstance: any;

    // Entity Class object (constructor)
    entity: any;
    // Schema interface for Entity
    schemaInterface: any;

    /**
     * @description Constructing object with entity and schema associated with entity
     * @param any entity
     * @param schema schema
     */
    constructor(entity: any, schema?: any) {
        this.entity = entity;
        this.schemaInterface = schema;
        if (this.schemaInterface) {
            const baseSchema = this.schemaInterface as BaseSchema;
            registerDataModelController(baseSchema, this);
        }
    }
    /**
     * @description Creator and Getter of shared instance, manage by subclasses
     * @param any entity
     * @param any schema
     */
    static sharedInstance<U>(entity: any, schema?: any): BaseDataModelController<U> {
        return (this.shareInstance || (this.shareInstance = new this(entity, schema)));
    }

    get className(): string {
        return this.constructor.name;
    }

    get dependencies(): any[] {
        return [];
    }

    /**
     * @description Getter of db connection
     * @getter connection Connection
     */
    protected get connection(): Connection {
        throw Error('BaseDataModelController: Subclass must override');
    }

    /**
     * @description Create query object for primary key (*id) of associated data model
     * @method idQuery
     * @param number value
     */
    idQuery(value: number): object {
       const qry = {};
       qry[this.schema.columns.id] = value;
       return qry;
    }

    /**
     * @description Create model object
     * @method create
     */
    create(): T {
        return new this.entity() as T;
    }

    /**
     * @description Returns typeorm repo of associated entity
     * @getter repo Repository<T>
     */
    public get repo(): Repository<T> {
        return this.connection.getRepository(this.entity);
    }


    /**
     * @description Method to remove object by id
     * @param number id
     */
    async removeById( id: number): Promise<void> {
        await this.repo.delete(id);
        return;
    }

    /**
     * @description Method to find object by id
     * @param number id
     */
    async findById(id: number): Promise<T> {
        const items: T[] = await this.repo.find(this.idQuery(id)) as T[];
        return items[0];
    }

    async count(): Promise<number> {
        return this.repo.count();
    }

    async random(): Promise<T> {
        const count = await this.repo.count();
        if (count > 0) {
            // Get random index
            const randomId = Math.floor((Math.random() * count) + 1);
            if (randomId > 0 && randomId <= count) {
                const item: T = await this.findById(randomId) as T;
                if (item) {
                    return item;
                }
            }
        }
        return this.findById(1);
    }

    /**
     * @description Method to get all object filtered by query
     * @param object query
     */
    async all(query?: object): Promise<T[]> {
        const items: T[] = await this.repo.find(query) as T[];
        return items;
    }

    /**
     * @description Method to fetch single object filtered by query
     * @param object query
     */
    async fetchOne(query: object): Promise<T> {
        const item: T = await this.repo.findOne(query) as T;
        return item;
    }

    /**
     * @description Method to save model in db
     * @param T value
     */
    async saveInDB(value: T): Promise<void> {
        try {
            await this.repo.manager.save(value);
            return;
        } catch (excp) {
            console.error(`${this.className}: Save Error: ${excp}`);
            throw excp;
        }
    }

    /**
     * @description Method to find or create object with given info
     * @param object info
     */
    async findOneOrCreate(info: object): Promise<T> {
        try {
            const item: T = await this.repo.findOne(info) as T;
            if (item) {
                return item;
            } else {
                const manager = this.connection.manager;
                const newItem: T = await manager.create(this.entity, info) as T;
                return newItem;
            }
        } catch (exp) {
            console.error(`${this.constructor.name}: Exception => ${exp}`);
            throw exp;
        }
    }

    async remove(data: T): Promise<void> {
        const repo =  this.connection.getRepository(this.entity);
        await repo.remove(data);
        return;
    }

    get schema(): ApplicationTable {
        return this.schemaInterface.schema;
    }

    get schemaObject(): BaseSchema {
        return this.schemaInterface.shareInstance as BaseSchema;
    }

    get meta(): ControllerMetaData {
        return {
            modelName: this.schemaObject.modelName,
            schemaName: this.schemaObject.className
        };
    }

    async runQuery(query: string): Promise<void> {
        const queryRunner: QueryRunner = this.connection.createQueryRunner();
        await queryRunner.query(query);
    }

    async updateObj<U extends ObjectLiteral>(obj: T, update: U): Promise<T> {
        const o: any = obj;
        for (const key in o) {
            if (obj.hasOwnProperty(key) && update.hasOwnProperty(key)) {
                if (update[key] && typeof obj[key] === typeof update[key]) {
                    o[key as keyof T] = update[key];
                }
            }
        }
        await this.saveInDB(obj);
        return obj;
    }

    newObject(data: any): T {
        return this.repo.manager.create(this.entity, data);
    }

    async createNewObject(newObj: any, creator: any): Promise<T> {
        const newModelObj = this.newObject(newObj);
        await this.saveInDB(newModelObj);
        return newModelObj;
    }

    async updateObject(existing: any, update: any, modifier: any): Promise<T> {
        return update;
    }

    factory(): Promise<T> {
        throw Error(`${this.constructor.name}: factory: subclass should implement`);
    }

    getIdValue(obj: any): any {
        const idKey: string = this.schema.id;
        return obj[idKey];
    }
}

// ------------------------------------------------------------------------------------------
