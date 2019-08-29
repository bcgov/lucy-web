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
import * as assert from 'assert';
import * as moment from 'moment';
import { Router } from 'express';
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    // RouteHandler,
    // Route,
    // HTTPMethod,
    // writerOnlyRoute,
    ValidatorExists,
    ValidatorCheck,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware
} from '../../../core';
import {
    MechanicalTreatmentController,
    MechanicalTreatmentCreateSpec,
    ObservationController,
    SpeciesController,
    MechanicalMethodCodeController,
    SpeciesAgencyCodeController,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCodeController
} from '../../../../database/models';

const CreateTreatmentValidator = (): any[] => {
    return ValidatorExists({
            observation: ObservationController.shared,
            species: SpeciesController.shared,
            speciesAgency: SpeciesAgencyCodeController.shared,
            mechanicalMethod: MechanicalMethodCodeController.shared,
            mechanicalDisposalMethod: MechanicalDisposalMethodCodeController.shared,
            soilDisturbance: MechanicalSoilDisturbanceCodeController.shared
        }).concat(ValidatorCheck({
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
                },
                date: {
                    validate: validate => validate.isString().custom(async (val: string, {req}) => {
                        assert(moment(val, 'YYYY-MM-DD').isValid(), `date: should be string in YYYY-MM-DD format`);
                    }),
                    message: 'should be string in YYYY-MM-DD format'
                },
                paperFileReference: {
                    validate: validate => validate.isString().isAlphanumeric().optional(),
                    message: 'should be alphanumeric string'
                },
                comment: {
                    validate: validate => validate.isString().optional()
                },
                signageOnSiteIndicator: {
                    validate: validate => validate.isBoolean().optional()
                }
            }));
};

@ResourceRoute({
    path: 'api/treatment/mechanical/#',
    description: 'API route controller for mechanical treatment',
    dataController: MechanicalTreatmentController.shared,
    validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class MechanicalTreatmentRouteController extends ResourceRouteController<MechanicalTreatmentController, MechanicalTreatmentCreateSpec, any> {
    static get shared(): MechanicalTreatmentRouteController {
        return this.sharedInstance<MechanicalTreatmentController>() as MechanicalTreatmentRouteController;
    }
}

export const mechanicalTreatmentRoute = (): Router => MechanicalTreatmentRouteController.shared.router;

// ---------------------------------------------------------
