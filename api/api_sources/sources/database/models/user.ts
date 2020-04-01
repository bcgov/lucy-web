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
import {
    Column,
    Entity,
    OneToMany,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToMany
} from 'typeorm';

// Local Import
import { BaseModel } from './baseModel';
import { UserSession} from './user.session';
import { RolesCode, RolesCodeValue } from './appRolesCode';
import { UserSchema, RolesCodeTableSchema, UserRoleSchema} from '../database-schema';
import { UserMessage } from './userMessage';
import { RequestAccess } from './requestAccess';
import {  ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';


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
@ModelDescription({
	description: 'Data Model Class for UserSchema',
	schema: UserSchema,
	apiResource: false
})
@Entity({
    name: UserSchema.schema.name
})
export class User extends BaseModel  {

    /**
     * Private members
     */
    @ModelProperty({ type: PropertyType.object, ref: 'RequestAccess', optional: true})
    existingRequestAccess?: RequestAccess;

    /**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {user_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	user_id: number;

	/**
	 * @description Getter/Setter property for column {first_name}
	 */
	@Column({ name: UserSchema.columns.firstName})
	@ModelProperty({type: PropertyType.string})
	firstName: string;

	/**
	 * @description Getter/Setter property for column {last_name}
	 */
	@Column({ name: UserSchema.columns.lastName})
	@ModelProperty({type: PropertyType.string})
	lastName: string;

	/**
	 * @description Getter/Setter property for column {email}
	 */
	@Column({ name: UserSchema.columns.email})
	@ModelProperty({type: PropertyType.string})
	email: string;

	/**
	 * @description Getter/Setter property for column {preferred_username}
	 */
	@Column({ name: UserSchema.columns.preferredUsername})
	@ModelProperty({type: PropertyType.string})
	preferredUsername: string;

	/**
	 * @description Getter/Setter property for column {account_status}
	 */
	@Column({ name: UserSchema.columns.accountStatus})
	@ModelProperty({type: PropertyType.number})
	accountStatus: number;

	/**
	 * @description Getter/Setter property for column {expiry_date}
	 */
	@Column({ name: UserSchema.columns.expiryDate})
	@ModelProperty({type: PropertyType.string})
	expiryDate: string;

	/**
	 * @description Getter/Setter property for column {activation_status}
	 */
	@Column({ name: UserSchema.columns.activation})
	@ModelProperty({type: PropertyType.number})
    activation: number;

    /**
     * @description Getter/Setter property for column {active_session_id}
     */
    activeSessionId: number;


    @ManyToMany(type => RolesCode, { eager: true} )
    @JoinTable({
        name: UserRoleSchema.dbTable,
        joinColumn: {
            name: UserRoleSchema.columns.user,
            referencedColumnName: UserSchema.id
        },
        inverseJoinColumn: {
            name: UserRoleSchema.columns.role,
            referencedColumnName: RolesCodeTableSchema.id
        }
    })
    @ModelProperty({type: PropertyType.object})
    roles: RolesCode[];


    @OneToMany(type => UserSession, session => session.user)
    sessions: Promise<UserSession[]>;


    @OneToMany(type => UserMessage, message => message.receiver)
    messages: Promise<UserMessage[]>;

    @OneToMany(type => RequestAccess, requestAccess => requestAccess.requester)
    requestAccess: Promise<RequestAccess[]>;


    /**
     * @description Checking user is admin or not
     */
    @ModelProperty({type: PropertyType.boolean})
    get isAdmin(): boolean {
        return this.roles.filter(item => item.code === RolesCodeValue.admin).length > 0;
    }

    get isInspectAppAdmin(): boolean {
        return this.roles.filter( item => item.roleCode === RolesCodeValue.inspectAppAdmin).length > 0;
    }

    get isInspectAppEditor(): boolean {
        return this.roles.filter( item => item.roleCode === RolesCodeValue.inspectAppOfficer).length > 0;
    }
}

// ----------------------------------------------------------------------------------------------------------------

