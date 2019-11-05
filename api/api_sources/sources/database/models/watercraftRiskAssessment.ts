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
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WatercraftRiskAssessmentSchema } from '../database-schema';
import {
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { DateTimeTransformer } from '../../libs/transformer';

/** Interface **/
/**
 * @description WatercraftRiskAssessment create interface
 */
export interface WatercraftRiskAssessmentSpec {
	timestamp: string;
	formData: object;
}
// -- End: WatercraftRiskAssessmentSpec --


/** Interface **/
/**
 * @description WatercraftRiskAssessment update interface
 */
export interface WatercraftRiskAssessmentUpdateSpec {
	timestamp?: string;
	formData?: object;
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
	 * @description Getter/Setter property for column {watercraft_form}
	 */
	@Column({ name: WatercraftRiskAssessmentSchema.columns.formData, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	formData: object;

}

// -------------------------------------
