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
import { verifySuccessBody, verifyErrorBody, commonTestSetupAction, commonTestTearDownAction, testRequest, AuthType, HttpMethodType} from '../../../../test-helpers/testHelpers';
import { ObservationCreateModel, ObservationController, Observation, ObservationSpeciesController } from '../../../../database/models';
import { observationFactory, destroyObservation, jurisdictionCodeFactory, speciesFactory, observationSpeciesFactory } from '../../../../database/factory';

describe('Test for observation routes', () => {
    before(async () => {
        await SharedExpressApp.initExpress();
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should return codes', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/observation/codes',
            expect: 200,
            auth: AuthType.admin
        })
        .then(async (resp: any) => {
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

                // Remove
                ObservationController.shared.removeById(body.observation_id);
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

    it('should return all observations', async () => {
        const obs = await observationFactory();
        await request(SharedExpressApp.app)
        .get('/api/observation')
        .set('Authorization', `Bearer ${adminToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, (body) => {
                const results = body as Observation[];
                expect(results.length).to.be.greaterThan(0);
                const filtered = results.filter( obj => obj.observation_id === obs.observation_id);
                expect(filtered.length > 0).to.be.equal(true);
            });
            await destroyObservation(obs);
        });
    });

    it('should return observation with {id}', async () => {
        const obs = await observationFactory();
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.get,
            url: `/api/observation/${obs.observation_id}`,
            expect: 200,
            auth: AuthType.admin
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.observation_id).to.be.equal(obs.observation_id);
            });
            await destroyObservation(obs);
        });
    });

    it('should create observation-species', async () => {
        const obs = await observationFactory();
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const create = {
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            observation: obs.observation_id
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.post,
            url: '/api/observation/species',
            expect: 201,
            auth: AuthType.admin,
            send: create
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.observation_species_id);
                should().exist(body.species);
                should().exist(body.jurisdiction);
                should().exist(body.observation);
                expect(body.length).to.be.equal(create.length);
                await ObservationSpeciesController.shared.removeById(body.observation_species_id);
            });
            await destroyObservation(obs);
        });
    });

    it('should update observation with {id}', async () => {
        const obs = await observationFactory();
        const update = {
            lat: 35.78
        };
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.put,
            url: `/api/observation/${obs.observation_id}`,
            expect: 200,
            auth: AuthType.admin,
            send: update
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.observation_id).to.be.equal(obs.observation_id);
                expect(data.lat).to.be.equal(update.lat);
            });
            await destroyObservation(obs);
        });
    });

    it('should not update observation with {id}', async () => {
        const obs = await observationFactory();
        const update = {
            lat: 'laba'
        };
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.put,
            url: `/api/observation/${obs.observation_id}`,
            expect: 422,
            auth: AuthType.admin,
            send: update
        }).then(async resp => {
            await verifyErrorBody(resp.body);
            await destroyObservation(obs);
        });
    });

    it('should update observation-species', async () => {
        const obsSpecies = await observationSpeciesFactory();
        const obs = await observationFactory();
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const update = {
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            observation: obs.observation_id
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/observation/species/${obsSpecies.observation_species_id}`,
            expect: 200,
            auth: AuthType.admin,
            send: update
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.observation_species_id);
                should().exist(body.species);
                should().exist(body.jurisdiction);
                should().exist(body.observation);
                expect(body.length).to.be.equal(update.length);
                await ObservationSpeciesController.shared.removeById(body.observation_species_id);
            });
            await destroyObservation(obs);
        });
    });
});

// -----------------------------------------------------------------------------------------------------------
