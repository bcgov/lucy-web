//
// Observation routes test
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
// Created by Pushan Mitra on 2019-07-08.
/**
 * Imports
 */
import * as request from 'supertest';
import { should, expect } from 'chai';
import { SharedExpressApp } from '../../../initializers';
import { adminToken } from '../../../../test-helpers/token';
import { verifySuccessBody, verifyErrorBody, commonTestSetupAction, commonTestTearDownAction} from '../../../../test-helpers/testHelpers';
import { ObservationCreateModel, ObservationSpeciesCreateModel } from '../../../../database/models';

describe('Test for observation routes', () => {
    before(async () => {
        await SharedExpressApp.initExpress();
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should return codes', async () => {
        await request(SharedExpressApp.app)
        .get('/api/observation/codes')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            const body = resp.body;
            await verifySuccessBody(body, (data: any) => {
                should().exist(data.jurisdictionCodes);
                should().exist(data.speciesList);
            });
            // done();
        });
    });

    it('should return 401', async () => {
        await request(SharedExpressApp.app)
        .get('/api/observation/codes')
        .expect(401)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            // done();
        });
    });

    it('should create observation', async () => {
        const create: ObservationCreateModel = {
            lat: 76.98,
            long: 67.76,
            date: '2019-05-01'
        };
        await request(SharedExpressApp.app)
        .post('/api/observation')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(create)
        .expect(201)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.observation_id);
                expect(body.lat).to.be.equal(create.lat);
            });
            // done();
        });
    });

    it('should not create observation', async () => {
        const create = {
        };
        await request(SharedExpressApp.app)
        .post('/api/observation')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(create)
        .expect(422)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            // done();
        });
    });
});

// -----------------------------------------------------------------------------------------------------------
