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
 * File: surveyGeometry.code.ts
 * Project: lucy
 * File Created: Monday, 22nd July 2019 11:29:50 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 22nd July 2019 11:30:14 am
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model  SurveyGeometryCode from schema SurveyGeometryCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SurveyGeometryCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
@Entity( { name: SurveyGeometryCodeSchema.dbTable} )
export class SurveyGeometryCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	survey_geometry_code_id: number;

	@Column({ name: SurveyGeometryCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SurveyGeometryCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SurveyGeometryCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SurveyGeometryCode **
export class SurveyGeometryCodeController extends DataModelController<SurveyGeometryCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SurveyGeometryCodeController {
		return this.sharedInstance<SurveyGeometryCode>(SurveyGeometryCode, SurveyGeometryCodeSchema) as SurveyGeometryCodeController;
	}
}

// -------------------------------------
