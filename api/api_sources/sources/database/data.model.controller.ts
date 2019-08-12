//
// Base Data Model Controller
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-05-20.
/**
 * Imports
 */
import * as _ from 'underscore';
import {Connection, getConnection, Repository, ObjectLiteral, QueryRunner} from 'typeorm';
import { LoggerBase} from '../server/logger';
import { SharedDBManager} from './dataBaseManager';
import { ApplicationTable } from './applicationSchemaInterface';


export interface DataController {
    schema: ApplicationTable;
    findById(id: number): Promise<any>;
    remove(object: any): Promise<void>;
    removeById( id: number): Promise<void>;
    all(filter: any): Promise<any>;
    create(): any;
    saveInDB(obj: any): Promise<any>;
    random(): Promise<any>;
}

/**
 * @description Base DataModelController. This class provides -
 *  1. Creation of generic share instance of each subclass
 *  2. Interaction with database
 *  3. Generic in nature associated with model and schema
 * @export class DataModelController<T>
 */
export class DataModelController<T extends ObjectLiteral> extends LoggerBase implements DataController {
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
        super();
        this.entity = entity;
        this.schemaInterface = schema;
    }
    /**
     * @description Creator and Getter of shared instance, manage by subclasses
     * @param any entity
     * @param any schema
     */
    static sharedInstance<U>(entity: any, schema?: any): DataModelController<U> {
        return (this.shareInstance || (this.shareInstance = new this(entity, schema)));
    }

    /**
     * @description Getter of db connection
     * @getter connection Connection
     */
    private get connection(): Connection {
        return SharedDBManager.connection || getConnection();
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
        return await this.repo.findOne(this.idQuery(id)) as T;
    }

    async random(): Promise<T> {
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
        await this.repo.save(value);
        return;
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
            DataModelController.logger.error(`findOneOrCreate: exception: ${exp}`);
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
}
// --------------------------------------------------------------------------------------------
