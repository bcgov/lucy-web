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
 * File: treatmentProviderContractor.ts
 * Project: lucy
 * File Created: Tuesday, 3rd September 2019 11:39:25 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 3rd September 2019 11:40:55 am
 * Modified By: pushan
 * -----
 */

// ** Model: TreatmentProviderContractor from schema TreatmentProviderContractorSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { TreatmentProviderContractorSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record, RecordController } from './generic.data.models';


/** Interface **/
/**
 * @description TreatmentProviderContractor create interface
 */
export interface TreatmentProviderContractorSpec {
	registrationNumber: number;
	businessName: string;
	category: string;
	address: string;
	regions: string;
	licenceExpiryDate: string;
	serviceProvideIndicator: boolean;
}
// -- End: TreatmentProviderContractorSpec --


/** Interface **/
/**
 * @description TreatmentProviderContractor update interface
 */
export interface TreatmentProviderContractorUpdateSpec {
	registrationNumber?: number;
	businessName?: string;
	category?: string;
	address?: string;
	regions?: string;
	licenceExpiryDate?: string;
	serviceProvideIndicator?: boolean;
}
// -- End: TreatmentProviderContractorUpdateSpec --

/**
 * @description Data Model Class for TreatmentProviderContractorSchema
 */
@ModelDescription({
	description: 'Data Model Class for TreatmentProviderContractorSchema',
	schema: TreatmentProviderContractorSchema,
	apiResource: false
})
@Entity( { name: TreatmentProviderContractorSchema.dbTable} )
export class TreatmentProviderContractor extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {treatment_provider_contractor_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	treatment_provider_contractor_id: number;

	/**
	 * @description Getter/Setter property for column {registration_number}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.registrationNumber})
	@ModelProperty({type: PropertyType.number})
	registrationNumber: number;

	/**
	 * @description Getter/Setter property for column {business_name}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.businessName})
	@ModelProperty({type: PropertyType.string})
	businessName: string;

	/**
	 * @description Getter/Setter property for column {category}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.category})
	@ModelProperty({type: PropertyType.string})
	category: string;

	/**
	 * @description Getter/Setter property for column {address}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.address})
	@ModelProperty({type: PropertyType.string})
	address: string;

	/**
	 * @description Getter/Setter property for column {region_operation}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.regions})
	@ModelProperty({type: PropertyType.string})
	regions: string;

	/**
	 * @description Getter/Setter property for column {license_expiry_date}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.licenceExpiryDate})
	@ModelProperty({type: PropertyType.string})
	licenceExpiryDate: string;

	/**
	 * @description Getter/Setter property for column {service_provide_ind}
	 */
	@Column({ name: TreatmentProviderContractorSchema.columns.serviceProvideIndicator})
	@ModelProperty({type: PropertyType.boolean})
	serviceProvideIndicator: boolean;

}


// ** DataModel controller of TreatmentProviderContractor **

/**
 * @description Data Model Controller Class for TreatmentProviderContractorSchema and TreatmentProviderContractor
 */
export class TreatmentProviderContractorController extends RecordController<TreatmentProviderContractor> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): TreatmentProviderContractorController {
		return this.sharedInstance<TreatmentProviderContractor>(TreatmentProviderContractor, TreatmentProviderContractorSchema) as TreatmentProviderContractorController;
	}
}

// -------------------------------------
