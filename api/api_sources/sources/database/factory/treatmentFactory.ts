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
import { Destroy, ModelSpecFactory } from './helper';
import * as _ from 'underscore';
import { MechanicalTreatment,
  MechanicalTreatmentController,
  MechanicalTreatmentSpec,
  MechanicalTreatmentUpdateSpec,
  User,
  UserDataController,
  Observation,
  ObservationController,
  ChemicalTreatmentSpec,
  ChemicalTreatmentController,
  ChemicalTreatment,
  HerbicideTankMix,
  HerbicideTankMixController,
  ChemicalTreatmentUpdateSpec,
  ObservationChemicalTreatmentUpdateSpec} from '../models';
import { userFactory } from './userFactory';
import { observationFactory } from './observationFactory';
import { speciesAgencyCodeFactory } from './observationCodesFactory';
import * as faker from 'faker';


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
  const obs = await observationFactory();
  spec.observations = [obs];
  return await MechanicalTreatmentController.shared.createNewObject(spec, await userFactory());
};

/**
 * @description MechanicalTreatment factory obj destroyer
 */
export const destroyMechanicalTreatment = Destroy<MechanicalTreatment, MechanicalTreatmentController>(MechanicalTreatmentController.shared, async (obj: MechanicalTreatment) => {
  if (obj.createdBy) {
    await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
  }
  if (obj.observations) {
    _.each(obj.observations, async (observation) => {
      await Destroy<Observation, ObservationController>(ObservationController.shared)(observation);
    });
  }
});


export const mechanicalTreatmentUpdateSpecFactory = async (): Promise<MechanicalTreatmentUpdateSpec> => {
  return {
    applicatorFirstName: faker.name.firstName(),
    speciesAgency: await speciesAgencyCodeFactory()
  };
};

// ------------------------------------------------------------
// ------------- Chemical Treatment factories
/**
 * @description Factory to create chemical treatment spec.
 */
export const chemicalTreatmentCreateSpecFactory = async (): Promise<ChemicalTreatmentSpec> => {
  return await ModelSpecFactory(ChemicalTreatmentController.shared)();
};

export const chemicalTreatmentUpdateSpecFactory = async (): Promise<ChemicalTreatmentUpdateSpec> => {
  return {
    mixDeliveryRate: faker.random.number(),
    speciesAgency: (await speciesAgencyCodeFactory()),
  };
};

export const observationChemicalTreatmentUpdateSpecFactory = async (): Promise<ObservationChemicalTreatmentUpdateSpec> => {
  return {
    treatmentAreaCoverage: faker.random.number({min: 0, max: 100}),
    observation: (await observationFactory())
  };
};

/**
 * @description ChemicalTreatment factory
 */
export const chemicalTreatmentFactory = async () => {
  const spec = await chemicalTreatmentCreateSpecFactory();
  return await ChemicalTreatmentController.shared.createNewObject(spec, await userFactory());
};

/**
 * @description ChemicalTreatment factory obj destroyer
 */
export const destroyChemicalTreatment = Destroy<ChemicalTreatment, ChemicalTreatmentController>(ChemicalTreatmentController.shared, async (obj: ChemicalTreatment) => {
  if (obj.createdBy) {
    await Destroy<User, UserDataController>(UserDataController.shared)(obj.createdBy);
  }
  if (obj.tankMixes) {
    for (let index = 0; index < obj.tankMixes.length; index++) {
      await Destroy<HerbicideTankMix, HerbicideTankMixController>(HerbicideTankMixController.shared)(obj.tankMixes[index]);
    }
  }
});
