//
// RequestAccess DataModel
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
// Created by Pushan Mitra on 2019-06-7.
/**
 * Imports
 */
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn} from 'typeorm';
import { RequestAccessTableSchema, UserSchema, RolesCodeTableSchema} from '../database-schema';
import { BaseModel } from './baseModel';
import { User } from './user';
import { DataModelController} from '../data.model.controller';
import { RolesCode } from './appRolesCode';

/**
 * @description Status enum of property of RequestAccess.status
 * @export enum RequestStatus
 */
export enum RequestStatus {
    requested = 0,
    approved = 1,
    rejected = 2
}

/**
 * @description Entity model class for RequestAccess
 * @export class RequestAccess
 */
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

/**
 * @description Data Model Controller for RequestAccess
 * @export class RequestAccessController
 */
export class RequestAccessController extends DataModelController<RequestAccess> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): RequestAccessController {
        return this.sharedInstance<RequestAccess>(RequestAccess, RequestAccessTableSchema) as RequestAccessController;
    }
}

