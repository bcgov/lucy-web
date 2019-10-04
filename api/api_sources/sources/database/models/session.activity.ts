// ** Model: SessionActivity from schema SessionActivitySchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { SessionActivitySchema } from '../database-schema';
import {
	SessionActivityCodeSchema,
	UserSessionSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import {
	SessionActivityCode,
	UserSession
} from '.';
import { BaseModel } from './baseModel';


/** Interface **/
/**
 * @description SessionActivity create interface
 */
export interface SessionActivitySpec {
	info: string;
	activityCode: SessionActivityCode;
	session: UserSession;
}
// -- End: SessionActivitySpec --


/** Interface **/
/**
 * @description SessionActivity update interface
 */
export interface SessionActivityUpdateSpec {
	info?: string;
	activityCode?: SessionActivityCode;
	session?: UserSession;
}
// -- End: SessionActivityUpdateSpec --

/**
 * @description Data Model Class for SessionActivitySchema
 */
@ModelDescription({
	description: 'Data Model Class for SessionActivitySchema',
	schema: SessionActivitySchema,
	apiResource: false
})
@Entity( { name: SessionActivitySchema.dbTable} )
export class SessionActivity extends BaseModel {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {user_session_activity_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	user_session_activity_id: number;

	/**
	 * @description Getter/Setter property for column {session_activity_info}
	 */
	@Column({ name: SessionActivitySchema.columns.info})
	@ModelProperty({type: PropertyType.string})
	info: string;

	/**
	 * @description Getter/Setter property for column {session_activity_code_id}
	 */
	@ManyToOne( type => SessionActivityCode, { eager: true})
	@JoinColumn({ name: SessionActivitySchema.columns.activityCode, referencedColumnName: SessionActivityCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	activityCode: SessionActivityCode;

	/**
	 * @description Getter/Setter property for column {session_id}
	 */
	@ManyToOne( type => UserSession, { eager: true})
	@JoinColumn({ name: SessionActivitySchema.columns.session, referencedColumnName: UserSessionSchema.pk})
	@ModelProperty({type: PropertyType.object})
	session: UserSession;

}


// ** DataModel controller of SessionActivity **

/**
 * @description Data Model Controller Class for SessionActivitySchema and SessionActivity
 */
export class SessionActivityController extends DataModelController<SessionActivity> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SessionActivityController {
		return this.sharedInstance<SessionActivity>(SessionActivity, SessionActivitySchema) as SessionActivityController;
	}
}

// -------------------------------------
