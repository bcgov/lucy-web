// ** Model: MechanicalDisposalMethodCode from schema MechanicalDisposalMethodCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { MechanicalDisposalMethodCodeSchema } from '../database-schema';


import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { ApplicationCode } from './generic.data.models';


/** Interface **/
/**
 * @description MechanicalDisposalMethodCode create interface
 */
export interface MechanicalDisposalMethodCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: MechanicalDisposalMethodCodeSpec --


/** Interface **/
/**
 * @description MechanicalDisposalMethodCode update interface
 */
export interface MechanicalDisposalMethodCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: MechanicalDisposalMethodCodeUpdateSpec --

/**
 * @description Data Model Class for MechanicalDisposalMethodCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalDisposalMethodCodeSchema',
	schema: MechanicalDisposalMethodCodeSchema,
	apiResource: false
})
@Entity( { name: MechanicalDisposalMethodCodeSchema.dbTable} )
export class MechanicalDisposalMethodCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_disposal_method_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_disposal_method_code_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_disposal_method_code}
	 */
	@Column({ name: MechanicalDisposalMethodCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: MechanicalDisposalMethodCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: MechanicalDisposalMethodCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}

// -------------------------------------
