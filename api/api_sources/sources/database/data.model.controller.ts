// DataModelController
import {Connection, getConnection, Repository, ObjectLiteral} from 'typeorm';
import { LoggerBase} from '../server/logger'
import { SharedDBManager} from './dataBaseManager';
import { ApplicationTable } from './applicationSchemaInterface';

//import { BaseModel} from './models';
export class DataModelController<T extends ObjectLiteral> extends LoggerBase {
    protected static shareInstance: any;
    entity: any;
    schemaInterface: any;
    constructor(entity: any, schema?: any) {
        super();
        this.entity = entity;
        this.schemaInterface = schema
    }

    static sharedInstance<U>(entity: any, schema?: any): DataModelController<U> {
        return (this.shareInstance || (this.shareInstance = new this(entity, schema)))
    }

    private get connection(): Connection {
        return SharedDBManager.connection || getConnection()
    }

    

    idQuery(value: number): object {
       let qry = {};
       qry[this.schema.columns.id] = value;
       return qry;
    }

    create(): T {
        return new this.entity() as T;
    }

    public get repo(): Repository<T> {
        return this.connection.getRepository(this.entity);
    }


    async removeById( id: number): Promise<void> {
        //this.re
    }

    async findById(id: number): Promise<T> {
        return await this.repo.findOne(this.idQuery(id)) as T;
    }

    async all(query?: object): Promise<T[]> {
        const items:T[] = await this.repo.find(query) as T[]
        return items;
    }

    async fetchOne(query: object): Promise<T> {
        const item:T = await this.repo.findOne(query) as T
        return item;
    }

    async saveInDB(value: T): Promise<void> {
        await this.repo.save(value);
        return;
    }

    async findOneOrCreate(info: object): Promise<T> {
        try {
            const item:T = await this.repo.findOne(info) as T;
            if (item) {
                return item;
            } else {
                const manager = this.connection.manager;
                const newItem:T = await manager.create(this.entity, info) as T;
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
}