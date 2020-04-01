// ** Model: AdultMusselsLocation from schema AdultMusselsLocationSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { AdultMusselsLocationSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record, RecordController } from './generic.data.models';

/** Interface **/
/**
 * @description AdultMusselsLocation create interface
 */
export interface AdultMusselsLocationSpec {
	description: string;
}
// -- End: AdultMusselsLocationSpec --


/** Interface **/
/**
 * @description AdultMusselsLocation update interface
 */
export interface AdultMusselsLocationUpdateSpec {
	description?: string;
}
// -- End: AdultMusselsLocationUpdateSpec --

/**
 * @description Data Model Class for AdultMusselsLocationSchema
 */
@ModelDescription({
	description: 'Data Model Class for AdultMusselsLocationSchema',
	schema: AdultMusselsLocationSchema,
	apiResource: false
})
@Entity( { name: AdultMusselsLocationSchema.dbTable} )
export class AdultMusselsLocation extends Record implements AdultMusselsLocationSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {adult_mussels_location_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	adult_mussels_location_code_id: number;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: AdultMusselsLocationSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** AdultMusselsLocationController ** //


/**
 * @description Data Model Controller Class for AdultMusselsLocationSchema and AdultMusselsLocation
 */
export class AdultMusselsLocationController extends RecordController<AdultMusselsLocation> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AdultMusselsLocationController {
		return this.sharedInstance<AdultMusselsLocation>(AdultMusselsLocation, AdultMusselsLocationSchema) as AdultMusselsLocationController;
	}
}

// -------------------------------------
