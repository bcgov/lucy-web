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

import { DataModelController } from '../data.model.controller';
import { Observation, ObservationSpecies, Species, JurisdictionCode } from '../models';
import { ObservationSchema, ObservationSpeciesSchema, SpeciesSchema, JurisdictionCodeSchema } from '../database-schema';


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
}

/**
 * @description Data Model controller for ObservationSpecies
 */
export class ObservationSpeciesController extends DataModelController<ObservationSpecies> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): ObservationSpeciesController {
        return this.sharedInstance<ObservationSpecies>(ObservationSpecies, ObservationSpeciesSchema) as ObservationSpeciesController;
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
