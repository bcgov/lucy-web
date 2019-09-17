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
 * File: proposedAction.code.ts
 * Project: lucy
 * File Created: Thursday, 1st August 2019 2:15:51 pm
 * Author: pushan
 * -----
 * Last Modified: Thursday, 8th August 2019 2:35:05 pm
 * Modified By: pushan
 * -----
 */

// ** Model: ProposedActionCode from schema ProposedActionCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ProposedActionCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { ApplicationCode } from './generic.data.models';
/**
 * @description Data Model Class for ProposedActionCodeSchema
 */
@Entity( { name: ProposedActionCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: ProposedActionCodeSchema
})
export class ProposedActionCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observation_proposed_action_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observation_proposed_action_code_id: number;

	/**
	 * @description Getter/Setter property for column {observation_proposed_action_code}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: ProposedActionCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of ProposedActionCode **

/**
 * @description Data Model Controller Class for ProposedActionCodeSchema and ProposedActionCode
 */
export class ProposedActionCodeController extends DataModelController<ProposedActionCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): ProposedActionCodeController {
		return this.sharedInstance<ProposedActionCode>(ProposedActionCode, ProposedActionCodeSchema) as ProposedActionCodeController;
	}
}

// -------------------------------------
