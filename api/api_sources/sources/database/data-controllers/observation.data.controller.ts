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
        obj.lat = data.lat || obj.lat;
        obj.long = data.long || obj.long;
        obj.date = data.date || obj.date;
        obj.length = data.length || obj.length;
        obj.width = data.width || obj.width;
        obj.accessDescription = data.accessDescription || obj.accessDescription;
        obj.observerFirstName = data.observerFirstName || obj.observerFirstName;
        obj.observerLastName = data.observerLastName || obj.observerLastName;
        obj.species = data.species || obj.species;
        obj.jurisdiction = data.jurisdiction || obj.jurisdiction;
        obj.speciesAgency = data.speciesAgency || obj.speciesAgency;
        obj.distribution = data.distribution || obj.distribution;
        obj.density = data.density || obj.density;
        obj.observationType = data.observationType || obj.observationType;
        obj.observationGeometry = data.observationGeometry || obj.observationGeometry;
        obj.specificUseCode = data.specificUseCode || obj.specificUseCode;
        obj.soilTexture = data.soilTexture || obj.soilTexture;
        obj.slopeCode = data.slopeCode || obj.slopeCode;
        obj.aspectCode = data.aspectCode || obj.aspectCode;
        obj.proposedAction = data.proposedAction || obj.proposedAction;
        obj.sampleIdentifier = data.sampleIdentifier || obj.sampleIdentifier;
        obj.rangeUnitNumber = data.rangeUnitNumber || obj.rangeUnitNumber;
        obj.legacySiteIndicator = data.legacySiteIndicator || obj.legacySiteIndicator;
        obj.edrrIndicator = data.edrrIndicator || obj.edrrIndicator;
        obj.researchIndicator = data.researchIndicator || obj.researchIndicator;
        obj.specialCareIndicator = data.specialCareIndicator || obj.specialCareIndicator;
        obj.biologicalIndicator = data.biologicalIndicator || obj.biologicalIndicator;

        obj.updatedBy = user;
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
