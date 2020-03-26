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
 * File: speciesAgencyCode.controller.ts
 * Project: lucy
 * File Created: Wednesday, 16th October 2019 2:10:27 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 16th October 2019 2:21:41 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

/**
 * Imports
 */
import { SpeciesAgencyCodeSchema } from '../../database-schema';
import { SpeciesAgencyCode } from '../speciesAgency.code';
import { RecordController } from '../generic.data.models';

// ** DataModel controller of SpeciesAgencyCode **
/**
 * @description Data-model controller for SpeciesAgencyCode
 */
export class SpeciesAgencyCodeController extends RecordController<SpeciesAgencyCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpeciesAgencyCodeController {
		return this.sharedInstance<SpeciesAgencyCode>(SpeciesAgencyCode, SpeciesAgencyCodeSchema) as SpeciesAgencyCodeController;
	}
}

// ----------------------------------------------------------------------------
