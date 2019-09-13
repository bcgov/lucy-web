// ** Model: MechanicalSoilDisturbanceCode from schema MechanicalSoilDisturbanceCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { MechanicalSoilDisturbanceCodeSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';


/** Interface **/
/**
 * @description MechanicalSoilDisturbanceCode create interface
 */
export interface MechanicalSoilDisturbanceCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: MechanicalSoilDisturbanceCodeSpec --


/** Interface **/
/**
 * @description MechanicalSoilDisturbanceCode update interface
 */
export interface MechanicalSoilDisturbanceCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: MechanicalSoilDisturbanceCodeUpdateSpec --

/**
 * @description Data Model Class for MechanicalSoilDisturbanceCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalSoilDisturbanceCodeSchema',
	schema: MechanicalSoilDisturbanceCodeSchema,
	apiResource: false
})
@Entity( { name: MechanicalSoilDisturbanceCodeSchema.dbTable} )
export class MechanicalSoilDisturbanceCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_soil_disturbance_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_soil_disturbance_code_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_soil_disturbance_code}
	 */
	@Column({ name: MechanicalSoilDisturbanceCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: MechanicalSoilDisturbanceCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: MechanicalSoilDisturbanceCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of MechanicalSoilDisturbanceCode **

/**
 * @description Data Model Controller Class for MechanicalSoilDisturbanceCodeSchema and MechanicalSoilDisturbanceCode
 */
export class MechanicalSoilDisturbanceCodeController extends DataModelController<MechanicalSoilDisturbanceCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalSoilDisturbanceCodeController {
		return this.sharedInstance<MechanicalSoilDisturbanceCode>(MechanicalSoilDisturbanceCode, MechanicalSoilDisturbanceCodeSchema) as MechanicalSoilDisturbanceCodeController;
	}
}

// -------------------------------------
