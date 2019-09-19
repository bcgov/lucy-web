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
 * File: soilTexture.code.ts
 * Project: lucy
 * File Created: Monday, 22nd July 2019 10:54:32 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 22nd July 2019 10:55:04 am
 * Modified By: pushan
 * -----
 */

// ** Model  SoilTextureCode from schema SoilTextureCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SoilTextureCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';
import { ApplicationCode } from './generic.data.models';

/**
 * @description SoilTexture Code Table Model
 */
@Entity( { name: SoilTextureCodeSchema.dbTable} )
@ModelDescription({
	description: '',
	schema: SoilTextureCodeSchema
})
export class SoilTextureCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	soil_texture_code_id: number;

	@Column({ name: SoilTextureCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SoilTextureCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SoilTextureCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SoilTextureCode **
export class SoilTextureCodeController extends DataModelController<SoilTextureCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SoilTextureCodeController {
		return this.sharedInstance<SoilTextureCode>(SoilTextureCode, SoilTextureCodeSchema) as SoilTextureCodeController;
	}
}

// -------------------------------------
