import { CreateDateColumn, UpdateDateColumn, Connection} from "typeorm";


export abstract class BaseModel implements FactoryModel {
    
    @CreateDateColumn({ 
        name: 'create_at',
        nullable: true,
        comment: 'Create Timestamp'
    })
    createdAt: Date

    @UpdateDateColumn({ 
        name: 'update_at',
        comment: 'Update Timestamp',
        nullable: true 
    })
    updateAt: Date

    static async fetchData<T extends BaseModel>(connection: Connection, query: object): Promise<T[]> {
        const repo = connection.getRepository(this);
        const items:T[] = await repo.find(query) as T[]
        return items;
    }

    static async fetchOne<T extends BaseModel>(connection: Connection, query: object): Promise<T> {
        const repo = connection.getRepository(this);
        const item:T = await repo.findOne(query) as T
        return item;
    }

    static async saveInDB<T extends BaseModel>(connection: Connection, value: T): Promise<void> {
        const repo = connection.getRepository(this);
        repo.save(value);
    }

    static async findOneOrCreate<T extends BaseModel>(connection: Connection, info: object, ): Promise<T> {
        const repo = connection.getRepository(this);
        const item:T = await repo.findOne(info) as T;
        if (item) {
            return item;
        } else {
            const manager = connection.manager;
            const newItem:T = await manager.create(this, info) as T;
            return newItem;
        }
    }

    async save(connection: Connection): Promise<void> {}

    loadData<T>(data: T) {
        
    }
}

export interface LoadData<T> {
    loadMap(input: T): void
}
