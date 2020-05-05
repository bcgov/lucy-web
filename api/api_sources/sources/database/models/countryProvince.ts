// ** Model: CountryProvince from schema CountryProvinceSchema **

import { Column, Entity, PrimaryColumn} from 'typeorm';
import { CountryProvinceSchema } from '../database-schema';
import {
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';

import { Record, RecordController } from './generic.data.models';
import { RandomizeSelection } from '../../libs/utilities';

/** Interface **/
/**
 * @description CountryProvince create interface
 */
export interface CountryProvinceSpec {
	countryCode: string;
	provinceCode: string;
	description: string;
}
// -- End: CountryProvinceSpec --


/** Interface **/
/**
 * @description CountryProvince update interface
 */
export interface CountryProvinceUpdateSpec {
	countryCode?: string;
	provinceCode?: string;
	description?: string;
}
// -- End: CountryProvinceUpdateSpec --

/**
 * @description Data Model Class for CountryProvinceSchema
 */
@ModelDescription({
	description: 'Data Model Class for CountryProvinceSchema',
	schema: CountryProvinceSchema,
	apiResource: false
})
@Entity( { name: CountryProvinceSchema.dbTable} )
export class CountryProvince extends Record implements CountryProvinceSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {country_code}
	 */
	@PrimaryColumn({ name: CountryProvinceSchema.columns.countryCode})
	@ModelProperty({type: PropertyType.string})
	countryCode: string;

	/**
	 * @description Getter/Setter property for column {province_code}
	 */
	@PrimaryColumn({ name: CountryProvinceSchema.columns.provinceCode})
	@ModelProperty({type: PropertyType.string})
	provinceCode: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: CountryProvinceSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** CountryProvinceController ** //


/**
 * @description Data Model Controller Class for CountryProvinceSchema and CountryProvince
 */
export class CountryProvinceController extends RecordController<CountryProvince> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): CountryProvinceController {
		return this.sharedInstance<CountryProvince>(CountryProvince, CountryProvinceSchema) as CountryProvinceController;
	}

	async random(): Promise<CountryProvince> {
		// Get all
		const all: CountryProvince[] = await this.all();
		return RandomizeSelection(all);
	}
}

// -------------------------------------
