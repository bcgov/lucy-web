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
 * File: animal-observation.route.ts
 * Project: lucy
 * File Created: Thursday, 14th May 2020 11:40:05 am
 * Author: Raj Manivannan
 * -----
 */

 /**
 * Imports
 */
import { Router } from 'express';
import {
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware,
    Get,
    editorOnlyRoute,
} from '../../core';
import {
    AnimalObservationController,
    AnimalObservationSpec
} from '../../../database/models';
@ResourceRoute({
    path: 'api/animal-observation#/',
    description: 'API route controller for animal observation',
    dataController: AnimalObservationController.shared,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class AnimalObservationRouteController extends ResourceRouteController<AnimalObservationController, AnimalObservationSpec, any> {
    static get shared(): AnimalObservationRouteController {
        return this.sharedInstance() as AnimalObservationRouteController;
    }

    @Get({
        path: '/search',
    })
    public async search(req: any, data?: any): Promise<[number, any]> {
        return [200, await this.dataController.search(req.query.keyword)];
    }

    @Get({
        path: '/export',
        secure: true,
        middleware: () => [ editorOnlyRoute() ]
    })
    public async export() {
        return [200, await this.dataController.export()];
    }
}

export const animalObservationRoute = (): Router => AnimalObservationRouteController.shared.router;
