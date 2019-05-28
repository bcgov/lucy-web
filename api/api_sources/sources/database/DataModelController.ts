import {Connection} from 'typeorm';
import { LoggerBase} from '../server/logger'

//import { BaseModel} from './models';
export class DataModelController<T> extends LoggerBase {
    entity: any;
    constructor(entity: any) {
        super();
        this.entity = entity;
    }

    create(): T {
        return new this.entity() as T;
    }

    async findById(connection: Connection,id: number): Promise<T> {
        const repo = connection.getRepository(this.entity);
        return await repo.findOne(id) as T;
    }

    async fetchData(connection: Connection, query: object): Promise<T[]> {
        const repo = connection.getRepository(this.entity);
        const items:T[] = await repo.find(query) as T[]
        return items;
    }

    async fetchOne(connection: Connection, query: object): Promise<T> {
        const repo = connection.getRepository(this.entity);
        const value = await repo.findOne(query);
        const item:T = value as T
        return item;
    }

    async saveInDB(connection: Connection, value: T): Promise<void> {
        const repo = connection.getRepository(this.entity);
        await repo.save(value);
        return;
    }

    async findOneOrCreate(connection: Connection, info: object): Promise<T> {
        const repo =  connection.getRepository(this.entity);
        try {
            const item:T = await repo.findOne(info) as T;
            if (item) {
                return item;
            } else {
                const manager = connection.manager;
                const newItem:T = await manager.create(this.entity, info) as T;
                return newItem;
            }
        } catch (exp) {
            DataModelController.logger.error(`findOneOrCreate: exception: ${exp}`);
            throw exp;
        }
    }

    async save(connection: Connection): Promise<void> {}

    async remove(connection: Connection, data: T): Promise<void> {
        const repo =  connection.getRepository(this.entity);
        await repo.remove(data);
        return;
    }
}