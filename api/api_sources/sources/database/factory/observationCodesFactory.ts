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
 * File: observationCodesFactory.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 2:15:03 pm
 * Author: pushan
 * -----
 * Last Modified: Friday, 12th July 2019 2:15:17 pm
 * Modified By: pushan
 * -----
 */

 /**
  * Imports
  */
import { CodeFactory } from './helper';
import { JurisdictionCode, JurisdictionCodeController} from '../models';
import { Species, SpeciesController} from '../models';
import { SpeciesDensityCode, SpeciesDensityCodeController} from '../models';
import { SpeciesDistributionCode, SpeciesDistributionCodeController} from '../models';
import { ObservationTypeCode, ObservationTypeCodeController} from '../models';
import { SpeciesAgencyCode, SpeciesAgencyCodeController } from '../models';
import { SoilTextureCode, SoilTextureCodeController } from '../models';
import { ObservationGeometryCode, ObservationGeometryCodeController } from '../models';
import { SpecificUseCode, SpecificUseCodeController } from '../models';
import { SlopeCode, SlopeCodeController } from '../models';
import { AspectCode, AspectCodeController } from '../models';
import { ProposedActionCode, ProposedActionCodeController } from '../models';

/**
 * @description Factory for code
 * @param number id
 * @param boolean noSave: Save on db flag
 */
export const jurisdictionCodeFactory = async (id?: number, noSave?: boolean): Promise<JurisdictionCode> => {
    const code: JurisdictionCode = await JurisdictionCodeController.shared.random();
    return code;
};

/**
 * @description Destroy factory obj
 * @param JurisdictionCode code
 */
export const destroyJurisdictionCode = async (code: JurisdictionCode) => {
    await JurisdictionCodeController.shared.remove(code);
};

/**
 * @description Factory of species
 * @param boolean noSave: Flag to save species
 */
export const speciesFactory = async (id?: number, noSave?: boolean): Promise<Species> => {
    const species: Species = await SpeciesController.shared.random();
    return species;
};

/**
 * @description Destroy factory obj
 * @param JurisdictionCode code
 */
export const destroySpecies = async (species: Species) => {
    await SpeciesController.shared.remove(species);
};

/**
 * @description Factory for code
 * @param number id
 * @returns Promise<SpeciesDensityCode>
 */
export const speciesDensityCodeFactory = async (id?: number): Promise<SpeciesDensityCode> => {
    const obj = id !== undefined ? await SpeciesDensityCodeController.shared.findById(id || 1) : await SpeciesDensityCodeController.shared.random();
    return obj;
};

/**
 * @description Factory for code
 * @param number id
 * @returns Promise<SpeciesDensityCode>
 */
export const speciesDistributionCodeFactory = async (id?: number): Promise<SpeciesDistributionCode> => {
    const obj = id !== undefined ? await SpeciesDistributionCodeController.shared.findById(id || 1) : await SpeciesDistributionCodeController.shared.random();
    return obj;
};

/**
 * @description Factory for survey code type
 * @param number? id optional
 * @returns Promise<SurveyTypeCode>
 */
export const observationTypeCodeFactory = CodeFactory<ObservationTypeCode, ObservationTypeCodeController>(ObservationTypeCodeController.shared);

/**
 * @description Factory for Species agency code type
 * @param number? id optional
 * @returns Promise<SpeciesAgencyCode>
 */
export const speciesAgencyCodeFactory = CodeFactory<SpeciesAgencyCode, SpeciesAgencyCodeController>(SpeciesAgencyCodeController.shared);

/**
 * @description Factory for Soil texture code type
 * @param number? id optional
 * @returns Promise<SoilTextureCode>
 */
export const soilTextureCodeFactory = CodeFactory<SoilTextureCode, SoilTextureCodeController>(SoilTextureCodeController.shared);

/**
 * @description Factory for Survey Geometry code type
 * @param number? id optional
 * @returns Promise<SurveyGeometryCode>
 */
export const observerGeometryCodeFactory = CodeFactory<ObservationGeometryCode, ObservationGeometryCodeController>(ObservationGeometryCodeController.shared);

/**
 * @description Factory for Specific Use code type
 * @param number? id optional
 * @returns Promise<SpecificUseCode>
 */
export const specificUseCodeFactory = CodeFactory<SpecificUseCode, SpecificUseCodeController>(SpecificUseCodeController.shared);

/**
 * @description Factory for observation slope codes
 * @param number? id optional
 * @returns Promise<SlopeCode>
 */
export const slopeCodeFactory = CodeFactory<SlopeCode, SlopeCodeController>(SlopeCodeController.shared);

/**
 * @description Factory for observation directional aspect codes
 * @param number? id optional
 * @returns Promise<AspectCode>
 */
export const aspectCodeFactory = CodeFactory<AspectCode, AspectCodeController>(AspectCodeController.shared);

/**
 * @description Factory for proposed Actions Code
 * @param number? id optional
 * @returns Promise<ProposedActionCode>
 */
export const proposedActionCodeFactory = CodeFactory<ProposedActionCode, ProposedActionCodeController>(ProposedActionCodeController.shared);
// -------------------------------------------------------------------------------

