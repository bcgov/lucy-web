// ** Model: BehaviourCode from schema BehaviourCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BehaviourCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description BehaviourCode create interface
 */
export interface BehaviourCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: BehaviourCodeSpec --


/** Interface **/
/**
 * @description BehaviourCode update interface
 */
export interface BehaviourCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: BehaviourCodeUpdateSpec --

/**
 * @description Data Model Class for BehaviourCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for BehaviourCodeSchema',
	schema: BehaviourCodeSchema,
	apiResource: false
})
@Entity( { name: BehaviourCodeSchema.dbTable} )
export class BehaviourCode extends BaseModel implements BehaviourCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {behaviour_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	behaviour_code_id: number;

	/**
	 * @description Getter/Setter property for column {behaviour_code}
	 */
	@Column({ name: BehaviourCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: BehaviourCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: BehaviourCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** BehaviourCodeController ** //


/**
 * @description Data Model Controller Class for BehaviourCodeSchema and BehaviourCode
 */
export class BehaviourCodeController extends DataModelController<BehaviourCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): BehaviourCodeController {
		return this.sharedInstance<BehaviourCode>(BehaviourCode, BehaviourCodeSchema) as BehaviourCodeController;
	}
}

// -------------------------------------
