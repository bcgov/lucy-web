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
 * File: SpeciesDistributionCode.ts
 * Project: lucy
 * File Created: Wednesday, 17th July 2019 11:46:25 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 17th July 2019 2:34:06 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model  SpeciesDistributionCode from schema SpeciesDistributionCodeSchema **
import { Column, Entity, PrimaryColumn} from 'typeorm';
import { SpeciesDistributionCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { ApplicationCode } from './generic.data.models';

/**
 * @description Species Distribution Code data model
 */
@Entity( { name: SpeciesDistributionCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: SpeciesDistributionCodeSchema
})
export class SpeciesDistributionCode extends  ApplicationCode {

	/**
	 * Class Properties
	 */

	@PrimaryColumn()
	@ModelProperty({type: PropertyType.number})
	species_distribution_code_id: number;

	@Column({ name: SpeciesDistributionCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SpeciesDistributionCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SpeciesDistributionCode **
/**
 * @description SpeciesDistributionCode model controller
 */
export class SpeciesDistributionCodeController extends DataModelController<SpeciesDistributionCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpeciesDistributionCodeController {
		return this.sharedInstance<SpeciesDistributionCode>(SpeciesDistributionCode, SpeciesDistributionCodeSchema) as SpeciesDistributionCodeController;
	}
}

// -------------------------------------
