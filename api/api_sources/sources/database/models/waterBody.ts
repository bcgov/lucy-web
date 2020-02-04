// ** Model: WaterBody from schema WaterBodySchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { WaterBodySchema } from '../database-schema';
import {
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import {
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description WaterBody create interface
 */
export interface WaterBodySpec {
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	province: string;
	closest: string;
	distance: number;
}
// -- End: WaterBodySpec --


/** Interface **/
/**
 * @description WaterBody update interface
 */
export interface WaterBodyUpdateSpec {
	name?: string;
	latitude?: number;
	longitude?: number;
	country?: string;
	province?: string;
	closest?: string;
	distance?: number;
}
// -- End: WaterBodyUpdateSpec --

/**
 * @description Data Model Class for WaterBodySchema
 */
@ModelDescription({
	description: 'Data Model Class for WaterBodySchema',
	schema: WaterBodySchema,
	apiResource: false
})
@Entity( { name: WaterBodySchema.dbTable} )
export class WaterBody extends Record implements WaterBodySpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {water_body_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	water_body_id: number;

	/**
	 * @description Getter/Setter property for column {water_body_name}
	 */
	@Column({ name: WaterBodySchema.columns.name})
	@ModelProperty({type: PropertyType.string})
	name: string;

	/**
	 * @description Getter/Setter property for column {water_body_latitude}
	 */
	@Column({name: WaterBodySchema.columns.latitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	latitude: number;

	/**
	 * @description Getter/Setter property for column {water_body_longitude}
	 */
	@Column({name: WaterBodySchema.columns.longitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	longitude: number;

	/**
	 * @description Getter/Setter property for column {country_code}
	 */
	@Column({ name: WaterBodySchema.columns.country})
	@ModelProperty({type: PropertyType.string})
	country: string;

	/**
	 * @description Getter/Setter property for column {province_code}
	 */
	@Column({ name: WaterBodySchema.columns.province})
	@ModelProperty({type: PropertyType.string})
	province: string;

	/**
	 * @description Getter/Setter property for column {closest_city}
	 */
	@Column({ name: WaterBodySchema.columns.closest})
	@ModelProperty({type: PropertyType.string})
	closest: string;

	/**
	 * @description Getter/Setter property for column {distance}
	 */
	@Column({name: WaterBodySchema.columns.distance, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	distance: number;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: WaterBodySchema.columns.active})
	@ModelProperty({type: PropertyType.boolean})
	active: boolean;
}

// -------------------------------------
