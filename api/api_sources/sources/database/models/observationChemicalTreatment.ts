// ** Model: ObservationChemicalTreatment from schema ObservationChemicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { ObservationChemicalTreatmentSchema } from '../database-schema';
import {
	ObservationSchema,
	ChemicalTreatmentSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import {
	Observation,
	ChemicalTreatment
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ObservationChemicalTreatment create interface
 */
export interface ObservationChemicalTreatmentSpec {
	treatmentAreaCoverage: number;
	observation: Observation;
	chemicalTreatment: ChemicalTreatment;
}
// -- End: ObservationChemicalTreatmentSpec --


/** Interface **/
/**
 * @description ObservationChemicalTreatment update interface
 */
export interface ObservationChemicalTreatmentUpdateSpec {
	treatmentAreaCoverage?: number;
	observation?: Observation;
	chemicalTreatment?: ChemicalTreatment;
}
// -- End: ObservationChemicalTreatmentUpdateSpec --

/**
 * @description Data Model Class for ObservationChemicalTreatmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for ObservationChemicalTreatmentSchema',
	schema: ObservationChemicalTreatmentSchema,
	apiResource: false
})
@Entity( { name: ObservationChemicalTreatmentSchema.dbTable} )
export class ObservationChemicalTreatment extends Record implements ObservationChemicalTreatmentSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_chemical_treatment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_chemical_treatment_id: number;

	/**
	 * @description Getter/Setter property for column {species_treatment_area_coverage}
	 */
	@Column({name: ObservationChemicalTreatmentSchema.columns.treatmentAreaCoverage, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	treatmentAreaCoverage: number;

	/**
	 * @description Getter/Setter property for column {observation_id}
	 */
	@ManyToOne( type => Observation, { eager: true})
	@JoinColumn({ name: ObservationChemicalTreatmentSchema.columns.observation, referencedColumnName: ObservationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	observation: Observation;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_id}
	 */
	@ManyToOne( type => ChemicalTreatment, { eager: false})
	@JoinColumn({ name: ObservationChemicalTreatmentSchema.columns.chemicalTreatment, referencedColumnName: ChemicalTreatmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	chemicalTreatment: ChemicalTreatment;

}

// -------------------------------------
