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
 * File: mechanical.treatment.route.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 1:42:36 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 12th August 2019 1:43:12 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import { Request, Router } from 'express';
import {
    SecureRouteController,
    RouteHandler,
    Route,
    HTTPMethod,
    writerOnlyRoute,
    ValidatorExists,
    ValidatorCheck
} from '../../../core';
import { MechanicalTreatmentController, MechanicalTreatmentCreateSpec, ObservationController } from '../../../../database/models';

const CreateTreatmentValidator = (): any[] => {
    return [
        ValidatorExists({ observation: ObservationController.shared})
            .concat(ValidatorCheck({
                applicatorFirstName: {
                    validate: validate => validate.isString(),
                    message: 'should be string'
                },
                applicatorLastName: {
                    validate: validate => validate.isString(),
                    message: 'should be string'
                },
                latitude: {
                    validate: validate => validate.isNumeric(),
                    message: 'should be number'
                },
                longitude: {
                    validate: validate => validate.isNumeric(),
                    message: 'should be number'
                },
                width: {
                    validate: validate => validate.isNumeric(),
                    message: 'should be number'
                },
                length: {
                    validate: validate => validate.isNumeric(),
                    message: 'should be number'
                }
            }))
    ];
};

export class MechanicalTreatmentRouteController extends SecureRouteController<MechanicalTreatmentController> {
    static get shared(): MechanicalTreatmentRouteController {
        return this.sharedInstance<MechanicalTreatmentController>() as MechanicalTreatmentRouteController;
    }

    constructor() {
        super();
        this.dataController = MechanicalTreatmentController.shared;
        this.applyRouteConfig();
    }

    @Route({
        path: 'api/treatment/mechanical#/',
        description: 'Create API for Mechanical Treatment',
        method: HTTPMethod.post,
        validators: CreateTreatmentValidator,
        middleware: () => {
            return [writerOnlyRoute()];
        },
        responses: {
        '200': {
            description: 'Mechanical Treatment: Record creation success',
            schema: {
                type: 'object'
            }
        },
        '500': {
            description: 'Mechanical Treatment: Record creation error',
            schema: {
                type: 'object',
                $ref: '#/definitions/Error'
            }
        }
    }})
    get create(): RouteHandler {
        return this.routeConfig<MechanicalTreatmentCreateSpec>('create', async (data: MechanicalTreatmentCreateSpec, req: Request ) => {
            const mt = await this.dataController.createNew(data, req.user);
            return [200, mt];
        });
    }
}

export const mechanicalTreatmentRoute = (): Router => MechanicalTreatmentRouteController.shared.router;

// ---------------------------------------------------------
