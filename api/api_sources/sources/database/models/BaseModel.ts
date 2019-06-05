import { CreateDateColumn, UpdateDateColumn} from "typeorm";
import { BaseTableSchema } from "../ApplicationSchemaInterface";


export abstract class BaseModel  {    
    @CreateDateColumn({ 
        name: BaseTableSchema.timestampColumns.createdAt,
        nullable: true,
        comment: 'Create Timestamp'
    })
    createdAt: Date

    @UpdateDateColumn({ 
        name: BaseTableSchema.timestampColumns.updatedAt,
        comment: 'Update Timestamp',
        nullable: true 
    })
    updateAt: Date

    loadData<T>(data: T) {
        
    }
}

export interface LoadData<T> {
    loadMap(input: T): void
}
