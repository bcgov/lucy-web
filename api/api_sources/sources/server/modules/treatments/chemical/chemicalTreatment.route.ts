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
 * File: chemicalTreatment.route.ts
 * Project: lucy
 * File Created: Monday, 7th October 2019 10:49:16 am
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 7th October 2019 11:22:07 am
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
    ChemicalTreatmentController,
    ChemicalTreatmentSpec
} from '../../../../database/models';
@ResourceRoute({
    path: 'api/treatment/chemical/#',
    description: 'API route controller for chemical treatment',
    dataController: ChemicalTreatmentController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class ChemicalTreatmentRouteController extends ResourceRouteController<ChemicalTreatmentController, ChemicalTreatmentSpec, any> {
    static get shared(): ChemicalTreatmentRouteController {
        return this.sharedInstance() as ChemicalTreatmentRouteController;
    }
}

/**
 * @description Function to return Chemical Treatment route handle
 * @export const chemicalTreatmentRoute
 */
export const chemicalTreatmentRoute = (): Router => {
    const controller = new ChemicalTreatmentRouteController();
    return controller.router;
};
// ---------------------------------------------------------
