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
 * File: observerWorkflow.route.ts
 * Project: lucy
 * File Created: Wednesday, 6th November 2019 12:59:31 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Wednesday, 6th November 2019 1:00:28 pm
 * Modified By: pushan (you@you.you>)
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
} from '../../../core';
import {
    ObserverWorkflowController,
    ObserverWorkflowSpec
} from '../../../../database/models';
@ResourceRoute({
    dataController: ObserverWorkflowController.shared,
    secure: true
})
@CreateMiddleware(() => [ inspectAppEditorRoute()])
@UpdateMiddleware(() => [ inspectAppEditorRoute()])
export class ObserverWorkflowRouteController extends ResourceRouteController<ObserverWorkflowController, ObserverWorkflowSpec, any> {
    static get shared(): ObserverWorkflowRouteController {
        return this.sharedInstance() as ObserverWorkflowRouteController;
    }

    /**
     * @description Create New Object
     * @param Request req
     * @param any data
     */
    public async createResource(req: any, data: any): Promise<[number, any]> {
        // Get Proper data mapping
        return [201, await this.dataController.createNewObject(data, req.user)];
    }

    @Get({
        path: '/export',
        secure: true,
        middleware: () => [ inspectAppAdminRoute()]
    })
    public async export() {
        return [200, await this.dataController.export()];
    }

}
