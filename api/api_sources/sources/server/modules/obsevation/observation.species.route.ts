//
// Account route controller
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
// Created by Pushan Mitra on 2019-07-09.
/**
 * Imports
 */
import * as assert from 'assert';
import { Router } from 'express';
import { check } from 'express-validator';
import { SecureRouteController, RouteHandler, MakeOptionalValidator } from '../../core';
import { ObservationSpeciesController, SpeciesController, JurisdictionCodeController, ObservationController } from '../../../database/models';
import { ObservationSpeciesCreateModel, ObservationSpeciesUpdateModel, ObservationSpecies } from '../../../database/models';
// import { DataController } from '../../../database/data.model.controller';

const CreateValidator = (): any[] =>  {
    return [
        check('width').isNumeric().withMessage('width: should be number'),
        check('length').isNumeric().withMessage('length: should be number'),
        check('accessDescription').isString().withMessage('accessDescription: should be string'),
        check('species').isInt().custom(async (value: number, {req}) => {
            const species = await SpeciesController.shared.findById(value);
            assert(species, `species: No Species exists with id ${value}`);
            req.species = species;
        }),
        check('jurisdiction').isInt().custom(async (value: number, {req}) => {
            const code = await JurisdictionCodeController.shared.findById(value);
            assert(code, `jurisdiction: No Jurisdiction code exists with id ${value}`);
            req.jurisdictionCode = code;
        }),
        check('observation').isInt().custom(async (value: number, {req}) => {
            const obs = await ObservationController.shared.findById(value);
            assert(obs, `observation: No observation exists with id ${value}`);
            req.observation = obs;
        })
    ];
};

export class ObservationSpeciesRouteController extends SecureRouteController <ObservationSpeciesController> {

    static get shared(): ObservationSpeciesRouteController {
        return this.sharedInstance<ObservationSpeciesController>() as ObservationSpeciesRouteController;
    }

    constructor() {
        super();
        this.dataController = ObservationSpeciesController.shared;
        this.router.post('/', CreateValidator(), this.create);
        this.router.put('/:id', this.combineValidator(MakeOptionalValidator(CreateValidator), this.idValidation()), this.update);
    }

    // Create Observation - species entry
    get create(): RouteHandler {
        return this.routeConfig<any>('obs:species-create', async (data: any, req: any) => {
            const model: ObservationSpeciesCreateModel = {
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observation: req.observation
            };
            return [201, await this.dataController.createObservationOfSpecies(model, req.user)];
        });
    }

    /**
     * @description Route handle to update observation species
     */
    get update(): RouteHandler {
        return this.routeConfig<any>('obs:species-update', async (data: any, req: any) => {
            const model: ObservationSpeciesUpdateModel = {
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observation: req.observation
            };
            const observationSpecies: ObservationSpecies = this.validation<any>(req).id as ObservationSpecies;
            return [200, await this.dataController.updateObservationOfSpecies(observationSpecies, model, req.user)];
        });
    }
}

/**
 * @description Exposing router object
 */
export const observationSpeciesRoute = (): Router => ObservationSpeciesRouteController.shared.router;

// -----------------------------------------------------------------------------------------------------------
