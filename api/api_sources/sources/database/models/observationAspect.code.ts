// ** Model: AspectCode from schema AspectCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { AspectCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';
/**
 * @description Data Model Class for AspectCodeSchema
 */
@Entity( { name: AspectCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: AspectCodeSchema
})
export class AspectCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_aspect_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_aspect_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_aspect_code}
	 */
	@Column({ name: AspectCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: AspectCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: AspectCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of AspectCode **

/**
 * @description Data Model Controller Class for AspectCodeSchema and AspectCode
 */
export class AspectCodeController extends DataModelController<AspectCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AspectCodeController {
		return this.sharedInstance<AspectCode>(AspectCode, AspectCodeSchema) as AspectCodeController;
	}
}

// -------------------------------------
