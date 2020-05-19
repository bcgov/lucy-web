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
 * File: animalObservationFactory.ts
 * Project: lucy
 * Author: Raj Manivannan
 * -----
 */
/**
  * Imports
  */
import { User, UserDataController, AnimalObservation, AnimalObservationController} from '../models';
import { Destroy, ModelFactory } from './helper';

/**
 * @description Observation Factory
 * @param User creator
 * @param boolean noSave
 */
export const animalObservationFactory = async (noSave?: boolean): Promise<AnimalObservation> => {
    return ModelFactory(AnimalObservationController.shared)();
};

/**
 * @description Destroy object
 */
export const destroyAnimalObservation =
Destroy<AnimalObservation, AnimalObservationController>(AnimalObservationController.shared, async (obj: AnimalObservation) => {
  if (obj.createdBy) {
    await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
    return;
  }
});
// -------------------------------------------------------------
