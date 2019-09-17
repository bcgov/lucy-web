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
 * File: treatment.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 10:44:15 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 10:44:22 am
 * Modified By: pushan
 * -----
 */
/**
  * Imports
  */
import * as faker from 'faker';
import { Destroy, ModelSpecFactory } from './helper';
import { MechanicalTreatment,
  MechanicalTreatmentController,
  MechanicalTreatmentSpec,
  MechanicalTreatmentUpdateSpec,
  User,
  UserDataController,
  Observation,
  ObservationController} from '../models';
import { userFactory } from './userFactory';
import { observationFactory } from './observationFactory';


/**
 * @description Factory to create treatment spec.
 */
export const mechanicalTreatmentCreateSpecFactory = async (): Promise<MechanicalTreatmentSpec> => {
  return await ModelSpecFactory(MechanicalTreatmentController.shared)();
};

/**
 * @description MechanicalTreatment factory
 */
export const mechanicalTreatmentFactory = async () => {
  const spec = await mechanicalTreatmentCreateSpecFactory();
  return await MechanicalTreatmentController.shared.createNewObject(spec, await userFactory());
};

/**
 * @description MechanicalTreatment factory obj destroyer
 */
export const destroyMechanicalTreatment = Destroy<MechanicalTreatment, MechanicalTreatmentController>(MechanicalTreatmentController.shared, async (obj: MechanicalTreatment) => {
  await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
  await Destroy<Observation, ObservationController>(ObservationController.shared)(obj.observation);
});


export const mechanicalTreatmentUpdateSpecFactory = async (): Promise<MechanicalTreatmentUpdateSpec> => {
  return {
    latitude: parseFloat(faker.address.latitude()) || 0.0,
    width: faker.random.number(),
    length: faker.random.number(),
    observation: (await observationFactory()),
  };
};

// ------------------------------------------------------------
