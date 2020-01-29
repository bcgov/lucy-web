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
 * File: location.route.spec.ts
 * Project: lucy
 * File Created: Monday, 16th December 2019 10:19:10 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Monday, 16th December 2019 10:50:57 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
/**
 * Tests for location  route
 */
import { should } from 'chai';
import { SharedExpressApp } from '../../initializers';
import {
    verifySuccessBody,
    commonTestSetupAction,
    commonTestTearDownAction,
    testRequest,
    HttpMethodType,
    AuthType,
    verifyErrorBody
} from '../../../test-helpers/testHelpers';

describe.skip('Test for location route', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should return well data', async () => {
        const query: any = {
            latitude: 48.424578999999994,
            longitude: -123.36466990000001
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/location/gwells-data',
            auth: AuthType.viewer,
            expect: 200
        }).query(query).then(resp => {
            verifySuccessBody(resp.body, async (r: any) => {
                should().exist(r);
                should().exist(r.id);
                should().exist(r.geometry);
                should().exist(r.properties);
                should().exist(r.properties.distance);
            });
        });
    });

    it('should not return well data - no lat', async () => {
        const query: any = {
            longitude: -123.36466990000001
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/location/gwells-data',
            expect: 422,
            auth: AuthType.viewer,
        }).query(query).then(resp => {
            verifyErrorBody(resp.body);
        });
    });

    it('should not return well data - no lon', async () => {
        const query: any = {
            latitude: 48.424578999999994
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/location/gwells-data',
            expect: 422,
            auth: AuthType.viewer,
        }).query(query).then(resp => {
            verifyErrorBody(resp.body);
        });
    });

    it('should not return well data - {wrong lat/lon}', async () => {
        const query: any = {
            latitude: 'lao',
            longitude: 'gas'
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/location/gwells-data',
            expect: 422,
            auth: AuthType.viewer,
        }).query(query).then(resp => {
            verifyErrorBody(resp.body);
        });
    });

    it('should not return well data for unauthorized user', async () => {
        const query: any = {
            latitude: 48.424578999999994,
            longitude: -123.36466990000001
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/location/gwells-data',
            expect: 401
        }).query(query).then(resp => {
            verifyErrorBody(resp.body);
        });
    });
});

// ---------
