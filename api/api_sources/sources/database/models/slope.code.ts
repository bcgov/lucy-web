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
 * File: SlopeCode.ts
 * Project: lucy
 * File Created: Monday, 29th July 2019 10:47:23 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 29th July 2019 10:48:52 am
 * Modified By: pushan
 * -----
 */

// ** Model: SlopeCode from schema SlopeCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SlopeCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';
/**
 * @description Data Model Class for SlopeCodeSchema
 */
@Entity( { name: SlopeCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: SlopeCodeSchema
})
export class SlopeCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_slope_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_slope_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_slope_code}
	 */
	@Column({ name: SlopeCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: SlopeCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: SlopeCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SlopeCode **

/**
 * @description Data Model Controller Class for SlopeCodeSchema and SlopeCode
 */
export class SlopeCodeController extends DataModelController<SlopeCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SlopeCodeController {
		return this.sharedInstance<SlopeCode>(SlopeCode, SlopeCodeSchema) as SlopeCodeController;
	}
}

// -------------------------------------
