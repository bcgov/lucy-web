// ** Model: ChemicalTreatment from schema ChemicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { ChemicalTreatmentSchema } from '../database-schema';
import {
	SpeciesAgencyCodeSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';
import {
	SpeciesAgencyCode
} from '../models';
import { Record } from './generic.data.models';


/** Interface **/
/**
 * @description ChemicalTreatment create interface
 */
export interface ChemicalTreatmentSpec {
	latitude: number;
	longitude: number;
	date: string;
	primaryPaperFileReference: string;
	secondaryPaperFileReference: string;
	speciesAgency: SpeciesAgencyCode;
}
// -- End: ChemicalTreatmentSpec --


/** Interface **/
/**
 * @description ChemicalTreatment update interface
 */
export interface ChemicalTreatmentUpdateSpec {
	latitude?: number;
	longitude?: number;
	date?: string;
	primaryPaperFileReference?: string;
	secondaryPaperFileReference?: string;
	speciesAgency?: SpeciesAgencyCode;
}
// -- End: ChemicalTreatmentUpdateSpec --

/**
 * @description Data Model Class for ChemicalTreatmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for ChemicalTreatmentSchema',
	schema: ChemicalTreatmentSchema,
	apiResource: true
})
@Entity( { name: ChemicalTreatmentSchema.dbTable} )
export class ChemicalTreatment extends Record implements ChemicalTreatmentSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {chemical_treatment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	chemical_treatment_id: number;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_location_latitude}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.latitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	latitude: number;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_location_longitude}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.longitude, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	longitude: number;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_date}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.date, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	date: string;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_primary_paper_file_ref}
	 */
	@Column({ name: ChemicalTreatmentSchema.columns.primaryPaperFileReference})
	@ModelProperty({type: PropertyType.string})
	primaryPaperFileReference: string;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_secondary_paper_file_ref}
	 */
	@Column({ name: ChemicalTreatmentSchema.columns.secondaryPaperFileReference})
	@ModelProperty({type: PropertyType.string})
	secondaryPaperFileReference: string;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => SpeciesAgencyCode, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.speciesAgency, referencedColumnName: SpeciesAgencyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

}

// -------------------------------------
