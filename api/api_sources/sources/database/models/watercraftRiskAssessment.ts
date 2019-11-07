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

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { WatercraftRiskAssessmentSchema } from '../database-schema';
import {
	ObserverWorkflowSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DateTimeTransformer } from '../../libs/transformer';
import {
	ObserverWorkflow
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description WatercraftRiskAssessment create interface
 */
export interface WatercraftRiskAssessmentSpec {
	timestamp: string;
	highRiskAssessmentForm: object;
	lowRiskAssessmentForm: object;
	fullObservationForm: object;
	additionalInfo: object;
	workflow: ObserverWorkflow;
}
// -- End: WatercraftRiskAssessmentSpec --


/** Interface **/
/**
 * @description WatercraftRiskAssessment update interface
 */
export interface WatercraftRiskAssessmentUpdateSpec {
	timestamp?: string;
	highRiskAssessmentForm?: object;
	lowRiskAssessmentForm?: object;
	fullObservationForm?: object;
	additionalInfo?: object;
	workflow?: ObserverWorkflow;
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
	@Column({
		name: WatercraftRiskAssessmentSchema.columns.timestamp,
		transformer: new DateTimeTransformer()
	})
	@ModelProperty({type: PropertyType.string})
	timestamp: string;

	/**
	 * @description Getter/Setter property for column {high_risk_assessment_form}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.highRiskAssessmentForm, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	highRiskAssessmentForm: object;

	/**
	 * @description Getter/Setter property for column {additional_info}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.lowRiskAssessmentForm, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	lowRiskAssessmentForm: object;

	/**
	 * @description Getter/Setter property for column {full_observation_form}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.fullObservationForm, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	fullObservationForm: object;

	/**
	 * @description Getter/Setter property for column {additional_info}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.additionalInfo, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	additionalInfo: object;

	/**
	 * @description Getter/Setter property for column {observer_workflow_id}
	 */
	@ManyToOne( type => ObserverWorkflow, { eager: true} )
	@JoinColumn({ name: WatercraftRiskAssessmentSchema.columns.workflow, referencedColumnName: ObserverWorkflowSchema.pk})
	@ModelProperty({type: PropertyType.object})
	workflow: ObserverWorkflow;

}

// -------------------------------------
