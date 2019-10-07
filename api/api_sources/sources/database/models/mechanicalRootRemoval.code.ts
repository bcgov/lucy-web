// ** Model: MechanicalRootRemovalCode from schema MechanicalRootRemovalCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { MechanicalRootRemovalCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';


/** Interface **/
/**
 * @description MechanicalRootRemovalCode create interface
 */
export interface MechanicalRootRemovalCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: MechanicalRootRemovalCodeSpec --


/** Interface **/
/**
 * @description MechanicalRootRemovalCode update interface
 */
export interface MechanicalRootRemovalCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: MechanicalRootRemovalCodeUpdateSpec --

/**
 * @description Data Model Class for MechanicalRootRemovalCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalRootRemovalCodeSchema',
	schema: MechanicalRootRemovalCodeSchema,
	apiResource: false
})
@Entity( { name: MechanicalRootRemovalCodeSchema.dbTable} )
export class MechanicalRootRemovalCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_root_removal_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_root_removal_code_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_root_removal_code}
	 */
	@Column({ name: MechanicalRootRemovalCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: MechanicalRootRemovalCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: MechanicalRootRemovalCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of MechanicalRootRemovalCode **

/**
 * @description Data Model Controller Class for MechanicalRootRemovalCodeSchema and MechanicalRootRemovalCode
 */
export class MechanicalRootRemovalCodeController extends DataModelController<MechanicalRootRemovalCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalRootRemovalCodeController {
		return this.sharedInstance<MechanicalRootRemovalCode>(MechanicalRootRemovalCode, MechanicalRootRemovalCodeSchema) as MechanicalRootRemovalCodeController;
	}
}

// -------------------------------------
