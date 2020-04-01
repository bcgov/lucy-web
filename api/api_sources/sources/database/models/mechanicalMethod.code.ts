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
 * File: mechanicalMethod.code.ts
 * Project: lucy
 * File Created: Thursday, 15th August 2019 10:51:17 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 15th August 2019 10:56:35 am
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model: MechanicalMethodCode from schema MechanicalMethodCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { MechanicalMethodCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { ApplicationCode } from './generic.data.models';

/** Interface **/
/**
 * @description MechanicalMethodCode create interface
 */
export interface MechanicalMethodCodeCreateSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: MechanicalMethodCodeCreateSpec --


/** Interface **/
/**
 * @description MechanicalMethodCode update interface
 */
export interface MechanicalMethodCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: MechanicalMethodCodeUpdateSpec --

/**
 * @description Data Model Class for MechanicalMethodCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalMethodCodeSchema',
	schema: MechanicalMethodCodeSchema,
	apiResource: false
})
@Entity( { name: MechanicalMethodCodeSchema.dbTable} )
export class MechanicalMethodCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_method_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_method_code_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_method_code}
	 */
	@Column({ name: MechanicalMethodCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

}

// -------------------------------------
