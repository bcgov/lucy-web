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
 * File: watercraftRiskAssessment.route.ts
 * Project: lucy
 * File Created: Tuesday, 5th November 2019 10:16:47 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 5th November 2019 10:58:51 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    writerOnlyRoute,
    UpdateMiddleware
} from '../../../core';
import {
    WatercraftRiskAssessmentController,
    WatercraftRiskAssessmentSpec
} from '../../../../database/models';
@ResourceRoute({
    path: '/api/mussels/wra/#',
    description: 'API route controller for Watercraft risk assessment',
    dataController: WatercraftRiskAssessmentController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [writerOnlyRoute()])
@UpdateMiddleware(() => [writerOnlyRoute()])
export class WatercraftRiskAssessmentRouteController extends ResourceRouteController<WatercraftRiskAssessmentController, WatercraftRiskAssessmentSpec, any> {
    static get shared(): WatercraftRiskAssessmentRouteController {
        return this.sharedInstance() as WatercraftRiskAssessmentRouteController;
    }
}
