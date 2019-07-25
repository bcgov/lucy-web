// ** Model  ObservationGeometryCode from schema ObservationGeometryCodeSchema ** 
// ** Model: ObservationGeometryCode from schema ObservationGeometryCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ObservationGeometryCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './user';
/**
 * @description Data Model Class for ObservationGeometryCodeSchema
 */
@Entity( { name: ObservationGeometryCodeSchema.dbTable} )
export class ObservationGeometryCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_geometry_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_geometry_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_geometry_code}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ObservationGeometryCode **

/**
 * @description Data Model Controller Class for ObservationGeometryCodeSchema and ObservationGeometryCode
 */
export class ObservationGeometryCodeController extends DataModelController<ObservationGeometryCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObservationGeometryCodeController {
		return this.sharedInstance<ObservationGeometryCode>(ObservationGeometryCode, ObservationGeometryCodeSchema) as ObservationGeometryCodeController;
	}
}

// -------------------------------------
