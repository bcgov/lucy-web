//
// Route controller for any route miscellaneous route paths
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-05-10.

// TODO: Create Version routes and other generic info routes

/**
 * Import
 */
import * as express from 'express';
import * as assert from 'assert';
import { errorBody, BaseRouteController, RouteHandler, Route, HTTPMethod} from '../../core';
import { testIdr1Token, testIdr3Token, viewerToken } from '../../../test-helpers/token';
import { check } from 'express-validator';

export const miscellaneous = () => {};

export const defaultRoute = () => {
    const route = express.Router();
    route.all('*', (_req, _res) => {
        assert(_req);
        _res.status(404).json(errorBody('Route Not Found', []));
    });
    return route;
};

/**
 * @description Tokens map
 */
const tokens = {
    admin : testIdr1Token(),
    sme: testIdr3Token(),
    viewer: viewerToken()
};

/**
 * @description MiscellaneousRoute route controller
 */
export class MiscellaneousRouteController extends BaseRouteController<any> {
    static get shared(): MiscellaneousRouteController {
        return this.sharedInstance<MiscellaneousRouteController>() as MiscellaneousRouteController;
    }

    constructor() {
        super();
    }

    get versionString(): string {
        return `${process.env.ENVIRONMENT || 'default'}-${process.env.VERSION || '0.0'}-${process.env.CHANGE_VERSION || '0'}`;
    }

    @Route({
        path: 'api/misc#/version',
        description: 'Version API for app',
        method: HTTPMethod.get,
        responses: {
            200: {
                description: 'Success',
                schema: {
                    type: 'object'
                }
            }
        }
    })
    get version(): RouteHandler {
        return this.routeConfig<any>('version', async () => [200, {
            version: this.versionString,
            env: process.env.ENVIRONMENT || 'default',
            changeId: process.env.CHANGE_VERSION || 'NA'
        }]);
    }

    @Route({
        path: 'api/misc#/test-token/:key',
        description: 'Get test token for testing',
        method: HTTPMethod.get
    })
    get testToken(): RouteHandler {
        return this.routeConfig<any>('test-token', async (d: any, req: express.Request) => [200, {
            token: tokens[req.params.key] || ''
        }]);
    }

    @Route({
        description: 'Test route',
        path: 'api/misc#/test',
        index: 1,
        method: HTTPMethod.get
    })
    get test(): RouteHandler {
        return this.routeConfig<any>('test', async() => [200, {}]);
    }

    @Route({
        description: 'Mirror',
        path: 'api/misc#/mirror',
        index: 2,
        method: HTTPMethod.post,
        validators: () => [
            check('data').optional(),
            check('data.lao').optional().isString()
        ]
    })
    get mirror(): RouteHandler {
        return this.routeConfig<any>('mirror', async (d: any, req: express.Request) => {
            return [200, req.body];
        });
    }
}

/**
 * @description Miscellaneous Router
 */
export const miscellaneousRouter = () => MiscellaneousRouteController.shared.router;

// -----------------------------------------------------------------------------------------------------------

