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
 * File: treatmentCodesFactory.ts
 * Project: lucy
 * File Created: Thursday, 15th August 2019 11:00:29 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 15th August 2019 11:00:36 am
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */

import { CodeFactory } from './helper';
import {
    MechanicalMethodCodeController,
    MechanicalMethodCode,
    MechanicalDisposalMethodCode,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCode,
    MechanicalSoilDisturbanceCodeController,
    MechanicalRootRemovalCode,
    MechanicalRootRemovalCodeController,
    MechanicalTreatmentIssueCode,
    MechanicalTreatmentIssueCodeController,
    PesticideEmployerCode,
    PesticideEmployerCodeController,
    ChemicalTreatmentMethodCode,
    ChemicalTreatmentMethodCodeController,
    WindDirectionCodes,
    WindDirectionCodesController,
    Herbicide,
    HerbicideController,
} from '../models';

/**
 * @description Mechanical Method Code Factory
 * @returns Promise<MechanicalMethodCode>
 */
export const mechanicalMethodCodeFactory = CodeFactory<MechanicalMethodCode, MechanicalMethodCodeController>(MechanicalMethodCodeController.shared);

/**
 * @description Mechanical Disposal Method Code Factory
 * @returns Promise<MechanicalDisposalMethodCode>
 */
export const mechanicalDisposalMethodCodeFactory = CodeFactory<MechanicalDisposalMethodCode, MechanicalDisposalMethodCodeController>(MechanicalDisposalMethodCodeController.shared);

/**
 * @description Mechanical Soil Disturbance Code Factory
 * @returns Promise<MechanicalSoilDisturbanceCode>
 */
export const mechanicalSoilDisturbanceCodeFactory =
    CodeFactory<MechanicalSoilDisturbanceCode, MechanicalSoilDisturbanceCodeController>(MechanicalSoilDisturbanceCodeController.shared);

/**
 * @description Mechanical Root Removal Code Factory
 * @returns Promise<MechanicalRootRemovalCode>
 */
export const mechanicalRootRemovalCodeFactory =
    CodeFactory<MechanicalRootRemovalCode, MechanicalRootRemovalCodeController>(MechanicalRootRemovalCodeController.shared);

/**
 * @description Mechanical Treatment Issue Code Factory
 * @returns Promise<MechanicalTreatmentIssueCode>
 */
export const mechanicalTreatmentIssuesCodeFactory =
    CodeFactory<MechanicalTreatmentIssueCode, MechanicalTreatmentIssueCodeController>(MechanicalTreatmentIssueCodeController.shared);

/**
 * @description Pesticide Employer Code Factory
 * @returns Promise<PesticideEmployerCode>
 */
export const pesticideEmployerCodeFactory =
    CodeFactory<PesticideEmployerCode, PesticideEmployerCodeController>(PesticideEmployerCodeController.shared);

/**
 * @description Chemical Treatment Method Code Factory
 * @returns Promise<ChemicalTreatmentMethodCode>
 */
export const chemicalTreatmentMethodCodeFactory =
    CodeFactory<ChemicalTreatmentMethodCode, ChemicalTreatmentMethodCodeController>(ChemicalTreatmentMethodCodeController.shared);

/**
 * @description Herbicide Code Factory
 * @returns Promise<Herbicide>
 */
export const herbicideCodeFactory =
    CodeFactory<Herbicide, HerbicideController>(HerbicideController.shared);

/**
 * @description Wind Direction Code Factory
 * @returns Promise<WindDirectionCodes>
 */
export const windDirectionCodeFactory =
    CodeFactory<WindDirectionCodes, WindDirectionCodesController>(WindDirectionCodesController.shared);
// ----------------------------------------------------------------
