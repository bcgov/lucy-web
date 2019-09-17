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
 * File: observationGeometry.code.ts
 * Project: lucy
 * File Created: Thursday, 18th July 2019 2:15:51 pm
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 2:35:43 pm
 * Modified By:
 * -----
 */

// ** Model  ObservationGeometryCode from schema ObservationGeometryCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ObservationGeometryCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';
/**
 * @description Data Model Class for ObservationGeometryCodeSchema
 */
@Entity( { name: ObservationGeometryCodeSchema.dbTable} )
@ModelDescription({
	description: 'Data model for Observation Geometry',
	schema: ObservationGeometryCodeSchema
})
export class ObservationGeometryCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_geometry_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_geometry_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_geometry_code}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ObservationGeometryCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ObservationGeometryCode **

/**
 * @description Data Model Controller Class for ObservationGeometryCodeSchema and ObservationGeometryCode
 */
export class ObservationGeometryCodeController extends DataModelController<ObservationGeometryCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ObservationGeometryCodeController {
		return this.sharedInstance<ObservationGeometryCode>(ObservationGeometryCode, ObservationGeometryCodeSchema) as ObservationGeometryCodeController;
	}
}

// -------------------------------------
