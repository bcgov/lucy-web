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
// Created by Pushan Mitra on 2019-07-08.
/**
 * Imports
 */
import * as assert from 'assert';
import * as _ from 'underscore';
import { Request, Router} from 'express';
import { check } from 'express-validator';
import { SecureRouteController, RouteHandler } from '../../core';
import { ObservationController, JurisdictionCodeController, SpeciesController, ObservationCreateModel, Observation, ObservationUpdateModel} from '../../../database/models';
import { SpeciesDensityCodeController, SpeciesDistributionCodeController } from '../../../database/models';
import { observationSpeciesRoute } from './observation.species.route';
import { unWrap } from '../../../libs/utilities';

/**
 * @description Validation of create object for observation
 */
const CreateValidator = (): any[] =>  {
    return [
        check('lat').isNumeric().withMessage('lat: should be number'),
        check('long').isNumeric().withMessage('long: should be number'),
        check('date').isString().withMessage('date: should be string')
    ];
};

/**
 * @description Validation of observationId in req param
 */
const ObservationIdValidator = (): any[] => [
    check('observationId').isInt().custom(async (value: number, {req}) => {
    const obs = await ObservationController.shared.findById(value);
    assert(obs, `observation: No observation exists with id ${value}`);
    req.validation = {
        observation: obs
    };
})];
/**
 * @description Validation response object in request
 */
interface ObservationIdValidation {
    observation: Observation;
}

const UpdateValidator = (): any[] => {
    return _.map(CreateValidator(), checkVal => checkVal.optional());
};

export class ObservationRouteController extends SecureRouteController<ObservationController> {

    static get shared(): ObservationRouteController {
        return this.sharedInstance<ObservationController>() as ObservationRouteController;
    }

    constructor() {
        super();
        // Data controller
        this.dataController = ObservationController.shared;

        // Observation species route
        this.router.use('/species', observationSpeciesRoute());

        // Get all codes
        this.router.get('/codes', this.indexCodes);

        // Create observation
        this.router.post('/', CreateValidator(), this.create);

        // Get all observation
        this.router.get('/', this.index);

        // Get single observation
        this.router.get('/:observationId', ObservationIdValidator(), this.index);

        // Update single observation
        this.router.put('/:observationId', UpdateValidator().concat(ObservationIdValidator()), this.update);
    }

    /**
     * @description Route Handler to load all codes for observation
     */
    get indexCodes(): RouteHandler {
        return this.routeConfig<any>('indexCodes', async () => [200, {
            jurisdictionCodes : await JurisdictionCodeController.shared.all(),
            speciesList: await SpeciesController.shared.all(),
            speciesDensityCodes: await SpeciesDensityCodeController.shared.all(),
            speciesDistributionCodes: await SpeciesDistributionCodeController.shared.all()
        }]);
    }

    /**
     * @description Route handle for creating new observation
     */
    get create(): RouteHandler {
        return this.routeConfig<ObservationCreateModel>('observation-create',
        async (data: ObservationCreateModel, req: Request) => [201, await this.dataController.createObservation(data, req.user)]
        );
    }

    /**
     * @description Route handler to fetch all observation
     */
    get index(): RouteHandler {
        return this.routeConfig<any>('observation-index', async (d: any, req: Request) => [
            200,
            unWrap(this.validation<ObservationIdValidation>(req, 'obs-index'), {}).observation || await this.dataController.all()
        ]);
    }

    get update(): RouteHandler {
        return this.routeConfig<ObservationUpdateModel>('observation-update', async (data: ObservationUpdateModel, req: Request) => [
            200,
            await this.dataController.update(this.validation<ObservationIdValidation>(req, 'obs-update').observation, data, req.user)]);
    }
}

/**
 * @description Exposing router object
 */
export const observationRoute = (): Router => ObservationRouteController.shared.router;


 // -----------------------------------------------------------------------------------------------------------

