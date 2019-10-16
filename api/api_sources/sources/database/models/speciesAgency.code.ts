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
 * File: SpeciesAgencyCode.ts
 * Project: lucy
 * File Created: Friday, 19th July 2019 11:43:31 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 19th July 2019 11:43:59 am
 * Modified By: pushan (you@you.you>)
 * -----
 */

// ** Model  SpeciesAgencyCode from schema SpeciesAgencyCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SpeciesAgencyCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { ApplicationCode } from './generic.data.models';

@Entity( { name: SpeciesAgencyCodeSchema.dbTable} )
@ModelDescription({
	description: 'Model class for SpeciesAgencyCodeSchema',
	schema: SpeciesAgencyCodeSchema,
	apiResource: false
})
export class SpeciesAgencyCode extends ApplicationCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	species_agency_code_id: number;

	@Column({ name: SpeciesAgencyCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SpeciesAgencyCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SpeciesAgencyCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}
// -------------------------------------
