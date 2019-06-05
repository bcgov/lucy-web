import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from "typeorm";

import { RequestAccessTableSchema, UserSchema, LoginAccessTableSchema} from '../database-schema'
import { BaseModel } from './BaseModel';
import { User } from "./User";
import { DataModelController} from '../DataModelController'
import { LoginAccessCode } from "./LoginAccessCode";

@Entity({
    name: RequestAccessTableSchema.schema.name
})
export class RequestAccess extends BaseModel {
    @PrimaryGeneratedColumn()
    request_id: number;

    @Column({
        name: RequestAccessTableSchema.schema.columns.requestNote,
        nullable: true
    })
    requestNote: string;

    @Column()
    status: number;

    @Column({
        name: RequestAccessTableSchema.schema.columns.approverNote,
        nullable: true
    })
    approverNote: string

    // Relationships
    @ManyToOne(type => LoginAccessCode, {eager: true})
    @JoinColumn({
        name: RequestAccessTableSchema.schema.columns.refRequestType,
        referencedColumnName: LoginAccessTableSchema.schema.columns.id
    })
    requestedAccessCode: LoginAccessCode
    
    @OneToOne( type => User, {eager: true})
    @JoinColumn({
        name: RequestAccessTableSchema.schema.columns.refRequester,
        referencedColumnName: UserSchema.schema.columns.id
    })
    requester: User;

    @ManyToOne( type => User,  {eager: true})
    @JoinColumn({
        name: RequestAccessTableSchema.schema.columns.refApprover,
        referencedColumnName: UserSchema.schema.columns.id
    })
    approver: User;
}

export class RequestAccessController extends DataModelController<RequestAccess> {
    public static get shared(): RequestAccessController {
        return this.sharedInstance<RequestAccess>(RequestAccess, RequestAccessTableSchema) as RequestAccessController;
    }
}

