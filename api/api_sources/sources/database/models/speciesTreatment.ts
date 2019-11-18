// ** Model: SpeciesTreatment from schema SpeciesTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { SpeciesTreatmentSchema } from '../database-schema';
import { ObservationSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import { Observation } from '../models';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description SpeciesTreatment create interface
 */
export interface SpeciesTreatmentSpec {
	treatmentAreaCoverage: number;
	observation: Observation;
}
// -- End: SpeciesTreatmentSpec --


/** Interface **/
/**
 * @description SpeciesTreatment update interface
 */
export interface SpeciesTreatmentUpdateSpec {
	treatmentAreaCoverage?: number;
	observation?: Observation;
}
// -- End: SpeciesTreatmentUpdateSpec --

/**
 * @description Data Model Class for SpeciesTreatmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for SpeciesTreatmentSchema',
	schema: SpeciesTreatmentSchema,
	apiResource: false
})
@Entity( { name: SpeciesTreatmentSchema.dbTable} )
export class SpeciesTreatment extends Record implements SpeciesTreatmentSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {species_treatment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	species_treatment_id: number;

	/**
	 * @description Getter/Setter property for column {species_treatment_area_coverage}
	 */
	@Column({name: SpeciesTreatmentSchema.columns.treatmentAreaCoverage, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	treatmentAreaCoverage: number;

	/**
	 * @description Getter/Setter property for column {observation_id}
	 */
	@ManyToOne( type => Observation, { eager: true})
	@JoinColumn({ name: SpeciesTreatmentSchema.columns.observation, referencedColumnName: ObservationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	observation: Observation;

}

// -------------------------------------
