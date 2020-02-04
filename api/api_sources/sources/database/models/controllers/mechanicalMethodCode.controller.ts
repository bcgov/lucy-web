// Copyright 2019 awilliam
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { MechanicalMethodCodeSchema } from '../../database-schema';
import { MechanicalMethodCode } from '../mechanicalMethod.code';
import { RecordController } from '../generic.data.models';

/**
 * @description Record Controller Class for MechanicalMethodCodeSchema and MechanicalMethodCode
 */
export class MechanicalMethodCodeController extends RecordController<MechanicalMethodCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalMethodCodeController {
		return this.sharedInstance<MechanicalMethodCode>(MechanicalMethodCode, MechanicalMethodCodeSchema) as MechanicalMethodCodeController;
    }
}
