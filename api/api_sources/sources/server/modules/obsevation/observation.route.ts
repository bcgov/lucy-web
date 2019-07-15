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
import { Request, Router} from 'express';
import { check } from 'express-validator';
import { SecureRouteController, RouteHandler } from '../../core';
import { ObservationController, JurisdictionCodeController, SpeciesController, ObservationCreateModel} from '../../../database/models';
import { observationSpeciesRoute } from './observation.species.route';

const createValidator = (): any[] =>  {
    return [
        check('lat').isNumeric().withMessage('lat: should be number'),
        check('long').isNumeric().withMessage('long: should be number'),
        check('date').isString().withMessage('accessDescription: should be string')
    ];
};

const getObservationValidator = (): any[] => [
    check('observationId').isInt().custom(async (value: number, {req}) => {
    const obs = await ObservationController.shared.findById(value);
    assert(obs, `observation: No observation exists with id ${value}`);
    req.observation = obs;
})];

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
        this.router.post('/', createValidator(), this.create);

        // Get all observation
        this.router.get('/', this.index);

        // Get single observation
        this.router.get('/:observationId', getObservationValidator(), this.index);
    }

    /**
     * @description Route Handler to load all codes for observation
     */
    get indexCodes(): RouteHandler {
        return this.routeConfig<any>('indexCodes', async () => {
            // Get all jurisdiction code
            const jurisdictionCodes = await JurisdictionCodeController.shared.all();
            // Get all species
            const speciesList = await SpeciesController.shared.all();
            return [200, {jurisdictionCodes, speciesList}];
        });
        /*return async (req: Request, resp: Response) => {
            try {
                assert(req.user, 'No User for request');
                // Get all jurisdiction code
                const jurisdictionCodes = await JurisdictionCodeController.shared.all();
                // Get all species
                const speciesList = await SpeciesController.shared.all();

                // Sending resp
                return resp.status(200).json(this.successResp({jurisdictionCodes, speciesList}));
            } catch (excp) {
                this.commonError(500, 'indexCodes', excp, resp);
                return;
            }
        };*/
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
        return this.routeConfig<any>('observation-index', async (_: any, req: Request) => [200, (req['observation'] ? req['observation'] : await this.dataController.all())]);
    }
}

/**
 * @description Exposing router object
 */
export const observationRoute = (): Router => ObservationRouteController.shared.router;


 // -----------------------------------------------------------------------------------------------------------

