// ** Model: MechanicalTreatment from schema MechanicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { MechanicalTreatmentSchema } from '../database-schema';
import {
	ObservationSchema,
	SpeciesSchema,
	SpeciesAgencyCodeSchema,
	MechanicalMethodCodeSchema,
	MechanicalDisposalMethodCodeSchema,
	MechanicalSoilDisturbanceCodeSchema,
	MechanicalRootRemovalCodeSchema,
	MechanicalTreatmentIssueCodeSchema,
	TreatmentProviderContractorSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import {
	Observation,
	Species,
	SpeciesAgencyCode,
	MechanicalMethodCode,
	MechanicalDisposalMethodCode,
	MechanicalSoilDisturbanceCode,
	MechanicalRootRemovalCode,
	MechanicalTreatmentIssueCode,
	TreatmentProviderContractor
} from '../models';


/** Interface **/
/**
 * @description MechanicalTreatment create interface
 */
export interface MechanicalTreatmentSpec {
	latitude: number;
	longitude: number;
	horizontalDimension: number;
	verticalDimension: number;
	applicatorFirstName: string;
	applicatorLastName: string;
	secondaryApplicatorFirstName: string;
	secondaryApplicatorLastName: string;
	date: string;
	paperFileReference: string;
	comment: string;
	signageOnSiteIndicator: boolean;
	observation: Observation;
	species: Species;
	speciesAgency: SpeciesAgencyCode;
	mechanicalMethod: MechanicalMethodCode;
	mechanicalDisposalMethod: MechanicalDisposalMethodCode;
	soilDisturbance: MechanicalSoilDisturbanceCode;
	rootRemoval: MechanicalRootRemovalCode;
	issue: MechanicalTreatmentIssueCode;
	providerContractor: TreatmentProviderContractor;
}
// -- End: MechanicalTreatmentSpec --


/** Interface **/
/**
 * @description MechanicalTreatment update interface
 */
export interface MechanicalTreatmentUpdateSpec {
	latitude?: number;
	longitude?: number;
	horizontalDimension?: number;
	verticalDimension?: number;
	applicatorFirstName?: string;
	applicatorLastName?: string;
	secondaryApplicatorFirstName?: string;
	secondaryApplicatorLastName?: string;
	date?: string;
	paperFileReference?: string;
	comment?: string;
	signageOnSiteIndicator?: boolean;
	observation?: Observation;
	species?: Species;
	speciesAgency?: SpeciesAgencyCode;
	mechanicalMethod?: MechanicalMethodCode;
	mechanicalDisposalMethod?: MechanicalDisposalMethodCode;
	soilDisturbance?: MechanicalSoilDisturbanceCode;
	rootRemoval?: MechanicalRootRemovalCode;
	issue?: MechanicalTreatmentIssueCode;
	providerContractor?: TreatmentProviderContractor;
}
// -- End: MechanicalTreatmentUpdateSpec --

/**
 * @description Data Model Class for MechanicalTreatmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalTreatmentSchema',
	schema: MechanicalTreatmentSchema,
	apiResource: false
})
@Entity( { name: MechanicalTreatmentSchema.dbTable} )
export class MechanicalTreatment {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_treatment_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_location_latitude}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.latitude})
	@ModelProperty({type: PropertyType.number})
	latitude: number;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_location_longitude}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.longitude})
	@ModelProperty({type: PropertyType.number})
	longitude: number;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_area_horizontal_dimension}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.horizontalDimension})
	@ModelProperty({type: PropertyType.number})
	horizontalDimension: number;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_area_vertical_dimension}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.verticalDimension})
	@ModelProperty({type: PropertyType.number})
	verticalDimension: number;

	/**
	 * @description Getter/Setter property for column {applicator_first_name}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.applicatorFirstName})
	@ModelProperty({type: PropertyType.string})
	applicatorFirstName: string;

	/**
	 * @description Getter/Setter property for column {applicator_last_name}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.applicatorLastName})
	@ModelProperty({type: PropertyType.string})
	applicatorLastName: string;

	/**
	 * @description Getter/Setter property for column {secondary_applicator_first_name}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.secondaryApplicatorFirstName})
	@ModelProperty({type: PropertyType.string})
	secondaryApplicatorFirstName: string;

	/**
	 * @description Getter/Setter property for column {secondary_applicator_last_name}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.secondaryApplicatorLastName})
	@ModelProperty({type: PropertyType.string})
	secondaryApplicatorLastName: string;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_date}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.date})
	@ModelProperty({type: PropertyType.string})
	date: string;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_paper_file_ref}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.paperFileReference})
	@ModelProperty({type: PropertyType.string})
	paperFileReference: string;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_comment}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.comment})
	@ModelProperty({type: PropertyType.string})
	comment: string;

	/**
	 * @description Getter/Setter property for column {signage_on_site_ind}
	 */
	@Column({ name: MechanicalTreatmentSchema.columns.signageOnSiteIndicator})
	@ModelProperty({type: PropertyType.boolean})
	signageOnSiteIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {observation_id}
	 */
	@ManyToOne( type => Observation, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.observation, referencedColumnName: ObservationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	observation: Observation;

	/**
	 * @description Getter/Setter property for column {species_id}
	 */
	@ManyToOne( type => Species, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.species, referencedColumnName: SpeciesSchema.pk})
	@ModelProperty({type: PropertyType.object})
	species: Species;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => SpeciesAgencyCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.speciesAgency, referencedColumnName: SpeciesAgencyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

	/**
	 * @description Getter/Setter property for column {mechanical_method_code_id}
	 */
	@ManyToOne( type => MechanicalMethodCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.mechanicalMethod, referencedColumnName: MechanicalMethodCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	mechanicalMethod: MechanicalMethodCode;

	/**
	 * @description Getter/Setter property for column {mechanical_disposal_method_code_id}
	 */
	@ManyToOne( type => MechanicalDisposalMethodCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.mechanicalDisposalMethod, referencedColumnName: MechanicalDisposalMethodCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	mechanicalDisposalMethod: MechanicalDisposalMethodCode;

	/**
	 * @description Getter/Setter property for column {mechanical_soil_disturbance_code_id}
	 */
	@ManyToOne( type => MechanicalSoilDisturbanceCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.soilDisturbance, referencedColumnName: MechanicalSoilDisturbanceCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	soilDisturbance: MechanicalSoilDisturbanceCode;

	/**
	 * @description Getter/Setter property for column {mechanical_root_removal_code_id}
	 */
	@ManyToOne( type => MechanicalRootRemovalCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.rootRemoval, referencedColumnName: MechanicalRootRemovalCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	rootRemoval: MechanicalRootRemovalCode;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_issue_code_id}
	 */
	@ManyToOne( type => MechanicalTreatmentIssueCode, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.issue, referencedColumnName: MechanicalTreatmentIssueCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	issue: MechanicalTreatmentIssueCode;

	/**
	 * @description Getter/Setter property for column {treatment_provider_contractor_id}
	 */
	@ManyToOne( type => TreatmentProviderContractor, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.providerContractor, referencedColumnName: TreatmentProviderContractorSchema.pk})
	@ModelProperty({type: PropertyType.object})
	providerContractor: TreatmentProviderContractor;

}

// -------------------------------------
