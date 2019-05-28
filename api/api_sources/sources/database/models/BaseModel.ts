import { CreateDateColumn, UpdateDateColumn} from "typeorm";


export abstract class BaseModel  {    
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

    

    loadData<T>(data: T) {
        
    }
}

export interface LoadData<T> {
    loadMap(input: T): void
}
