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
 * File: mechanicalTreatment.controller.ts
 * Project: lucy
 * File Created: Friday, 13th September 2019 9:44:30 am
 * Author: pushan
 * -----
 * Last Modified: Friday, 13th September 2019 9:48:53 am
 * Modified By: pushan
 * -----
 */

// ** DataModel controller of MechanicalTreatment **

import { MechanicalTreatmentSchema } from '../../database-schema';
import { MechanicalTreatment } from '../mechanical.treatment';
import { RecordController } from '../generic.data.models';

/**
 * @description Data Model Controller Class for MechanicalTreatmentSchema and MechanicalTreatment
 */
export class MechanicalTreatmentController extends RecordController<MechanicalTreatment> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalTreatmentController {
		return this.sharedInstance<MechanicalTreatment>(MechanicalTreatment, MechanicalTreatmentSchema) as MechanicalTreatmentController;
	}

	async all(query?: object): Promise<MechanicalTreatment[]> {
		// console.log('*** 1a');
		// console.dir(query);
        return super.all(query);
    }
}

// -------------------------------------------------------
