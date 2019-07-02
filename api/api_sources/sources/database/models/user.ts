//
// User DataModel
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
// Created by Pushan Mitra on 2019-05-10.
/**
 * Imports
 */
 // Lib Import
import {Column, Entity, OneToMany,  JoinTable, PrimaryGeneratedColumn, ManyToMany, OneToOne} from 'typeorm';

// Local Import
import { BaseModel, LoadData } from './baseModel';
import { UserSession, UserSessionDataController } from './user.session';
import { RolesCode, RolesCodeValue } from './appRolesCode';
import { DataModelController } from '../data.model.controller';
import { UserSchema, RolesCodeTableSchema} from '../database-schema';
import { UserMessage } from './userMessage';
import { RequestAccess } from './requestAccess';


/**
 * @description Enum for property ${User.accountStatus}
 * @export enum AccountStatus
 */
export enum AccountStatus {
    active = 1,
    inactive = 0,
    suspended = 2
}

/**
 * @description Structural interface for data model
 * @export interface UserData
 */
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    accessCode: number;
}

/**
 * @description Entity model class for Users
 * @export class User
 */
@Entity({
    name: UserSchema.schema.name
})
export class User extends BaseModel implements LoadData<UserData> {
    // Props
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    email: string;

    @Column({
        name: UserSchema.schema.columns.firstName,
        nullable: true
    })
    firstName: string;

    @Column({
        name: UserSchema.schema.columns.lastName,
        nullable: true
    })
    lastName: string;

    @Column({
        name: UserSchema.schema.columns.preferredUsername,
        nullable: true
    })
    preferredUsername: string;

    @Column({
        name: UserSchema.schema.columns.refCurrentSession,
        nullable: true,
    })
    currentSessionId?: number;

    @Column({
        name: UserSchema.schema.columns.accountStatus
    })
    accountStatus: number;


    @ManyToMany(type => RolesCode, { eager: true} )
    @JoinTable({
        name: 'user_role',
        joinColumn: {
            name: 'ref_user_id',
            referencedColumnName: UserSchema.schema.columns.id
        },
        inverseJoinColumn: {
            name: 'ref_access_role_id',
            referencedColumnName: RolesCodeTableSchema.schema.columns.id
        }
    })
    roles: RolesCode[];


    @OneToMany(type => UserSession, session => session.user)
    sessions: Promise<UserSession[]>;


    @OneToMany(type => UserMessage, message => message.receiver)
    messages: Promise<UserMessage[]>;

    @OneToOne(type => RequestAccess, requestAccess => requestAccess.requester)
    requestAccess: Promise<RequestAccess>;

    loadMap(input: UserData) {
        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.email = input.email;
        //
    }

    /**
     * @description Checking user is admin or not
     */
    get isAdmin(): boolean {
        return this.roles.filter(item => item.code === RolesCodeValue.admin).length > 0;
    }
}

/**
 * @description Data Model Controller for User
 * @export class UserDataController
 */
export class UserDataController extends DataModelController<User> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): UserDataController {
        return this.sharedInstance<User>(User, UserSchema) as UserDataController;
    }

    /**
     * @description Get current session of given user
     * @method getCurrentSession
     * @param User user
     * @return Promise<UserSession>
     */
    public async getCurrentSession(user: User): Promise<UserSession> {
        const session: UserSession = await UserSessionDataController.shared.findById((user.currentSessionId || -1));
        return session;
    }

    /**
     * @description Set current session of given user
     * @method setCurrentSession
     * @param User user
     * @param UserSession session
     * @return Promise<void>
     */
    public async setCurrentSession(user: User, session: UserSession): Promise<void> {
        user.currentSessionId = session.session_id;
        await this.saveInDB(user);
    }

    /**
     * @description Remove current session of given user
     * @method removeSession
     * @param User user
     * @return Promise<void>
     */
    public async removeSession(user: User): Promise<void> {
        user.currentSessionId = undefined;
        this.saveInDB(user);
    }
}
// ----------------------------------------------------------------------------------------------------------------

