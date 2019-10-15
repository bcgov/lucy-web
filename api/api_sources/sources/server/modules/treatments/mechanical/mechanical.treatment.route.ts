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
import { Router } from 'express';
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware
} from '../../../core';
import {
    MechanicalTreatmentController,
    MechanicalTreatmentSpec
} from '../../../../database/models';
@ResourceRoute({
    path: 'api/treatment/mechanical/#',
    description: 'API route controller for mechanical treatment',
    dataController: MechanicalTreatmentController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class MechanicalTreatmentRouteController extends ResourceRouteController<MechanicalTreatmentController, MechanicalTreatmentSpec, any> {
    static get shared(): MechanicalTreatmentRouteController {
        return this.sharedInstance() as MechanicalTreatmentRouteController;
    }
}

export const mechanicalTreatmentRoute = (): Router => MechanicalTreatmentRouteController.shared.router;

// ---------------------------------------------------------
