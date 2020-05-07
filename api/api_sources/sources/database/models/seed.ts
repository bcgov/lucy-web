// ** Model: Seed from schema SeedSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SeedSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description Seed create interface
 */
export interface SeedSpec {
	reference: string;
	seedTarget: string;
}
// -- End: SeedSpec --


/** Interface **/
/**
 * @description Seed update interface
 */
export interface SeedUpdateSpec {
	reference?: string;
	seedTarget?: string;
}
// -- End: SeedUpdateSpec --

/**
 * @description Data Model Class for SeedSchema
 */
@ModelDescription({
	description: 'Data Model Class for SeedSchema',
	schema: SeedSchema,
	apiResource: false
})
@Entity( { name: SeedSchema.dbTable} )
export class Seed extends Record implements SeedSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {seed_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	seed_id: number;

	/**
	 * @description Getter/Setter property for column {reference}
	 */
	@Column({ name: SeedSchema.columns.reference})
	@ModelProperty({type: PropertyType.string})
	reference: string;

	/**
	 * @description Getter/Setter property for column {seed_target}
	 */
	@Column({ name: SeedSchema.columns.seedTarget})
	@ModelProperty({type: PropertyType.string})
	seedTarget: string;

}
