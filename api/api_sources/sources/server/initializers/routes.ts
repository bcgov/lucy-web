//
// Main express route configuration class
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
/**
 * Imports
 */
import { Application} from 'express';
import { accountRoute, requestAccessRoutes} from '../modules';
import { defaultRoute} from '../modules';

/**
 * @description Configuring main app routes
 * @param express.Application app
 */
export const routes = (app: Application) => {
    // Add account
    app.use('/api/v1/account', accountRoute());

    // Request Access routes
    app.use('/api/v1/request-access', requestAccessRoutes());

    // Default Route
    app.use('*', defaultRoute());
};
// -----------------------------------------------------------------------------------------------------------

