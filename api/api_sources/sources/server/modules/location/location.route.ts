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
 * File: location.route.ts
 * Project: lucy
 * File Created: Monday, 16th December 2019 10:18:58 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Monday, 16th December 2019 10:20:18 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
/**
 * WEB-API to fetch location centric information
 */
/**
 * Imports
 */
import * as assert from 'assert';
import { check } from 'express-validator';
import {
    RouteController,
    Route,
    HTTPMethod
} from '../../core';
import { WFSService, BCGWFeatures, BCGWConst } from '../../../integrations';
/**
 * Exports
 */
/**
 * @description Location Specific info route controllers
 */
export class LocationRouteController extends RouteController {
    /**
     * @description Shared instance
     */
    static get shared(): LocationRouteController {
        return this.sharedInstance() as LocationRouteController;
    }

    constructor() {
        super();
    }

    @Route({
        path: 'api/location#/gwells-data',
        description: 'API to fetch all application codes',
        method: HTTPMethod.get,
        responses: {
            200: {
                description: 'Success',
                schema: {
                    type: 'object'
                }
            }
        },
        validators: () => [
            check('latitude').isNumeric(),
            check('longitude').isNumeric(),
            check('distance').isNumeric().optional()
        ],
        secure: true
    })
    async wells(req: any) {
        return [200, await this.fetchWellsData(req.query)];
    }

    async fetchWellsData(query: any) {
        const latitude: number = query.latitude;
        const longitude: number = query.longitude;
        const distance: number = query.distance || BCGWConst.minimalDistance;
        assert(longitude && latitude, `fetchWellsData: Invalid location`);
        return await WFSService.shared.getNearest(BCGWFeatures.well, {latitude: latitude, longitude: longitude}, distance);
    }

}
// ----------------------------------
