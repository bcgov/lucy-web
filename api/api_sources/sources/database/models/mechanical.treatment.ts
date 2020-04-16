/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: mechanical.treatment.ts
 * Project: lucy
 * File Created: Friday, 12th August 2019 9:38:01 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 3rd September 2019 12:16:34 pm
 * Modified By: pushan
 * -----
 */

// ** Model: MechanicalTreatment from schema MechanicalTreatmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import { MechanicalTreatmentSchema, MechanicalTreatmentObservationSchema } from '../database-schema';
import {
	ObservationSchema,
	SpeciesAgencyCodeSchema,
	MechanicalMethodCodeSchema,
	MechanicalDisposalMethodCodeSchema,
	MechanicalSoilDisturbanceCodeSchema,
	MechanicalRootRemovalCodeSchema,
	MechanicalTreatmentIssueCodeSchema,
	TreatmentProviderContractorSchema,
	SpaceGeomSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import {
	Observation,
	SpeciesAgencyCode,
	MechanicalMethodCode,
	MechanicalDisposalMethodCode,
	MechanicalSoilDisturbanceCode,
	MechanicalRootRemovalCode,
	MechanicalTreatmentIssueCode,
	TreatmentProviderContractor,
	SpaceGeom
} from '../models';
import { Record } from './generic.data.models';
import { DateTransformer } from '../../libs/transformer';


/** Interface **/
/**
 * @description MechanicalTreatment create interface
 */
export interface MechanicalTreatmentSpec {
	applicatorFirstName: string;
	applicatorLastName: string;
	secondaryApplicatorFirstName: string;
	secondaryApplicatorLastName: string;
	date: string;
	paperFileReference: string;
	comment: string;
	signageOnSiteIndicator: boolean;
	speciesAgency: SpeciesAgencyCode;
	mechanicalMethod: MechanicalMethodCode;
	mechanicalDisposalMethod: MechanicalDisposalMethodCode;
	soilDisturbance: MechanicalSoilDisturbanceCode;
	rootRemoval: MechanicalRootRemovalCode;
	issue: MechanicalTreatmentIssueCode;
	providerContractor: TreatmentProviderContractor;
	spaceGeom: SpaceGeom;
	observations: Observation[];
}
// -- End: MechanicalTreatmentSpec --


/** Interface **/
/**
 * @description MechanicalTreatment update interface
 */
export interface MechanicalTreatmentUpdateSpec {
	applicatorFirstName?: string;
	applicatorLastName?: string;
	secondaryApplicatorFirstName?: string;
	secondaryApplicatorLastName?: string;
	date?: string;
	paperFileReference?: string;
	comment?: string;
	signageOnSiteIndicator?: boolean;
	speciesAgency?: SpeciesAgencyCode;
	mechanicalMethod?: MechanicalMethodCode;
	mechanicalDisposalMethod?: MechanicalDisposalMethodCode;
	soilDisturbance?: MechanicalSoilDisturbanceCode;
	rootRemoval?: MechanicalRootRemovalCode;
	issue?: MechanicalTreatmentIssueCode;
	providerContractor?: TreatmentProviderContractor;
	spaceGeom?: SpaceGeom;
	observations?: Observation[];
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
export class MechanicalTreatment extends Record {

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
	@Column({
		name: MechanicalTreatmentSchema.columns.date,
		transformer: new DateTransformer
	})
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

	/**
	 * @description Getter/Setter property for column {space_geom_id}
	 */
	@ManyToOne( type => SpaceGeom, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentSchema.columns.spaceGeom, referencedColumnName: SpaceGeomSchema.pk})
	@ModelProperty({type: PropertyType.object})
	spaceGeom: SpaceGeom;

	/**
	 * @description ManyToMany relationship
	 */
	@ManyToMany(type => Observation, observation => observation.mechanicalTreatmentsFetcher, { eager: true } )
    @JoinTable({
        name: MechanicalTreatmentObservationSchema.dbTable,
        joinColumn: {
			name: MechanicalTreatmentObservationSchema.columns.mechanicalTreatment,
            referencedColumnName: MechanicalTreatmentSchema.id
        },
        inverseJoinColumn: {
            name: MechanicalTreatmentObservationSchema.columns.observation,
            referencedColumnName: ObservationSchema.id
        }
    })
    @ModelProperty({type: PropertyType.object})
    observations: Observation[];

}
// -------------------------------------
