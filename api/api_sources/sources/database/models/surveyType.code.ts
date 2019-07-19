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
 * File: SurveyTypeCode.ts
 * Project: lucy
 * File Created: Friday, 19th July 2019 11:43:31 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 19th July 2019 11:44:08 am
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model  SurveyTypeCode from schema SurveyTypeCodeSchema ** 

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SurveyTypeCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { ApplicationCode } from './user';


@Entity( { name: SurveyTypeCodeSchema.dbTable} )
export class SurveyTypeCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	survey_type_code_id: number;

	@Column({ name: SurveyTypeCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SurveyTypeCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SurveyTypeCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SurveyTypeCode **
export class SurveyTypeCodeController extends DataModelController<SurveyTypeCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SurveyTypeCodeController {
		return this.sharedInstance<SurveyTypeCode>(SurveyTypeCode, SurveyTypeCodeSchema) as SurveyTypeCodeController;
	}
}

// -------------------------------------
