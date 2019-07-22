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
import * as moment from 'moment';
import { DataModelController } from '../data.model.controller';
import { Observation, ObservationSpecies, Species, JurisdictionCode, User, ObservationSpeciesCreateModel, ObservationSpeciesUpdateModel } from '../models';
import { ObservationSchema, ObservationSpeciesSchema, SpeciesSchema, JurisdictionCodeSchema } from '../database-schema';

/**
 * @description Request body of observation create
 */
export interface ObservationCreateModel {
    lat: number;
    long: number;
    date: string;
}

/**
 * @description Request body to update observation
 */
export interface ObservationUpdateModel {
    lat?: number;
    long?: number;
    date?: string;
}

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
        const observation: Observation = this.create();
        observation.date = moment(createModel.date).toDate();
        observation.lat = createModel.lat;
        observation.long = createModel.long;

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
    async update(observation: Observation, update: ObservationUpdateModel, user: User) {
        observation.lat = update.lat || observation.lat;
        observation.long = update.long || observation.long;
        observation.date = update.date ? moment(update.date).toDate() : observation.date;
        observation.updatedBy = user;
        await this.saveInDB(observation);
        return observation;
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

    /**
     * @description Create new observation species
     * @param ObservationSpeciesCreateModel data
     * @param User user
     */
    async createObservationOfSpecies(data: ObservationSpeciesCreateModel, user: User) {
        const obj: ObservationSpecies = data as ObservationSpecies;
        obj.createdBy = user;
        obj.updatedBy = user;
        await this.saveInDB(obj);
        return obj;
    }

    /**
     * @description Create new observation species
     * @param ObservationSpeciesCreateModel data
     * @param User user
     */
    async updateObservationOfSpecies(obj: ObservationSpecies, data: ObservationSpeciesUpdateModel, user: User) {
        obj.length = data.length || obj.length;
        obj.width = data.width || obj.width;
        obj.accessDescription = data.accessDescription || obj.accessDescription;
        obj.surveyorFirstName = data.surveyorFirstName || obj.surveyorFirstName;
        obj.surveyorLastName = data.surveyorLastName || obj.surveyorLastName;
        obj.species = data.species || obj.species;
        obj.jurisdiction = data.jurisdiction || obj.jurisdiction;
        obj.observation = data.observation || obj.observation;
        obj.speciesAgency = data.speciesAgency || obj.speciesAgency;
        obj.distribution = data.distribution || obj.distribution;
        obj.density = data.density || obj.density;
        obj.surveyType = data.surveyType || obj.surveyType;
        obj.surveyGeometry = data.surveyGeometry || obj.surveyGeometry;
        obj.specificUseCode = data.specificUseCode || obj.specificUseCode;
        obj.soilTexture = data.soilTexture || obj.soilTexture;
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
