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
 * File: bcGeoData.route.ts
 * Project: lucy
 * File Created: Wednesday, 22nd April 2020 5:11:42 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Wednesday, 22nd April 2020 5:12:22 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import {
    Route,
    RouteController,
    HTTPMethod,
    Get,
} from '../../core';
import { WFSService, BCGWFeatures } from '../../../integrations';

export class BCGeoDataRouteController extends RouteController {

    @Route({
        path: 'api/bcgeodata#/',
        description: 'API route controller for BC Data Catalogue queries',
        method: HTTPMethod.get,
        secure: true
    })

    /**
     * @description Shared instance
     */
    static get shared(): BCGeoDataRouteController {
        return this.sharedInstance() as BCGeoDataRouteController;
    }

    constructor() {
        super();
    }

    @Get({
        path: '/municipalities',
    })
    public async municipalities(): Promise<[number, any]> {
        return [200, await WFSService.shared.getLayer(BCGWFeatures.municipality)];
    }

    @Get({
        path: '/regional-districts',
    })
    public async regionalDistricts(): Promise<[number, any]> {
        return [200, await WFSService.shared.getLayer(BCGWFeatures.regionalDistrict)];
    }

    @Get({
        path: '/wells',
    })
    public async wells(req: any, data?: any): Promise<[number, any]> {
        return [200, await WFSService.shared.getLayerInBoundingBox(BCGWFeatures.well, req.query.bbox)];
    }
}
