// ** Model: ProposedActionCode from schema ProposedActionCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ProposedActionCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
/**
 * @description Data Model Class for ProposedActionCodeSchema
 */
@Entity( { name: ProposedActionCodeSchema.dbTable} )
export class ProposedActionCode {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_proposed_action_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_proposed_action_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_proposed_action_code}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ProposedActionCode **

/**
 * @description Data Model Controller Class for ProposedActionCodeSchema and ProposedActionCode
 */
export class ProposedActionCodeController extends DataModelController<ProposedActionCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ProposedActionCodeController {
		return this.sharedInstance<ProposedActionCode>(ProposedActionCode, ProposedActionCodeSchema) as ProposedActionCodeController;
	}
}

// -------------------------------------
