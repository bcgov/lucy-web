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
 * File: animalObservationCodesFactory.ts
 * Project: lucy
 * Author: Raj Manivannan
 * -----
 */

 /**
  * Imports
  */
import { CodeFactory } from './helper';
import {
    AnimalSpecies,
    AnimalSpeciesController,
    LifeStageCode,
    LifeStageCodeController,
    BehaviourCode,
    BehaviourCodeController
} from '../models';

/**
 * @description Factory of animal species
 * @param boolean noSave: Flag to save species
 */
export const animalSpeciesFactory = async (id?: number, noSave?: boolean): Promise<AnimalSpecies> => {
    const species = (id !== undefined) ? await AnimalSpeciesController.shared.findById(id || 1) : await AnimalSpeciesController.shared.random();
    return species;
};

/**
 * @description Destroy factory obj
 * @param AnimalSpecies species
 */
export const destroyAnimalSpecies = async (species: AnimalSpecies) => {
    await AnimalSpeciesController.shared.remove(species);
};

/**
 * @description Factory for lifestage codes
 * @param number? id optional
 * @returns Promise<LifeStageCode>
 */
export const lifeStageCodeFactory = CodeFactory<LifeStageCode, LifeStageCodeController>(LifeStageCodeController.shared);

/**
 * @description Factory for behaviour codes
 * @param number? id optional
 * @returns Promise<BehaviourCode>
 */
export const behaviourCodeFactory = CodeFactory<BehaviourCode, BehaviourCodeController>(BehaviourCodeController.shared);
// -------------------------------------------------------------------------------

