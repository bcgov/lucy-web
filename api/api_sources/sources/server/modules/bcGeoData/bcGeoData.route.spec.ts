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
 * File: bcGeoData.route.spec.ts
 * Project: lucy
 * File Created: Wednesday, 29th April 2020 11:05:09 am
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Wednesday, 29th April 2020 11:37:46 am
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */


/**
 * Imports
 */
import * as request from 'supertest';
import { expect } from 'chai';
import { SharedExpressApp } from '../../initializers';
import { viewerToken } from '../../../test-helpers/token';
import { commonTestSetupAction, commonTestTearDownAction, verifySuccessBody } from '../../../test-helpers/testHelpers';

// TODO: remove skip once openmaps.gov.bc.ca is back up and running properly
describe.skip('Test for bcGeoData routes', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should fetch regional districts', async () => {
        await request(SharedExpressApp.app)
        .get('/api/bcgeodata/regional-districts')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.features.length).to.be.greaterThan(1);
            });
        });
    });

    it('should fetch municipalities', async () => {
        await request(SharedExpressApp.app)
        .get('/api/bcgeodata/municipalities')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.features.length).to.be.greaterThan(1);
            });
        });
    });

    it('should fetch wells with bbox parameter', async () => {
        await request(SharedExpressApp.app)
        .get('/api/bcgeodata/wells')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .query({ bbox: '-122.1513605117798,52.2787137464523,-122.14916110038759,52.27964912463074'})
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                expect(body.features.length).to.be.greaterThan(0);
                expect(body.features.length).to.be.lessThan(100);
            });
        });
    });

});
