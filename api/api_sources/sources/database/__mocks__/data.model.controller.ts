//
// DataModelController Mock
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
// Created by Pushan Mitra on 2019-06-10.
//
/**
 * Mock data model controller
 */
import { LoggerBase} from '../../server/logger';
import { ApplicationTable } from '../../libs/core-database';
import { MemoryDataManager } from '../../test-helpers/mock.data.manager';

/**
 * @description Mock implementation of data model controller
 * @export class DataModelController
 */
export class DataModelController<T> extends LoggerBase {
    protected static shareInstance: any;
    entity: any;
    schemaInterface: any;
    private memoryDB: MemoryDataManager = MemoryDataManager.shared;
    constructor(entity: any, schema?: any) {
        super();
        this.entity = entity;
        this.schemaInterface = schema;
    }

    static sharedInstance<U>(entity: any, schema?: any): DataModelController<U> {
        return (this.shareInstance || (this.shareInstance = new this(entity, schema)));
    }


    idQuery(value: number): object {
       const qry = {};
       qry[this.schema.columns.id] = value;
       return qry;
    }

    create(): T {
        return new this.entity() as T;
    }

    public get repo(): any {
        return {};
    }


    async removeById( id: number): Promise<void> {
    }

    async findById(id: number): Promise<T> {
        const data = this.memoryDB.findByKey(id, this.schema.name);
        return data;
    }

    async all(query?: object): Promise<T[]> {
        const items: T[] = this.memoryDB.findQuery(this.schema.name, query) as T[];
        return items;
    }

    async fetchOne(query: object): Promise<T> {
        const items: T[] = this.memoryDB.findQuery(this.schema.name, query) as T[];
        return items[0];
    }

    async saveInDB(value: T): Promise<void> {
        await this.memoryDB.save(value, this.schema.columns.id, this.schema.name);
        return;
    }

    async findOneOrCreate(info: any): Promise<T> {
        try {
            this.memoryDB.save(info, this.schema.columns.id, this.schema.name);
            return info ;
        } catch (exp) {
            DataModelController.logger.error(`findOneOrCreate: exception: ${exp}`);
            throw exp;
        }
    }

    async remove(data: T): Promise<void> {
        this.memoryDB.remove(data, this.schema.columns.id, this.schema.name);
        return;
    }

    get schema(): ApplicationTable {
        return this.schemaInterface.schema;
    }
}

// -------------------------------------------------------------
