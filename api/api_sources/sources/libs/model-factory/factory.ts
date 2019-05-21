import { getConnection, Connection, ObjectType } from 'typeorm';
import { BaseModel } from '../../database/models/BaseModel';

type getData = (() => object);

export class DataModelFactory<T extends BaseModel> {
    private connection: Connection;
    private target: any
    constructor(target: any) {
        const connection = getConnection();
        if (connection && connection.isConnected) {
            this.connection = connection;
        }
    }

    async generate(cb: getData): Promise<T> {
        const info = cb();
        const item = await this.target.findOneOrCreate(this.connection, info) as T;
        return item;
    }


}