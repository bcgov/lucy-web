// ** Model: AdultMusselsFoundLocation from schema AdultMusselsFoundLocationSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { AdultMusselsFoundLocationSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description AdultMusselsFoundLocation create interface
 */
export interface AdultMusselsFoundLocationSpec {
	description: string;
}
// -- End: AdultMusselsFoundLocationSpec --


/** Interface **/
/**
 * @description AdultMusselsFoundLocation update interface
 */
export interface AdultMusselsFoundLocationUpdateSpec {
	description?: string;
}
// -- End: AdultMusselsFoundLocationUpdateSpec --

/**
 * @description Data Model Class for AdultMusselsFoundLocationSchema
 */
@ModelDescription({
	description: 'Data Model Class for AdultMusselsFoundLocationSchema',
	schema: AdultMusselsFoundLocationSchema,
	apiResource: false
})
@Entity( { name: AdultMusselsFoundLocationSchema.dbTable} )
export class AdultMusselsFoundLocation extends Record implements AdultMusselsFoundLocationSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {adult_mussels_found_location_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	adult_mussels_found_location_id: number;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: AdultMusselsFoundLocationSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** AdultMusselsFoundLocationController ** //


/**
 * @description Data Model Controller Class for AdultMusselsFoundLocationSchema and AdultMusselsFoundLocation
 */
export class AdultMusselsFoundLocationController extends DataModelController<AdultMusselsFoundLocation> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AdultMusselsFoundLocationController {
		return this.sharedInstance<AdultMusselsFoundLocation>(AdultMusselsFoundLocation, AdultMusselsFoundLocationSchema) as AdultMusselsFoundLocationController;
	}
}

// -------------------------------------
