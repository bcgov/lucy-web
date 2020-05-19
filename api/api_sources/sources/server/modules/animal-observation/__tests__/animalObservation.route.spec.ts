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
// Created by Raj Manivannan on 2020-05-15.
/**
 * Imports
 */
import * as request from 'supertest';
import { should, expect } from 'chai';
import { SharedExpressApp } from '../../../initializers';
import { adminToken, viewerToken } from '../../../../test-helpers/token';
import { verifySuccessBody, verifyErrorBody, commonTestSetupAction, commonTestTearDownAction, testRequest, AuthType, HttpMethodType} from '../../../../test-helpers/testHelpers';
import {
    AnimalObservation,
    AnimalObservationController
} from '../../../../database/models';
import {
    animalObservationFactory,
    destroyAnimalObservation,
    lifeStageCodeFactory,
    behaviourCodeFactory,
    ModelSpecFactory,
    RequestFactory,
    ModelFactory,
} from '../../../../database/factory';
import { AnimalObservationSchema } from '../../../../database/database-schema';

describe('Test for animal observation routes', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should not create animal observation', async () => {
        const create = {};
        await request(SharedExpressApp.app)
        .post('/api/animal-observation')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send(create)
        .expect(422)
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });

    it('should return all observations', async () => {
        const obs = await animalObservationFactory();
        await request(SharedExpressApp.app)
        .get('/api/animal-observation')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                const results = body as AnimalObservation[];
                expect(results.length).to.be.greaterThan(0);
                const filtered = results.filter( obj => obj.animal_observation_id === obs.animal_observation_id);
                expect(filtered.length > 0).to.be.equal(true);
            });
            await destroyAnimalObservation(obs);
        });
    });

    it('should return observations with parameter', async () => {
        const obs = await animalObservationFactory();
        const obs1 = await animalObservationFactory();
        await request(SharedExpressApp.app)
        .get('/api/animal-observation')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .query({ observerFirstName: obs.observerFirstName, observerLastName: obs.observerLastName})
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                const results = body as AnimalObservation[];
                expect(results.length).to.be.equal(1);
                const filtered = results.filter( obj => obj.animal_observation_id === obs.animal_observation_id);
                expect(filtered.length > 0).to.be.equal(true);
            });
            await destroyAnimalObservation(obs);
            await destroyAnimalObservation(obs1);
        });
    });

    it('should return observation with {id}', async () => {
        const obs = await animalObservationFactory();
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.get,
            url: `/api/animal-observation/${obs.animal_observation_id}`,
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.animal_observation_id).to.be.equal(obs.animal_observation_id);
            });
            await destroyAnimalObservation(obs);
        });
    });

    it('should create observation', async () => {
        const spec = await ModelSpecFactory(AnimalObservationController.shared)();
        const create: AnimalObservation = RequestFactory<any>(spec, {
            schema: AnimalObservationSchema.shared
        });
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.post,
            url: '/api/animal-observation',
            expect: 201,
            auth: AuthType.admin,
            send: create
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.animal_observation_id);
                should().exist(body.species);
                should().exist(body.lifeStage);
                should().exist(body.behaviour);
                should().exist(body.speciesAgency);
                expect(body.timestamp).to.be.equal(create.timestamp);
                expect(body.comments).to.be.equal(create.comments);
                expect(body.observerFirstName).to.be.equal(create.observerFirstName);
                expect(body.observerLastName).to.be.equal(create.observerLastName);
                expect(body.specimenAvailableIndicator).to.be.equal(create.specimenAvailableIndicator);
                await AnimalObservationController.shared.removeById(body.animal_observation_id);
            });
        });
    });

    it('should not create observation for viewer', async () => {
        const create = {};
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.post,
            url: '/api/animal-observation',
            expect: 401,
            auth: AuthType.viewer,
            send: create
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });


    it('should not update observation with {id} for viewer', async () => {
        const obs = await animalObservationFactory();
        const update = {
            comments: 'Long distance'
        };
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.put,
            url: `/api/animal-observation/${obs.animal_observation_id}`,
            expect: 401,
            auth: AuthType.viewer,
            send: update
        }).then(async resp => {
            await verifyErrorBody(resp.body);
            await destroyAnimalObservation(obs);
        });
    });


    it('should update observation with {id}', async () => {
        const obs = await animalObservationFactory();
        const lifeStageCode = await lifeStageCodeFactory(2);
        const behaviourCode = await behaviourCodeFactory(2);
        const update = {
            lifeStage: lifeStageCode.life_stage_code_id,
            behaviour: behaviourCode.behaviour_code_id,
            specimenAvailableIndicator: false
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/animal-observation/${obs.animal_observation_id}`,
            expect: 200,
            auth: AuthType.admin,
            send: update
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body: AnimalObservation) => {
                should().exist(body.animal_observation_id);
                should().exist(body.species);
                should().exist(body.lifeStage);
                should().exist(body.behaviour);
                expect(body.specimenAvailableIndicator).to.be.equal(false);
            });
            await destroyAnimalObservation(obs);
        });
    });

    it('should not update observation with {id} for viewer', async () => {
        const obs = await animalObservationFactory();
        const lifeStageCode = await lifeStageCodeFactory(2);
        const behaviourCode = await behaviourCodeFactory(2);
        const update = {
            lifeStage: lifeStageCode.life_stage_code_id,
            behaviour: behaviourCode.behaviour_code_id,
            specimenAvailableIndicator: false
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/animal-observation/${obs.animal_observation_id}`,
            expect: 401,
            auth: AuthType.viewer,
            send: update
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await destroyAnimalObservation(obs);
        });
    });

    it('should not update observation with {id}', async () => {
        const obs = await animalObservationFactory();
        const update = {
            comments: 'Test comments',
            specimenAvailableIndicator: true,
            timestamp: 'test'
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/animal-observation/${obs.animal_observation_id}`,
            expect: 422,
            auth: AuthType.admin,
            send: update
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await destroyAnimalObservation(obs);
        });
    });

    it('should filter by keyword that matches observer name/id/species/lifeStage/agency/behaviour', async () => {
        const obs = await ModelFactory(AnimalObservationController.shared)();
        should().exist(obs);
        const firstName: string = obs.observerFirstName;

        const keyword = firstName.substring(1, firstName.length);
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: `/api/animal-observation/search?keyword=${keyword}`,
            expect: 200,
            auth: AuthType.admin
        }).then(async (resp) => {
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.length).to.be.greaterThan(0);
                const observation = data[0] as AnimalObservation;
                should().exist(observation.animal_observation_id);
                should().exist(observation.species);
                should().exist(observation.lifeStage);
                should().exist(observation.behaviour);
                should().exist(observation.species);
                should().exist(observation.speciesAgency);
                should().exist(observation.spaceGeom);
                const filtered = data.filter( (item: any) => item.observerFirstName === firstName);
                expect(filtered.length).to.be.greaterThan(0);
                await destroyAnimalObservation(obs);
            });
        });
    });

    it(`should export all the observations`, async () => {
        const observation = await ModelFactory(AnimalObservationController.shared)();
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/animal-observation/export',
            expect: 200,
            auth: AuthType.inspectAdmin
        }).then(async resp => {
            await verifySuccessBody(resp.body);
            await destroyAnimalObservation(observation);
        });
    });
});

// -----------------------------------------------------------------------------------------------------------
