//
// Model file for Application Event data
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
// Created by Pushan Mitra on 2019-09-30.
/**
 * Imports
 */
// ** Model: ApplicationEvent from schema ApplicationEventSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { ApplicationEventSchema } from '../database-schema';
import {
	UserSessionSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import {
	UserSession
} from '../models';


/** Interface **/
/**
 * @description ApplicationEvent create interface
 */
export interface ApplicationEventSpec {
	type: number;
	source: string;
	note: string;
	session: UserSession;
}
// -- End: ApplicationEventSpec --


/** Interface **/
/**
 * @description ApplicationEvent update interface
 */
export interface ApplicationEventUpdateSpec {
	type?: number;
	source?: string;
	note?: string;
	session?: UserSession;
}
// -- End: ApplicationEventUpdateSpec --

/**
 * @description Data Model Class for ApplicationEventSchema
 */
@ModelDescription({
	description: 'Data Model Class for ApplicationEventSchema',
	schema: ApplicationEventSchema,
	apiResource: false
})
@Entity( { name: ApplicationEventSchema.dbTable} )
export class ApplicationEvent {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {application_event_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	application_event_id: number;

	/**
	 * @description Getter/Setter property for column {event_type}
	 */
	@Column({ name: ApplicationEventSchema.columns.type})
	@ModelProperty({type: PropertyType.number})
	type: number;

	/**
	 * @description Getter/Setter property for column {event_source}
	 */
	@Column({ name: ApplicationEventSchema.columns.source})
	@ModelProperty({type: PropertyType.string})
	source: string;

	/**
	 * @description Getter/Setter property for column {event_note}
	 */
	@Column({ name: ApplicationEventSchema.columns.note})
	@ModelProperty({type: PropertyType.string})
	note: string;

	/**
	 * @description Getter/Setter property for column {session_id}
	 */
	@ManyToOne( type => UserSession, { eager: true})
	@JoinColumn({ name: ApplicationEventSchema.columns.session, referencedColumnName: UserSessionSchema.pk})
	@ModelProperty({type: PropertyType.object})
	session: UserSession;

}


// ** DataModel controller of ApplicationEvent **

/**
 * @description Data Model Controller Class for ApplicationEventSchema and ApplicationEvent
 */
export class ApplicationEventController extends DataModelController<ApplicationEvent> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ApplicationEventController {
		return this.sharedInstance<ApplicationEvent>(ApplicationEvent, ApplicationEventSchema) as ApplicationEventController;
	}
}

// -------------------------------------



// ------------------------
