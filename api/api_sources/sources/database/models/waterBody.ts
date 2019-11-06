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
	typeEnum: number;
	name: string;
	typeName: string;
	typeCode: number;
	latitude: number;
	longitude: number;
	country: string;
	province: string;
	abbrev: string;
	closest: string;
	distance: number;
}
// -- End: WaterBodySpec --


/** Interface **/
/**
 * @description WaterBody update interface
 */
export interface WaterBodyUpdateSpec {
	typeEnum?: number;
	name?: string;
	typeName?: string;
	typeCode?: number;
	latitude?: number;
	longitude?: number;
	country?: string;
	province?: string;
	abbrev?: string;
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
	 * @description Getter/Setter property for column {type_enum}
	 */
	@Column({name: WaterBodySchema.columns.typeEnum, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	typeEnum: number;

	/**
	 * @description Getter/Setter property for column {name}
	 */
	@Column({ name: WaterBodySchema.columns.name})
	@ModelProperty({type: PropertyType.string})
	name: string;

	/**
	 * @description Getter/Setter property for column {type_name}
	 */
	@Column({ name: WaterBodySchema.columns.typeName})
	@ModelProperty({type: PropertyType.string})
	typeName: string;

	/**
	 * @description Getter/Setter property for column {type_code}
	 */
	@Column({name: WaterBodySchema.columns.typeCode, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	typeCode: number;

	/**
	 * @description Getter/Setter property for column {water_body_location_latitude}
	 */
	@Column({name: WaterBodySchema.columns.latitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	latitude: number;

	/**
	 * @description Getter/Setter property for column {water_body_location_longitude}
	 */
	@Column({name: WaterBodySchema.columns.longitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	longitude: number;

	/**
	 * @description Getter/Setter property for column {country}
	 */
	@Column({ name: WaterBodySchema.columns.country})
	@ModelProperty({type: PropertyType.string})
	country: string;

	/**
	 * @description Getter/Setter property for column {province}
	 */
	@Column({ name: WaterBodySchema.columns.province})
	@ModelProperty({type: PropertyType.string})
	province: string;

	/**
	 * @description Getter/Setter property for column {abbrev}
	 */
	@Column({ name: WaterBodySchema.columns.abbrev})
	@ModelProperty({type: PropertyType.string})
	abbrev: string;

	/**
	 * @description Getter/Setter property for column {closest}
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

}

// -------------------------------------
