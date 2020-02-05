// ** Model: Country from schema CountrySchema **

import { Column, Entity, PrimaryColumn} from 'typeorm';
import { CountrySchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';

import { Record, RecordController } from './generic.data.models';

/** Interface **/
/**
 * @description Country create interface
 */
export interface CountrySpec {
	countryCode: string;
	description: string;
}
// -- End: CountrySpec --


/** Interface **/
/**
 * @description Country update interface
 */
export interface CountryUpdateSpec {
	countryCode?: string;
	description?: string;
}
// -- End: CountryUpdateSpec --

/**
 * @description Data Model Class for CountrySchema
 */
@ModelDescription({
	description: 'Data Model Class for CountrySchema',
	schema: CountrySchema,
	apiResource: false
})
@Entity( { name: CountrySchema.dbTable} )
export class Country extends Record implements CountrySpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {country_code}
	 */
	@PrimaryColumn({ name: CountrySchema.columns.countryCode})
	@ModelProperty({type: PropertyType.string})
	countryCode: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: CountrySchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** CountryController ** //


/**
 * @description Data Model Controller Class for CountrySchema and Country
 */
export class CountryController extends RecordController<Country> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): CountryController {
		return this.sharedInstance<Country>(Country, CountrySchema) as CountryController;
	}
}

// -------------------------------------
