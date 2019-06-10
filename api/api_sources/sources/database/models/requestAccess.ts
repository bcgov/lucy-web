import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from 'typeorm';

import { RequestAccessTableSchema, UserSchema, RolesCodeTableSchema} from '../database-schema'
import { BaseModel } from './baseModel';
import { User } from './user';
import { DataModelController} from '../data.model.controller';
import { RolesCode } from './appRolesCode';

@Entity({
    name: RequestAccessTableSchema.schema.name,
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
    approverNote: string;

    // Relationships
    // Access Code
    @ManyToOne(type => RolesCode, {eager: true})
    @JoinColumn({
        name: RequestAccessTableSchema.schema.columns.refRequestType,
        referencedColumnName: RolesCodeTableSchema.schema.columns.id
    })
    requestedAccessCode: RolesCode;
    // Requester
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

