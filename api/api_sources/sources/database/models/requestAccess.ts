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
// ** Model: RequestAccess from schema RequestAccessSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { RequestAccessSchema } from '../database-schema';
import {
	RolesCodeTableSchema,
	UserSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import {
	RolesCode,
	User
} from '../models';
import { BaseModel } from './baseModel';

/**
 * @description Status enum of property of RequestAccess.status
 * @export enum RequestStatus
 */
export enum RequestStatus {
    requested = 0,
    approved = 1,
    rejected = 2
}

/** Interface **/
/**
 * @description RequestAccess create interface
 */
export interface RequestAccessSpec {
	requestNote: string;
	status: number;
	approverNote: string;
	requestedAccessCode: RolesCode;
	requester: User;
	approver: User;
}
// -- End: RequestAccessSpec --


/** Interface **/
/**
 * @description RequestAccess update interface
 */
export interface RequestAccessUpdateSpec {
	requestNote?: string;
	status?: number;
	approverNote?: string;
	requestedAccessCode?: RolesCode;
	requester?: User;
	approver?: User;
}
// -- End: RequestAccessUpdateSpec --

/**
 * @description Data Model Class for RequestAccessSchema
 */
@ModelDescription({
	description: 'Data Model Class for RequestAccessSchema',
	schema: RequestAccessSchema,
	apiResource: false
})
@Entity( { name: RequestAccessSchema.dbTable} )
export class RequestAccess extends BaseModel {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {request_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	request_id: number;

	/**
	 * @description Getter/Setter property for column {request_note}
	 */
	@Column({ name: RequestAccessSchema.columns.requestNote})
	@ModelProperty({type: PropertyType.string})
	requestNote: string;

	/**
	 * @description Getter/Setter property for column {status}
	 */
	@Column({ name: RequestAccessSchema.columns.status})
	@ModelProperty({type: PropertyType.number})
	status: number;

	/**
	 * @description Getter/Setter property for column {approver_note}
	 */
	@Column({ name: RequestAccessSchema.columns.approverNote})
	@ModelProperty({type: PropertyType.string})
	approverNote: string;

	/**
	 * @description Getter/Setter property for column {requested_role_code_id}
	 */
	@ManyToOne( type => RolesCode, { eager: true})
	@JoinColumn({ name: RequestAccessSchema.columns.requestedAccessCode, referencedColumnName: RolesCodeTableSchema.pk})
	@ModelProperty({type: PropertyType.object})
	requestedAccessCode: RolesCode;

	/**
	 * @description Getter/Setter property for column {requester_user_id}
	 */
	@ManyToOne( type => User, { eager: true})
	@JoinColumn({ name: RequestAccessSchema.columns.requester, referencedColumnName: UserSchema.pk})
	@ModelProperty({type: PropertyType.object})
	requester: User;

	/**
	 * @description Getter/Setter property for column {approver_user_id}
	 */
	@ManyToOne( type => User, { eager: true})
	@JoinColumn({ name: RequestAccessSchema.columns.approver, referencedColumnName: UserSchema.pk})
	@ModelProperty({type: PropertyType.object})
	approver: User;

}


// ** DataModel controller of RequestAccess **

/**
 * @description Data Model Controller Class for RequestAccessSchema and RequestAccess
 */
export class RequestAccessController extends DataModelController<RequestAccess> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): RequestAccessController {
		return this.sharedInstance<RequestAccess>(RequestAccess, RequestAccessSchema) as RequestAccessController;
	}
}

// -------------------------------------


// -------------------------------------


