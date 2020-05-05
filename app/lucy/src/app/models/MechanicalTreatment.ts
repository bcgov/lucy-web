/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Observation, InvasivePlantSpecies, SpeciesAgencyCodes } from './observation';

export interface MechanicalTreatment {
        mechanical_treatment_id: number;
        latitude: number;
        longitude: number;
        length: number;
        width: number;
        applicatorFirstName: string;
        applicatorLastName: string;
        secondaryApplicatorFirstName: string;
        secondaryApplicatorLastName: string;
        providerContractor: MechanicalTreatmentProviders;
        date: string;
        paperFileReference: string;
        comment: string;
        observation: Observation;
        species: InvasivePlantSpecies;
        speciesAgency: SpeciesAgencyCodes;
        mechanicalMethod: MechanicalTreatmentMethodsCodes;

        signageOnSiteIndicator: boolean;

        mechanicalDisposalMethod: MechanicalDisposalMethodsCodes;
        soilDisturbance: MechanicalSoilDisturbanceCodes;
        rootRemoval: MechanicalRootRemovalCodes;
        issue: MechanicalIssueCodes;
}


export interface MechanicalTreatmentMethodsCodes {
        description: string;
        activeIndicator: boolean;
        mechanical_method_code_id: number;
        code: string;
}

export interface MechanicalDisposalMethodsCodes {
        description: string;
        activeIndicator: boolean;
        mechanical_disposal_method_code_id: number;
        code: string;
}

export interface MechanicalSoilDisturbanceCodes {
        description: string;
        activeIndicator: boolean;
        mechanical_soil_disturbance_code_id: number;
        code: string;
}

export interface MechanicalRootRemovalCodes {
        description: string;
        activeIndicator: boolean;
        mechanical_root_removal_code_id: number;
        code: string;
}

export interface MechanicalIssueCodes {
        description: string;
        activeIndicator: boolean;
        mechanical_treatment_issue_code_id: number;
        code: string;
}

export interface MechanicalTreatmentProviders {
        treatment_provider_contractor_id: number;
        registrationNumber: number;
        businessName: string;
        category: string;
        address: string;
        regions: string;
        licenceExpiryDate: string;
        serviceProvideIndicator: boolean;
}