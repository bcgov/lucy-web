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
    UpdateMiddleware,
    Get,
    inspectAppEditorRoute,
    inspectAppAdminRoute
} from '../../core';
import {
    BlowByController,
    BlowBySpec
} from '../../../database/models';


@ResourceRoute({
    path: '/api/mussels/blow-bys/#',
    description: 'API route controller for Blow Bys',
    dataController: BlowByController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [ inspectAppEditorRoute() ])
@UpdateMiddleware(() => [ inspectAppEditorRoute() ])
export class BlowByRouteController extends ResourceRouteController<BlowByController, BlowBySpec, any> {
    static get shared(): BlowByRouteController {
        return this.sharedInstance() as BlowByRouteController;
    }

    /**
     * @description Create New Object
     * @param Request req
     * @param any data
     */
    public async createResource(req: any, data: any): Promise<[number, any]> {
        // Get Proper data mapping
        console.log('BlowBy: createResource: req: ', req);
        console.log('BlowBy: createResource: data: ', data);
        return [201, await this.dataController.createNewObject(data, req.user)];
    }

    @Get({
        path: '/export',
        secure: true,
        middleware: () => [ inspectAppAdminRoute() ]
    })
    public async export() {
        return [200, await this.dataController.export()];
    }
}
