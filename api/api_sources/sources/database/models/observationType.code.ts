// ** Model  ObservationTypeCode from schema ObservationTypeCodeSchema ** 
// ** Model: ObservationTypeCode from schema ObservationTypeCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ObservationTypeCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './user';
/**
 * @description Data Model Class for ObservationTypeCodeSchema
 */
@Entity( { name: ObservationTypeCodeSchema.dbTable} )
export class ObservationTypeCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_type_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_type_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_type_code}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ObservationTypeCode **

/**
 * @description Data Model Controller Class for ObservationTypeCodeSchema and ObservationTypeCode
 */
export class ObservationTypeCodeController extends DataModelController<ObservationTypeCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObservationTypeCodeController {
		return this.sharedInstance<ObservationTypeCode>(ObservationTypeCode, ObservationTypeCodeSchema) as ObservationTypeCodeController;
	}
}

// -------------------------------------
