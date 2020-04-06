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
import { adminToken, viewerToken } from '../../../../test-helpers/token';
import { verifySuccessBody, verifyErrorBody, commonTestSetupAction, commonTestTearDownAction, testRequest, AuthType, HttpMethodType} from '../../../../test-helpers/testHelpers';
import {
    ObservationController,
    Observation
} from '../../../../database/models';
import {
    observationFactory,
    destroyObservation,
    jurisdictionCodeFactory,
    speciesFactory,
    /*speciesDensityCodeFactory,
    speciesDistributionCodeFactory,
    speciesAgencyCodeFactory,
    observationTypeCodeFactory,
    soilTextureCodeFactory,
    observerGeometryCodeFactory,
    specificUseCodeFactory,
    slopeCodeFactory,
    aspectCodeFactory,
    proposedActionCodeFactory,*/
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment,
    // ModelFactory,
    ModelSpecFactory,
    RequestFactory,
    ModelFactory,
    Destroyer
} from '../../../../database/factory';
import { ExpressResourceTest } from '../../../../test-helpers/expressTest';
import { ObservationSchema } from '../../../../database/database-schema';

describe('Test for observation routes', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
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
        .set('Authorization', `Bearer ${viewerToken()}`)
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                const results = body as Observation[];
                expect(results.length).to.be.greaterThan(0);
                const filtered = results.filter( obj => obj.observation_id === obs.observation_id);
                expect(filtered.length > 0).to.be.equal(true);
            });
            await destroyObservation(obs);
        });
    });

    it('should return observations with parameter', async () => {
        const obs = await observationFactory();
        const obs1 = await observationFactory();
        await request(SharedExpressApp.app)
        .get('/api/observation')
        .set('Authorization', `Bearer ${viewerToken()}`)
        .query({ observerFirstName: obs.observerFirstName, observerLastName: obs.observerLastName})
        .expect(200)
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                const results = body as Observation[];
                expect(results.length).to.be.equal(1);
                const filtered = results.filter( obj => obj.observation_id === obs.observation_id);
                expect(filtered.length > 0).to.be.equal(true);
            });
            await destroyObservation(obs);
            await destroyObservation(obs1);
        });
    });

    it('should return observation with {id}', async () => {
        const obs = await observationFactory();
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.get,
            url: `/api/observation/${obs.observation_id}`,
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.observation_id).to.be.equal(obs.observation_id);
            });
            await destroyObservation(obs);
        });
    });

    it('should return observation with {id} and MechanicalTreatment', async () => {
        const mt = await mechanicalTreatmentFactory();
        const obs = mt.observations[0];
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.get,
            url: `/api/observation/${obs.observation_id}`,
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.observation_id).to.be.equal(obs.observation_id);
                expect(data.mechanicalTreatments.length).to.be.equal(1);
            });
            await destroyMechanicalTreatment(mt);
        });
    });

    it('should create observation', async () => {
        const spec = await ModelSpecFactory(ObservationController.shared)();
        const create = RequestFactory<any>(spec, {
            schema: ObservationSchema.shared
        });
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.post,
            url: '/api/observation',
            expect: 201,
            auth: AuthType.admin,
            send: create
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.observation_id);
                should().exist(body.species);
                should().exist(body.jurisdiction);
                should().exist(body.density);
                should().exist(body.distribution);
                should().exist(body.speciesAgency);
                should().exist(body.observationType);
                should().exist(body.soilTexture);
                should().exist(body.specificUseCode);
                should().exist(body.slopeCode);
                should().exist(body.aspectCode);
                should().exist(body.proposedAction);
                should().exist(body.edrrIndicator);
                expect(body.date).to.be.equal(create.date);
                expect(body.edrrIndicator).to.be.equal(create.edrrIndicator);
                expect(body.length).to.be.equal(create.length);
                await ObservationController.shared.removeById(body.observation_id);
            });
        });
    });

    it('should not create observation for viewer', async () => {
        const create = {};
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.post,
            url: '/api/observation',
            expect: 401,
            auth: AuthType.viewer,
            send: create
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });


    it('should not update observation with {id} for viewer', async () => {
        const obs = await observationFactory();
        const update = {
            accessDescription: 'Long distance'
        };
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.put,
            url: `/api/observation/${obs.observation_id}`,
            expect: 401,
            auth: AuthType.viewer,
            send: update
        }).then(async resp => {
            await verifyErrorBody(resp.body);
            await destroyObservation(obs);
        });
    });


    it('should update observation with {id}', async () => {
        const obsSpecies = await observationFactory();
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const update = {
            accessDescription: 'Test description',
            researchIndicator: true,
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            rangeUnitNumber: 'A7890',
            date: '2019-05-09'
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/observation/${obsSpecies.observation_id}`,
            expect: 200,
            auth: AuthType.admin,
            send: update
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (body) => {
                should().exist(body.observation_id);
                should().exist(body.species);
                should().exist(body.jurisdiction);
                should().exist(body.researchIndicator);
                should().exist(body.rangeUnitNumber);
                expect(body.researchIndicator).to.be.equal(true);
                expect(body.rangeUnitNumber).to.be.equal(update.rangeUnitNumber);
                expect(body.date).to.be.equal(update.date);
            });
            await destroyObservation(obsSpecies);
        });
    });

    it('should not update observation-species with {id} for viewer', async () => {
        const obsSpecies = await observationFactory();
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const update = {
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/observation/${obsSpecies.observation_id}`,
            expect: 401,
            auth: AuthType.viewer,
            send: update
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await destroyObservation(obsSpecies);
        });
    });

    it('should not update observation with {id}', async () => {
        const obsSpecies = await observationFactory();
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const update = {
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            researchIndicator: true,
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            rangeUnitNumber: '$y790'
        };
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.put,
            url: `/api/observation/${obsSpecies.observation_id}`,
            expect: 422,
            auth: AuthType.admin,
            send: update
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await destroyObservation(obsSpecies);
        });
    });

    it('should filter by observer name and location', async () => {
        await ExpressResourceTest.testGetFilteredItem(SharedExpressApp.app, { auth: AuthType.viewer, expect: 200}, ObservationController.shared, {
            observerFirstName: 'Laba',
            observerLastName: 'Ballabh'
        });
    });

    it('should filter by keyword that matches observer name/id/species/jurisdiction/agency', async () => {
        const obs = await ModelFactory(ObservationController.shared)();
        should().exist(obs);
        const firstName: string = obs.observerFirstName;

        const keyword = firstName.substring(1, firstName.length);
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: `/api/observation/search?keyword=${keyword}`,
            expect: 200,
            auth: AuthType.admin
        }).then(async (resp) => {
            await verifySuccessBody(resp.body, async (data) => {
                expect(data.length).to.be.greaterThan(0);
                const observation = data[0];
                should().exist(observation.observation_id);
                should().exist(observation.species);
                should().exist(observation.jurisdiction);
                should().exist(observation.speciesAgency);
                should().exist(observation.spaceGeom);
                should().exist(observation.density);
                should().exist(observation.distribution);
                should().exist(observation.observationType);
                should().exist(observation.soilTexture);
                should().exist(observation.specificUseCode);
                should().exist(observation.slopeCode);
                should().exist(observation.aspectCode);
                should().exist(observation.proposedAction);
                const filtered = data.filter( (item: any) => item.observerFirstName === firstName);
                expect(filtered.length).to.be.greaterThan(0);
                await Destroyer(ObservationController.shared)(obs);
            });
        });
    });

    it(`should export all the observations`, async () => {
        const observation = await ModelFactory(ObservationController.shared)();
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/observation/export',
            expect: 200,
            auth: AuthType.inspectAdmin
        }).then(async resp => {
            await verifySuccessBody(resp.body);
            await Destroyer(ObservationController.shared)(observation);
        });
    });
});

// -----------------------------------------------------------------------------------------------------------
