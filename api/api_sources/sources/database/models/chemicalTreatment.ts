// ** Model: ChemicalTreatment from schema ChemicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { ChemicalTreatmentSchema } from '../database-schema';
import {
	SpeciesAgencyCodeSchema,
	PesticideEmployerCodeSchema,
	ProjectManagementPlanCodeSchema,
	ChemicalTreatmentEmployeeSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';
import {
	SpeciesAgencyCode,
	PesticideEmployerCode,
	ProjectManagementPlanCode,
	ChemicalTreatmentEmployee
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
	pup: string;
	speciesAgency: SpeciesAgencyCode;
	pesticideEmployer: PesticideEmployerCode;
	pmp: ProjectManagementPlanCode;
	firstApplicator?: ChemicalTreatmentEmployee;
	secondApplicator?: ChemicalTreatmentEmployee;
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
	pup?: string;
	speciesAgency?: SpeciesAgencyCode;
	pesticideEmployer?: PesticideEmployerCode;
	pmp?: ProjectManagementPlanCode;
	firstApplicator?: ChemicalTreatmentEmployee;
	secondApplicator?: ChemicalTreatmentEmployee;
}
// -- End: ChemicalTreatmentUpdateSpec --

/**
 * @description Data Model Class for ChemicalTreatmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for ChemicalTreatmentSchema',
	schema: ChemicalTreatmentSchema,
	apiResource: false
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
	 * @description Getter/Setter property for column {pesticide_use_permit}
	 */
	@Column({ name: ChemicalTreatmentSchema.columns.pup})
	@ModelProperty({type: PropertyType.string})
	pup: string;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => SpeciesAgencyCode, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.speciesAgency, referencedColumnName: SpeciesAgencyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

	/**
	 * @description Getter/Setter property for column {pesticide_employer_code_id}
	 */
	@ManyToOne( type => PesticideEmployerCode, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.pesticideEmployer, referencedColumnName: PesticideEmployerCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	pesticideEmployer: PesticideEmployerCode;
]
	/**
	 * @description Getter/Setter property for column {project_management_plan_code_id}
	 */
	@ManyToOne( type => ProjectManagementPlanCode, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.pmp, referencedColumnName: ProjectManagementPlanCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	pmp: ProjectManagementPlanCode;

	/**
	 * @description Getter/Setter property for column {first_applicator_chemical_treatment_employee_id}
	 */
	@ManyToOne( type => ChemicalTreatmentEmployee, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.firstApplicator, referencedColumnName: ChemicalTreatmentEmployeeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	firstApplicator: ChemicalTreatmentEmployee;

	/**
	 * @description Getter/Setter property for column {second_applicator_chemical_treatment_employee_id}
	 */
	@ManyToOne( type => ChemicalTreatmentEmployee )
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.secondApplicator, referencedColumnName: ChemicalTreatmentEmployeeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	secondApplicator: ChemicalTreatmentEmployee;

}

// -------------------------------------
