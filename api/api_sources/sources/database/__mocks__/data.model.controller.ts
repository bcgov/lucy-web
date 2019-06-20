/**
 * Mock data model controller
 */
import { LoggerBase} from '../../server/logger';
import { ApplicationTable } from '../applicationSchemaInterface';
import { MemoryDataManager } from '../../test-helpers/mock.data.manager';


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
