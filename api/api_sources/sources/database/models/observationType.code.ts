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
 * File: observationType.code.ts
 * Project: lucy
 * File Created: Thursday, 20th July 2019 2:15:51 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 12th August 2019 2:36:49 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model: ObservationTypeCode from schema ObservationTypeCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ObservationTypeCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';
/**
 * @description Data Model Class for ObservationTypeCodeSchema
 */
@Entity( { name: ObservationTypeCodeSchema.dbTable} )
@ModelDescription({
	description: 'Data model for ObservationTypeCode',
	schema: ObservationTypeCodeSchema,
	apiResource: false
})
export class ObservationTypeCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_type_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_type_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_type_code}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ObservationTypeCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ObservationTypeCode **

/**
 * @description Data Model Controller Class for ObservationTypeCodeSchema and ObservationTypeCode
 */
export class ObservationTypeCodeController extends DataModelController<ObservationTypeCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObservationTypeCodeController {
		return this.sharedInstance<ObservationTypeCode>(ObservationTypeCode, ObservationTypeCodeSchema) as ObservationTypeCodeController;
	}
}

// -------------------------------------
