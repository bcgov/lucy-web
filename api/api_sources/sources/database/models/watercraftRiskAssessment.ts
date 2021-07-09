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
 * File: watercraftRiskAssessment.ts
 * Project: lucy
 * File Created: Friday, 1st November 2019 6:14:25 pm
 * Author: pushan
 * -----
 * Last Modified: Monday, 4th November 2019 9:48:17 am
 * Modified By: pushan
 * -----
 */

// ** Model: WatercraftRiskAssessment from schema WatercraftRiskAssessmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { WatercraftRiskAssessmentSchema } from '../database-schema';
import {
	HighRiskAssessmentSchema,
	ObserverWorkflowSchema,
	PreviousAISKnowledgeSourceSchema,
	PreviousInspectionSourceSchema,
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { IntTransformer, DateTimeTransformer } from '../../libs/transformer';
import {
	HighRiskAssessment,
	ObserverWorkflow,
	PreviousAISKnowledgeSource,
	PreviousInspectionSource,
} from '../models';

import { Record } from './generic.data.models';
import { WatercraftJourney } from './watercraftJourney';

/** Interface **/
/**
 * @description WatercraftRiskAssessment create interface
 */
export interface WatercraftRiskAssessmentSpec {
	timestamp: string;
	passportHolder: boolean;
	inspectionTime: string;
	isNewPassportIssued: boolean;
	k9Inspection: boolean;
	marineSpeciesFound: boolean;
	aquaticPlantsFound: boolean;
	previousAISKnowledge: boolean;
	previousInspection: boolean;
	marineMusselFound: boolean;
	adultDreissenidaeFound: boolean;
	launchedOutsideBC: boolean;
	decontaminationPerformed: boolean;
	commerciallyHauled: boolean;
	highRiskArea: boolean;
	highRiskAIS: boolean;
	previousDryStorage: boolean;
	destinationDryStorage: boolean;
	previousMajorCity: string;
	destinationMajorCity: string;
	unknownPreviousWaterBody: boolean;
	unknownDestinationWaterBody: boolean;
	commercialManufacturerAsPreviousWaterBody: boolean;
	commercialManufacturerAsDestinationWaterBody: boolean;
	nonMotorized: number;
	simple: number;
	complex: number;
	veryComplex: number;
	previousInspectionDays: number;
	generalComment: string;
	passportNumber: string;
	decontaminationReference: string;
	highRiskAssessment: HighRiskAssessment;
	workflow: ObserverWorkflow;
	previousAISKnowledgeSource: PreviousAISKnowledgeSource;
	previousInspectionSource: PreviousInspectionSource;
	provinceOfResidence: string;
	countryOfResidence: string;
	numberOfPeopleInParty: number;
}
// -- End: WatercraftRiskAssessmentSpec --


/** Interface **/
/**
 * @description WatercraftRiskAssessment update interface
 */
export interface WatercraftRiskAssessmentUpdateSpec {
	timestamp?: string;
	passportHolder?: boolean;
	inspectionTime: string;
	k9Inspection?: boolean;
	marineSpeciesFound?: boolean;
	aquaticPlantsFound?: boolean;
	previousAISKnowledge?: boolean;
	previousInspection?: boolean;
	marineMusselFound?: boolean;
	adultDreissenidaeFound?: boolean;
	launchedOutsideBC?: boolean;
	decontaminationPerformed?: boolean;
	commerciallyHauled?: boolean;
	highRiskArea?: boolean;
	highRiskAIS?: boolean;
	previousDryStorage?: boolean;
	destinationDryStorage?: boolean;
	previousMajorCity?: string;
	destinationMajorCity?: string;
	unknownPreviousWaterBody?: boolean;
	unknownDestinationWaterBody?: boolean;
	commercialManufacturerAsPreviousWaterBody?: boolean;
	commercialManufacturerAsDestinationWaterBody?: boolean;
	nonMotorized?: number;
	simple?: number;
	complex?: number;
	veryComplex?: number;
	previousInspectionDays?: number;
	generalComment?: string;
	passportNumber?: string;
	decontaminationReference?: string;
	highRiskAssessment?: HighRiskAssessment;
	workflow?: ObserverWorkflow;
	previousAISKnowledgeSource?: PreviousAISKnowledgeSource;
	previousInspectionSource?: PreviousInspectionSource;
	provinceOfResidence?: string;
	countryOfResidence?: string;
	numberOfPeopleInParty?: number;
}
// -- End: WatercraftRiskAssessmentUpdateSpec --

/**
 * @description Data Model Class for WatercraftRiskAssessmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for WatercraftRiskAssessmentSchema',
	schema: WatercraftRiskAssessmentSchema,
	apiResource: false
})
@Entity( { name: WatercraftRiskAssessmentSchema.dbTable} )
export class WatercraftRiskAssessment extends Record implements WatercraftRiskAssessmentSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {watercraft_risk_assessment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	watercraft_risk_assessment_id: number;

	/**
	 * @description Getter/Setter property for column {timestamp}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.timestamp, transformer: new DateTimeTransformer()})
	@ModelProperty({type: PropertyType.string})
	timestamp: string;

	/**
	 * @description Getter/Setter property for column {passport_holder_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.passportHolder})
	@ModelProperty({type: PropertyType.boolean})
	passportHolder: boolean;

	/**
	 * @description Getter/Setter property for column {inspection_time}
	 */
	 @Column({ name: WatercraftRiskAssessmentSchema.columns.inspectionTime})
	 @ModelProperty({type: PropertyType.string})
	 inspectionTime: string;

	/**
	 * @description Getter/Setter property for column {is_new_passport_issued}
	 */
	 @Column({ name: WatercraftRiskAssessmentSchema.columns.isNewPassportIssued})
	 @ModelProperty({type: PropertyType.boolean})
	 isNewPassportIssued: boolean;

	/**
	 * @description Getter/Setter property for column {k9_inspection_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.k9Inspection})
	@ModelProperty({type: PropertyType.boolean})
	k9Inspection: boolean;

	/**
	 * @description Getter/Setter property for column {marine_species_found_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.marineSpeciesFound})
	@ModelProperty({type: PropertyType.boolean})
	marineSpeciesFound: boolean;

	/**
	 * @description Getter/Setter property for column {aquatic_plants_found_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.aquaticPlantsFound})
	@ModelProperty({type: PropertyType.boolean})
	aquaticPlantsFound: boolean;

	/**
	 * @description Getter/Setter property for column {previous_ais_knowledge_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.previousAISKnowledge})
	@ModelProperty({type: PropertyType.boolean})
	previousAISKnowledge: boolean;

	/**
	 * @description Getter/Setter property for column {previous_inspection_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.previousInspection})
	@ModelProperty({type: PropertyType.boolean})
	previousInspection: boolean;

	/**
	 * @description Getter/Setter property for column {marine_mussel_found_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.marineMusselFound})
	@ModelProperty({type: PropertyType.boolean})
	marineMusselFound: boolean;

	/**
	 * @description Getter/Setter property for column {adult_dreissenidae_found_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.adultDreissenidaeFound})
	@ModelProperty({type: PropertyType.boolean})
	adultDreissenidaeFound: boolean;

	/**
	 * @description Getter/Setter property for column {launched_outside_bc_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.launchedOutsideBC})
	@ModelProperty({type: PropertyType.boolean})
	launchedOutsideBC: boolean;

	/**
	 * @description Getter/Setter property for column {decontamination_performed_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.decontaminationPerformed})
	@ModelProperty({type: PropertyType.boolean})
	decontaminationPerformed: boolean;

	/**
	 * @description Getter/Setter property for column {commercially_hauled_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.commerciallyHauled})
	@ModelProperty({type: PropertyType.boolean})
	commerciallyHauled: boolean;

	/**
	 * @description Getter/Setter property for column {high_risk_area_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.highRiskArea})
	@ModelProperty({type: PropertyType.boolean})
	highRiskArea: boolean;

	/**
	 * @description Getter/Setter property for column {high_risk_ais_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.highRiskAIS})
	@ModelProperty({type: PropertyType.boolean})
	highRiskAIS: boolean;

	/**
	 * @description Getter/Setter property for column {previous_dry_storage_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.previousDryStorage})
	@ModelProperty({type: PropertyType.boolean})
	previousDryStorage: boolean;

	/**
	 * @description Getter/Setter property for column {destination_dry_storage_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.destinationDryStorage})
	@ModelProperty({type: PropertyType.boolean})
	destinationDryStorage: boolean;

	/**
	 * @description Getter/Setter property for column {previous_major_city}
	 */
	 @Column({ name: WatercraftRiskAssessmentSchema.columns.previousMajorCity})
	 @ModelProperty({type: PropertyType.string})
	 previousMajorCity: string;

	 /**
	 * @description Getter/Setter property for column {destination_major_city}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.destinationMajorCity})
	@ModelProperty({type: PropertyType.string})
	destinationMajorCity: string;

	/**
	 * @description Getter/Setter property for column {unknown_previous_water_body_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.unknownPreviousWaterBody})
	@ModelProperty({type: PropertyType.boolean})
	unknownPreviousWaterBody: boolean;

	/**
	 * @description Getter/Setter property for column {unknown_destination_water_body_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.unknownDestinationWaterBody})
	@ModelProperty({type: PropertyType.boolean})
	unknownDestinationWaterBody: boolean;

	/**
	 * @description Getter/Setter property for column {commercial_manufacturer_as_previous_water_body_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.commercialManufacturerAsPreviousWaterBody})
	@ModelProperty({type: PropertyType.boolean})
	commercialManufacturerAsPreviousWaterBody: boolean;

	/**
	 * @description Getter/Setter property for column {commercial_manufacturer_as_destination_water_body_ind}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.commercialManufacturerAsDestinationWaterBody})
	@ModelProperty({type: PropertyType.boolean})
	commercialManufacturerAsDestinationWaterBody: boolean;

	/**
	 * @description Getter/Setter property for column {non_motorized_counter}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.nonMotorized, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	nonMotorized: number;

	/**
	 * @description Getter/Setter property for column {simple_counter}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.simple, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	simple: number;

	/**
	 * @description Getter/Setter property for column {complex_counter}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.complex, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	complex: number;

	/**
	 * @description Getter/Setter property for column {very_complex_count}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.veryComplex, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	veryComplex: number;

	/**
	 * @description Getter/Setter property for column {previous_inspection_days_count}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.previousInspectionDays, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	previousInspectionDays: number;

	/**
	 * @description Getter/Setter property for column {general_comment}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.generalComment})
	@ModelProperty({type: PropertyType.string})
	generalComment: string;

	/**
	 * @description Getter/Setter property for column {passport_number}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.passportNumber})
	@ModelProperty({type: PropertyType.string})
	passportNumber: string;

	/**
	 * @description Getter/Setter property for column {decontamination_reference}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.decontaminationReference})
	@ModelProperty({type: PropertyType.string})
	decontaminationReference: string;

	/**
	 * @description Getter/Setter property for column {high_risk_assessment_id}
	 */
	@ManyToOne( type => HighRiskAssessment, { eager: true})
	@JoinColumn({ name: WatercraftRiskAssessmentSchema.columns.highRiskAssessment, referencedColumnName: HighRiskAssessmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	highRiskAssessment: HighRiskAssessment;

	/**
	 * @description Getter/Setter property for column {previous_ais_knowledge_source_code_id}
	 */
	@ManyToOne( type => PreviousAISKnowledgeSource, { eager: true})
	@JoinColumn({ name: WatercraftRiskAssessmentSchema.columns.previousAISKnowledgeSource, referencedColumnName: PreviousAISKnowledgeSourceSchema.pk})
	@ModelProperty({type: PropertyType.object})
	previousAISKnowledgeSource: PreviousAISKnowledgeSource;

	/**
	 * @description Getter/Setter property for column {previous_inspection_source_code_id}
	 */
	@ManyToOne( type => PreviousInspectionSource, { eager: true})
	@JoinColumn({ name: WatercraftRiskAssessmentSchema.columns.previousInspectionSource, referencedColumnName: PreviousInspectionSourceSchema.pk})
	@ModelProperty({type: PropertyType.object})
	previousInspectionSource: PreviousInspectionSource;

	/**
	 * @description Getter/Setter property for column {province_code}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.provinceOfResidence})
	@ModelProperty({type: PropertyType.string})
	provinceOfResidence: string;

	/**
	 * @description Getter/Setter property for column {country_code}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.countryOfResidence})
	@ModelProperty({type: PropertyType.string})
	countryOfResidence: string;

    /**
	 * @description Getter/Setter property for column {number_of_people_in_party}
	 */
	@Column({name: WatercraftRiskAssessmentSchema.columns.numberOfPeopleInParty, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	numberOfPeopleInParty: number;

	/**
	 * @description Getter/Setter property for column {observer_workflow_id}
	 */
	@ManyToOne( type => ObserverWorkflow, { eager: true})
	@JoinColumn({ name: WatercraftRiskAssessmentSchema.columns.workflow, referencedColumnName: ObserverWorkflowSchema.pk})
	@ModelProperty({type: PropertyType.object})
	workflow: ObserverWorkflow;

	/**
	 * @description OneToMany Relationship
	 */
	@OneToMany(
		type => WatercraftJourney,
		obj => obj.watercraftAssessment,
		{ eager: true}
	)
	@ModelProperty({type: PropertyType.array, $ref: '#/definitions/WatercraftJourney'})
	journeys: WatercraftJourney[];
}

// -------------------------------------
