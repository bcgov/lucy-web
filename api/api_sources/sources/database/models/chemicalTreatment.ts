// ** Model: ChemicalTreatment from schema ChemicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { ChemicalTreatmentSchema } from '../database-schema';
import {
	SpeciesAgencyCodeSchema,
	PesticideEmployerCodeSchema,
	ProjectManagementPlanCodeSchema,
    ChemicalTreatmentEmployeeSchema,
	WindDirectionCodesSchema,
	ChemicalTreatmentMethodCodeSchema,
	SpaceGeomSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';
import {
	SpeciesAgencyCode,
	PesticideEmployerCode,
	ProjectManagementPlanCode,
	ChemicalTreatmentEmployee,
	WindDirectionCodes,
	ChemicalTreatmentMethodCode,
	SpaceGeom
} from '../models';

import { Record } from './generic.data.models';
import { HerbicideTankMix } from './herbicideTankMix';
import { ObservationChemicalTreatment } from './observationChemicalTreatment';

/** Interface **/
/**
 * @description ChemicalTreatment create interface
 */
export interface ChemicalTreatmentSpec {
	date: string;
	primaryPaperFileReference: string;
	secondaryPaperFileReference: string;
	pup: string;
	temperature: number;
	humidity: number;
	windSpeed: number;
	speciesAgency: SpeciesAgencyCode;
	pesticideEmployer: PesticideEmployerCode;
	pmp: ProjectManagementPlanCode;
	firstApplicator: ChemicalTreatmentEmployee;
	secondApplicator: ChemicalTreatmentEmployee;
	windDirection: WindDirectionCodes;
	methodCode: ChemicalTreatmentMethodCode;
	additionalComments: string;
	mixDeliveryRate: number;
	spaceGeom: SpaceGeom;
}
// -- End: ChemicalTreatmentSpec --


/** Interface **/
/**
 * @description ChemicalTreatment update interface
 */
export interface ChemicalTreatmentUpdateSpec {
	date?: string;
	primaryPaperFileReference?: string;
	secondaryPaperFileReference?: string;
	pup?: string;
	temperature?: number;
	humidity?: number;
	windSpeed?: number;
	speciesAgency?: SpeciesAgencyCode;
	pesticideEmployer?: PesticideEmployerCode;
	pmp?: ProjectManagementPlanCode;
	firstApplicator?: ChemicalTreatmentEmployee;
	secondApplicator?: ChemicalTreatmentEmployee;
	windDirection?: WindDirectionCodes;
	methodCode?: ChemicalTreatmentMethodCode;
	additionalComments?: string;
	mixDeliveryRate?: number;
	spaceGeom?: SpaceGeom;
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
	 * @description Getter/Setter property for column {temperature}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.temperature, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	temperature: number;

	/**
	 * @description Getter/Setter property for column {humidity}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.humidity, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	humidity: number;

	/**
	 * @description Getter/Setter property for column {wind_speed}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.windSpeed, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	windSpeed: number;

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
	@ManyToOne( type => ChemicalTreatmentEmployee)
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.secondApplicator, referencedColumnName: ChemicalTreatmentEmployeeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	secondApplicator: ChemicalTreatmentEmployee;

	/**
	 * @description Getter/Setter property for column {wind_direction_code_id}
	 */
	@ManyToOne( type => WindDirectionCodes, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.windDirection, referencedColumnName: WindDirectionCodesSchema.pk})
	@ModelProperty({type: PropertyType.object})
	windDirection: WindDirectionCodes;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_method_id}
	 */
	@ManyToOne( type => ChemicalTreatmentMethodCode, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.methodCode, referencedColumnName: ChemicalTreatmentMethodCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	methodCode: ChemicalTreatmentMethodCode;

    /**
	 * @description Getter/Setter property for column {space_geom_id}
	 */
	@ManyToOne( type => SpaceGeom, { eager: true})
	@JoinColumn({ name: ChemicalTreatmentSchema.columns.spaceGeom, referencedColumnName: SpaceGeomSchema.pk})
	@ModelProperty({type: PropertyType.object})
	spaceGeom: SpaceGeom;

	/**
	 * @description Getter/Setter property for column {additional_comments}
	 */
	@Column({ name: ChemicalTreatmentSchema.columns.additionalComments})
	@ModelProperty({type: PropertyType.string})
	additionalComments: string;

	/**
	 * @description Getter/Setter property for column {mix_delivery_rate}
	 */
	@Column({name: ChemicalTreatmentSchema.columns.mixDeliveryRate, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	mixDeliveryRate: number;

	/**
	 * @description Getter/Setter property for tankMixes
	 */
	@OneToMany( type => HerbicideTankMix, tankMix => tankMix.chemicalTreatment, {eager: true})
	@ModelProperty({type: PropertyType.array, $ref: '#/definitions/HerbicideTankMix'})
	tankMixes: HerbicideTankMix[];

	/**
	 *  @description Getter/Setter property for related observations
	 */
	@OneToMany( type => ObservationChemicalTreatment, obj => obj.chemicalTreatment, { eager: true})
	@ModelProperty({type: PropertyType.array, $ref: '#/definitions/ObservationChemicalTreatment'})
	speciesObservations: ObservationChemicalTreatment[];

}

// -------------------------------------
