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
 * File: observationFactory.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 2:30:57 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 12th July 2019 2:31:04 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
  * Imports
  */
import { Observation, ObservationController, User, UserDataController} from '../models';
import { Destroy, ModelFactory } from './helper';

/**
 * @description Observation Factory
 * @param User creator
 * @param boolean noSave
 */
export const observationFactory = async (noSave?: boolean): Promise<Observation> => {
    return ModelFactory(ObservationController.shared)();
};

/**
 * @description Destroy object
 */
export const destroyObservation =
Destroy<Observation, ObservationController>(ObservationController.shared, async (obj: Observation) => {
  if (obj.createdBy) {
    await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
    return;
  }
});
// -------------------------------------------------------------
