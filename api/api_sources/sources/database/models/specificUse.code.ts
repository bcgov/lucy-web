
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
 * File: specificUse.code.ts
 * Project: lucy
 * File Created: Monday, 22nd July 2019 11:48:02 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 22nd July 2019 11:48:27 am
 * Modified By: pushan
 * -----
 */
// ** Model  SpecificUseCode from schema SpecificUseCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SpecificUseCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { ApplicationCode } from './generic.data.models';

/**
 * @description Specific Use Code Model for Observation
 */
@Entity( { name: SpecificUseCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: SpecificUseCodeSchema
})
export class SpecificUseCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	specific_use_code_id: number;

	@Column({ name: SpecificUseCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SpecificUseCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SpecificUseCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SpecificUseCode **
export class SpecificUseCodeController extends DataModelController<SpecificUseCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpecificUseCodeController {
		return this.sharedInstance<SpecificUseCode>(SpecificUseCode, SpecificUseCodeSchema) as SpecificUseCodeController;
	}
}

// -------------------------------------
