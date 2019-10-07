//
// UserMessage DataModel
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
// Created by Pushan Mitra on 2019-06-02.
// ** Model: UserMessages from schema UserMessagesSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { UserMessagesSchema } from '../database-schema';
import {
	UserSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import {
	User
} from '../models';
import { BaseModel } from './baseModel';

/**
 * @description Status of message
 * @export enum UserMessageStatus
 */
export enum UserMessageStatus {
    unseen = 0,
    seen = 1
}

/** Interface **/
/**
 * @description UserMessages create interface
 */
export interface UserMessagesSpec {
	title: string;
	body: string;
	type: number;
	status: number;
	receiver: User;
	creator: User;
}
// -- End: UserMessagesSpec --


/** Interface **/
/**
 * @description UserMessages update interface
 */
export interface UserMessagesUpdateSpec {
	title?: string;
	body?: string;
	type?: number;
	status?: number;
	receiver?: User;
	creator?: User;
}
// -- End: UserMessagesUpdateSpec --

/**
 * @description Data Model Class for UserMessagesSchema
 */
@ModelDescription({
	description: 'Data Model Class for UserMessagesSchema',
	schema: UserMessagesSchema,
	apiResource: false
})
@Entity( { name: UserMessagesSchema.dbTable} )
export class UserMessage extends BaseModel {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {message_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	message_id: number;

	/**
	 * @description Getter/Setter property for column {title}
	 */
	@Column({ name: UserMessagesSchema.columns.title})
	@ModelProperty({type: PropertyType.string})
	title: string;

	/**
	 * @description Getter/Setter property for column {body}
	 */
	@Column({ name: UserMessagesSchema.columns.body})
	@ModelProperty({type: PropertyType.string})
	body: string;

	/**
	 * @description Getter/Setter property for column {message_type}
	 */
	@Column({ name: UserMessagesSchema.columns.type})
	@ModelProperty({type: PropertyType.number})
	type: number;

	/**
	 * @description Getter/Setter property for column {message_status}
	 */
	@Column({ name: UserMessagesSchema.columns.status})
	@ModelProperty({type: PropertyType.number})
	status: number;

	/**
	 * @description Getter/Setter property for column {receiver_user_id}
	 */
	@ManyToOne( type => User, { eager: true})
	@JoinColumn({ name: UserMessagesSchema.columns.receiver, referencedColumnName: UserSchema.pk})
	@ModelProperty({type: PropertyType.object})
	receiver: User;

	/**
	 * @description Getter/Setter property for column {creator_user_id}
	 */
	@ManyToOne( type => User, { eager: true})
	@JoinColumn({ name: UserMessagesSchema.columns.creator, referencedColumnName: UserSchema.pk})
	@ModelProperty({type: PropertyType.object})
	creator: User;

}


// ** DataModel controller of UserMessages **

/**
 * @description Data Model Controller Class for UserMessagesSchema and UserMessages
 */
export class UserMessageController extends DataModelController<UserMessage> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): UserMessageController {
		return this.sharedInstance<UserMessage>(UserMessage, UserMessagesSchema) as UserMessageController;
	}
}

// ----------------------------------------------------------------------------------------------------------------

