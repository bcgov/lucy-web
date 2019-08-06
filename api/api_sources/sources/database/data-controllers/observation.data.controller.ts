//
// Index for data controllers
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-07-08.
/**
 * Imports
 */
import { DataModelController } from '../data.model.controller';
import { Observation, Species, JurisdictionCode, User, ObservationCreateModel, ObservationUpdateModel } from '../models';
import { ObservationSchema, SpeciesSchema, JurisdictionCodeSchema } from '../database-schema';
import { ifDefined, setNull } from '../../libs/utilities';

/**
 * @description Request body of observation create
 */

/**
 * @description Data Model controller for Observation
 */
export class ObservationController extends DataModelController<Observation> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): ObservationController {
        return this.sharedInstance<Observation>(Observation, ObservationSchema) as ObservationController;
    }

    /**
     * @description Create and store new observation
     * @param ObservationCreateModel createModel Data for new observation
     * @param User user Creator
     * @returns H
     */
    async createObservation(createModel: ObservationCreateModel, user: User): Promise<Observation> {
        // Create new observation
        const observation: Observation = createModel as Observation;

        // Saving audit
        observation.createdBy = user;
        observation.updatedBy = user;

        // Saving into DB
        await this.saveInDB(observation);
        return observation;
    }

    /**
     * @description Update observation
     * @param Observation observation:  Input observation
     * @param ObservationUpdateModel update: Input values
     * @param  User user : Update by
     */
    async update(obj: Observation, data: ObservationUpdateModel, user: User) {
        obj.lat = ifDefined(data.lat, obj.lat);
        obj.long = ifDefined(data.long, obj.long);
        obj.date = ifDefined(data.date, obj.date);
        obj.length = ifDefined(data.length, obj.length);
        obj.width = ifDefined(data.width, obj.width);
        obj.accessDescription = ifDefined(data.accessDescription, obj.accessDescription);
        obj.observerFirstName = ifDefined (data.observerFirstName, obj.observerFirstName);
        obj.observerLastName = ifDefined(data.observerLastName, obj.observerLastName);
        obj.species = ifDefined(data.species, obj.species);
        obj.jurisdiction = ifDefined(data.jurisdiction, obj.jurisdiction);
        obj.speciesAgency = ifDefined(data.speciesAgency, obj.speciesAgency);
        obj.distribution = ifDefined(data.distribution, obj.distribution);
        obj.density = ifDefined (data.density, obj.density);
        obj.observationType = ifDefined(data.observationType, obj.observationType);
        obj.observationGeometry = ifDefined(data.observationGeometry, obj.observationGeometry);
        obj.specificUseCode = ifDefined(data.specificUseCode, obj.specificUseCode);
        obj.soilTexture = ifDefined(data.soilTexture, obj.soilTexture);
        obj.slopeCode = ifDefined(data.slopeCode, obj.slopeCode);
        obj.aspectCode = ifDefined(data.aspectCode, obj.aspectCode);
        obj.proposedAction = ifDefined(data.proposedAction, obj.proposedAction);
        obj.legacySiteIndicator = ifDefined(data.legacySiteIndicator, obj.legacySiteIndicator);
        obj.edrrIndicator = ifDefined(data.edrrIndicator, obj.edrrIndicator);
        obj.researchIndicator = ifDefined(data.researchIndicator, obj.researchIndicator);
        obj.specialCareIndicator = ifDefined(data.specialCareIndicator, obj.specialCareIndicator);
        obj.biologicalIndicator = ifDefined(data.biologicalIndicator, obj.biologicalIndicator);
        obj.aquaticIndicator = ifDefined(data.aquaticIndicator, obj.aquaticIndicator);
        obj.sampleTakenIndicator = ifDefined(data.sampleTakenIndicator, obj.sampleTakenIndicator);
        obj.wellIndicator = ifDefined(data.wellIndicator, obj.wellIndicator);
        obj.sampleIdentifier = ifDefined(data.sampleIdentifier, obj.sampleIdentifier);
        obj.rangeUnitNumber = ifDefined(data.rangeUnitNumber, obj.rangeUnitNumber);

        obj.updatedBy = user;
        if (obj.sampleTakenIndicator === false) {
           setNull<Observation>(obj, 'sampleIdentifier');
        }
        await this.saveInDB(obj);
        return obj;
    }
}

/**
 * @description Data Model controller for Species
 */
export class SpeciesController extends DataModelController<Species> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): SpeciesController {
        return this.sharedInstance<Species>(Species, SpeciesSchema) as SpeciesController;
    }
}

/**
 * @description Data Model controller for JurisdictionCode
 */
export class JurisdictionCodeController extends DataModelController<JurisdictionCode> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): JurisdictionCodeController {
        return this.sharedInstance<JurisdictionCode>(JurisdictionCode, JurisdictionCodeSchema) as JurisdictionCodeController;
    }
}

// -----------------------------------------------------------------------------------------------------------
