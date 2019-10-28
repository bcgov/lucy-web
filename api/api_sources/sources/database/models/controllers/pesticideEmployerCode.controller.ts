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
 * File: pesticideEmployerCode.controller.ts
 * Project: lucy
 * File Created: Wednesday, 23rd October 2019 2:28:33 pm
 * Author: awilliam (you@you.you)
 * -----
 * Last Modified: Wednesday, 23rd October 2019 2:33:30 pm
 * Modified By: awilliam (you@you.you>)
 * -----
 */

import { PesticideEmployerCodeSchema } from '../../database-schema';
import { PesticideEmployerCode } from '../pesticideEmployer.code';
import { RecordController } from '../generic.data.models';

// ** PesticideEmployerCodeController **//
/**
 * @description Data Model Controller Class for PesticideEmployerCodeSchema and PesticideEmployerCode
 */
export class PesticideEmployerCodeController extends RecordController<PesticideEmployerCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): PesticideEmployerCodeController {
		return this.sharedInstance<PesticideEmployerCode>(PesticideEmployerCode, PesticideEmployerCodeSchema) as PesticideEmployerCodeController;
    }
    /**
	 * @description Overriding all method to sort alphabetically by business name
	 * @param object query
	 * ** Sorting Code
	 * ** (a, b) => ((a.businessName > b.businessName) ? 1 : (b.businessName > a.businessName) ? -1 : 0 )
	 */
	async all(query?: object) {
		const d = await super.all(query);
		d.sort( (a, b) => ((a.businessName > b.businessName) ? 1 : (b.businessName > a.businessName) ? -1 : 0 ));
		return d;
	}
}

