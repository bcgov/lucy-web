// ** Model: SpaceGeom from schema SpaceGeomSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { SpaceGeomSchema } from '../database-schema';
import {
	ObservationGeometryCodeSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import {
	ObservationGeometryCode
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description SpaceGeom create interface
 */
export interface SpaceGeomSpec {
	latitude: number;
	longitude: number;
	hexId: string;
	subHexId: string;
	inputGeometry: object;
	metaData: string;
	geometry: ObservationGeometryCode;
}
// -- End: SpaceGeomSpec --


/** Interface **/
/**
 * @description SpaceGeom update interface
 */
export interface SpaceGeomUpdateSpec {
	latitude?: number;
	longitude?: number;
	hexId?: string;
	subHexId?: string;
	inputGeometry?: object;
	metaData?: string;
	geometry?: ObservationGeometryCode;
}
// -- End: SpaceGeomUpdateSpec --

/**
 * @description Data Model Class for SpaceGeomSchema
 */
@ModelDescription({
	description: 'Data Model Class for SpaceGeomSchema',
	schema: SpaceGeomSchema,
	apiResource: false
})
@Entity( { name: SpaceGeomSchema.dbTable} )
export class SpaceGeom extends Record implements SpaceGeomSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {space_geom_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	space_geom_id: number;

	/**
	 * @description Getter/Setter property for column {latitude}
	 */
	@Column({name: SpaceGeomSchema.columns.latitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	latitude: number;

	/**
	 * @description Getter/Setter property for column {longitude}
	 */
	@Column({name: SpaceGeomSchema.columns.longitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	longitude: number;

	/**
	 * @description Getter/Setter property for column {hex_id}
	 */
	@Column({ name: SpaceGeomSchema.columns.hexId})
	@ModelProperty({type: PropertyType.string})
	hexId: string;

	/**
	 * @description Getter/Setter property for column {sub_hex_id}
	 */
	@Column({ name: SpaceGeomSchema.columns.subHexId})
	@ModelProperty({type: PropertyType.string})
	subHexId: string;

	/**
	 * @description Getter/Setter property for column {input_geometry}
	 */
	@Column({ name: SpaceGeomSchema.columns.inputGeometry, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	inputGeometry: object;

	/**
	 * @description Getter/Setter property for column {meta_data}
	 */
	@Column({ name: SpaceGeomSchema.columns.metaData})
	@ModelProperty({type: PropertyType.string})
	metaData: string;

	/**
	 * @description Getter/Setter property for column {observation_geometry_code_id}
	 */
	@ManyToOne( type => ObservationGeometryCode, { eager: true})
	@JoinColumn({ name: SpaceGeomSchema.columns.geometry, referencedColumnName: ObservationGeometryCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	geometry: ObservationGeometryCode;

}

// -------------------------------------
