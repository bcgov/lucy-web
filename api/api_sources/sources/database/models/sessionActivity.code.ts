// ** Model: SessionActivityCode from schema SessionActivityCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SessionActivityCodeSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { BaseModel } from './baseModel';


/**
 * @description Enum values to represent session activities code
 * @export enum SessionActivityCodeValues
 */
export enum SessionActivityCodeValues {
    dataEdit = 'DE',
    dataAdd = 'DA',
    dataDelete = 'DD',
    report = 'RP',
    other = 'OTHER'
}


/** Interface **/
/**
 * @description SessionActivityCode create interface
 */
export interface SessionActivityCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: SessionActivityCodeSpec --


/** Interface **/
/**
 * @description SessionActivityCode update interface
 */
export interface SessionActivityCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: SessionActivityCodeUpdateSpec --

/**
 * @description Data Model Class for SessionActivityCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for SessionActivityCodeSchema',
	schema: SessionActivityCodeSchema,
	apiResource: false
})
@Entity( { name: SessionActivityCodeSchema.dbTable} )
export class SessionActivityCode extends BaseModel {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {session_activity_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	session_activity_code_id: number;

	/**
	 * @description Getter/Setter property for column {session_activity_code}
	 */
	@Column({ name: SessionActivityCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: SessionActivityCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: SessionActivityCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SessionActivityCode **

/**
 * @description Data Model Controller Class for SessionActivityCodeSchema and SessionActivityCode
 */
export class SessionActivityCodeController extends DataModelController<SessionActivityCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SessionActivityCodeController {
		return this.sharedInstance<SessionActivityCode>(SessionActivityCode, SessionActivityCodeSchema) as SessionActivityCodeController;
	}
}

// -------------------------------------
