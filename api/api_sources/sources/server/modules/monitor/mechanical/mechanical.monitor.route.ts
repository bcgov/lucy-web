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
 * File: mechanical.monitor.route.ts
 * Project: lucy
 * File Created: Tuesday, 21st January 2020 11:54:05 am
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Tuesday, 21st January 2020 1:53:57 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
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
    MechanicalMonitorController,
    MechanicalMonitorSpec
} from '../../../../database/models';
@ResourceRoute({
    path: 'api/monitor/mechanical/#',
    description: 'API route controller for mechanical monitoring',
    dataController: MechanicalMonitorController.shared,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class MechanicalMonitorRouteController extends ResourceRouteController<MechanicalMonitorController, MechanicalMonitorSpec, any> {
    static get shared(): MechanicalMonitorRouteController {
        return this.sharedInstance() as MechanicalMonitorRouteController;
    }
}

/**
 * @description Function to return mechanical monitoring route handle
 * @export const mechanicalMonitorRoute
 */
export const mechanicalMonitorRoute = (): Router => MechanicalMonitorRouteController.shared.router;

// ---------------------------------------------------------
