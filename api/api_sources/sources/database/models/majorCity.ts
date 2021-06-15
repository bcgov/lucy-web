// ** Model: MajorCity from schema MajorCitiesSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { MajorCitySchema } from '../database-schema';
import {
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import {
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description MajorCity create interface
 */
export interface MajorCitySpec {
	city_name: string;
    composite: string;
	city_latitude: number;
	city_longitude: number;
	country_code: string;
	province: string;
    location_abbreviation: string;
	closest_water_body: string;
	distance: number;
}
// -- End: MajorCitySpec --


/** Interface **/
/**
 * @description MajorCity update interface
 */
export interface MajorCityUpdateSpec {
	city_name?: string;
    composite?: string;
	city_latitude?: number;
	city_longitude?: number;
	country_code?: string;
	province?: string;
    location_abbreviation?: string;
	closest_water_body?: string;
	distance?: number;
}
// -- End: MajorCityUpdateSpec --

/**
 * @description Data Model Class for MajorCitySchema
 */
@ModelDescription({
	description: 'Data Model Class for MajorCitySchema',
	schema: MajorCitySchema,
	apiResource: false
})
@Entity( { name: MajorCitySchema.dbTable} )
export class MajorCity extends Record implements MajorCitySpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {major_city_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	major_city_id: number;

	/**
	 * @description Getter/Setter property for column {composite}
	 */
	@Column({ name: MajorCitySchema.columns.composite})
	@ModelProperty({type: PropertyType.string})
	composite: string;

    /**
	 * @description Getter/Setter property for column {city_name}
	 */
	@Column({ name: MajorCitySchema.columns.city_name})
	@ModelProperty({type: PropertyType.string})
	city_name: string;

    /**
	 * @description Getter/Setter property for column {city_longitude}
	 */
	@Column({name: MajorCitySchema.columns.city_longitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	city_longitude: number;

	/**
	 * @description Getter/Setter property for column {city_latitude}
	 */
	@Column({name: MajorCitySchema.columns.city_latitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	city_latitude: number;

	/**
	 * @description Getter/Setter property for column {country_code}
	 */
	@Column({ name: MajorCitySchema.columns.country_code})
	@ModelProperty({type: PropertyType.string})
	country_code: string;

	/**
	 * @description Getter/Setter property for column {province_code}
	 */
	@Column({ name: MajorCitySchema.columns.province})
	@ModelProperty({type: PropertyType.string})
	province: string;

    /**
	 * @description Getter/Setter property for column {location_abbreviation}
	 */
	@Column({ name: MajorCitySchema.columns.location_abbreviation})
	@ModelProperty({type: PropertyType.string})
	location_abbreviation: string;

	/**
	 * @description Getter/Setter property for column {closest_water_body}
	 */
	@Column({ name: MajorCitySchema.columns.closest_water_body})
	@ModelProperty({type: PropertyType.string})
	closest_water_body: string;

	/**
	 * @description Getter/Setter property for column {distance}
	 */
	@Column({name: MajorCitySchema.columns.distance, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	distance: number;

	/**
	 * @description Getter/Setter property for column {active}
	 */
	@Column({ name: MajorCitySchema.columns.active})
	@ModelProperty({type: PropertyType.boolean})
	active: boolean;
}

// -------------------------------------
