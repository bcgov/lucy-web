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
 * File: mechanicalTreatmentIssueCode.controller.ts
 * Project: lucy
 * File Created: Wednesday, 23rd October 2019 4:23:26 pm
 * Author: awilliam (you@you.you)
 * -----
 * Last Modified: Wednesday, 23rd October 2019 4:25:33 pm
 * Modified By: awilliam (you@you.you>)
 * -----
 */


import { MechanicalTreatmentIssueCodeSchema } from '../../database-schema';
import { MechanicalTreatmentIssueCode } from '../mechanicalTreatmentIssue.code';
import { RecordController } from '../generic.data.models';

// ** Record controller of MechanicalTreatmentIssueCode **

/**
 * @description Data Model Controller Class for MechanicalTreatmentIssueCodeSchema and MechanicalTreatmentIssueCode
 */
export class MechanicalTreatmentIssueCodeController extends RecordController<MechanicalTreatmentIssueCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalTreatmentIssueCodeController {
		return this.sharedInstance<MechanicalTreatmentIssueCode>(MechanicalTreatmentIssueCode, MechanicalTreatmentIssueCodeSchema) as MechanicalTreatmentIssueCodeController;
    }
    /**
	 * @description Overriding all method to sort alphabetically by treatment issue description,
	 * with the exception that "None" should be the first option in the list
	 * @param object query
	 * ** Sorting Code
	 * ** (a, b) => (( a.description === `None` ? 1 : b.description === `None` ? -1 :
	 *                 a.description > b.description ? 1 : b.description > a.description ? -1 : 0))
	 */
	async all(query?: object) {
		const d = await super.all(query);
        d.sort( (a, b) => ((a.description === `None` ? 1 : b.description === `None` ? -1 : a.description > b.description) ? 1 :
             (b.description > a.description) ? -1 : 0 ));
		return d;
    }
}
