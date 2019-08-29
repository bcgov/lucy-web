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
    Observation,
    MechanicalTreatmentSpec
} from '../../../../database/models';
import {
    observationFactory,
    destroyObservation,
    jurisdictionCodeFactory,
    speciesFactory,
    speciesDensityCodeFactory,
    speciesDistributionCodeFactory,
    speciesAgencyCodeFactory,
    observationTypeCodeFactory,
    soilTextureCodeFactory,
    observerGeometryCodeFactory,
    specificUseCodeFactory,
    slopeCodeFactory,
    aspectCodeFactory,
    proposedActionCodeFactory,
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment
} from '../../../../database/factory';

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
            await verifySuccessBody(body, async (data: any) => {
                should().exist(data.jurisdictionCodes);
                should().exist(data.speciesList);
                should().exist(data.speciesDensityCodes);
                should().exist(data.speciesDistributionCodes);
                should().exist(data.speciesAgencyCodes);
                should().exist(data.observationTypeCodes);
                should().exist(data.soilTextureCodes);
                should().exist(data.observationGeometryCodes);
                should().exist(data.specificUseCodes);
                should().exist(data.slopeCodes);
                should().exist(data.aspectCodes);
                should().exist(data.proposedActionCodes);
                should().exist(data.mechanicalTreatmentMethodsCodes);
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
        const obs = mt.observation;
        await testRequest(SharedExpressApp.app , {
            type: HttpMethodType.get,
            url: `/api/observation/${obs.observation_id}`,
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.observation_id).to.be.equal(obs.observation_id);
                expect(data.mechanicalTreatments.length).to.be.equal(1);
                // Check species prop of fetched obj
                const mt0: MechanicalTreatmentSpec = data.mechanicalTreatments[0];
                should().exist(mt0.species);
            });
            await destroyMechanicalTreatment(mt);
        });
    });

    it('should create observation', async () => {
        const jurisdictionCode = await jurisdictionCodeFactory(2);
        const species = await speciesFactory(2);
        const density = await speciesDensityCodeFactory();
        const distribution = await speciesDistributionCodeFactory();
        const agency = await speciesAgencyCodeFactory();
        const type = await observationTypeCodeFactory();
        const texture = await soilTextureCodeFactory();
        const geom = await observerGeometryCodeFactory();
        const specificCode = await specificUseCodeFactory();
        const slopeCode = await slopeCodeFactory();
        const aspectCode = await aspectCodeFactory();
        const proposedActionCode = await proposedActionCodeFactory();
        const create = {
            lat: 12.67,
            long: 18.97,
            date: '2019-06-05',
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            observerFirstName: 'Lao',
            observerLastName: 'Ballabh',
            edrrIndicator: true,
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            observationType: type.observation_type_code_id,
            speciesAgency: agency.species_agency_code_id,
            distribution: distribution.species_distribution_code_id,
            density: density.species_density_code_id,
            observationGeometry: geom.observation_geometry_code_id,
            specificUseCode: specificCode.specific_use_code_id,
            soilTexture: texture.soil_texture_code_id,
            slopeCode: slopeCode.observation_slope_code_id,
            aspectCode: aspectCode.observation_aspect_code_id,
            proposedAction: proposedActionCode.observation_proposed_action_code_id
        };
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
                should().exist(body.observationGeometry);
                should().exist(body.slopeCode);
                should().exist(body.aspectCode);
                should().exist(body.proposedAction);
                should().exist(body.edrrIndicator);
                expect(body.edrrIndicator).to.be.equal(true);
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
            lat: 35.78
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
            length: 6700.78,
            width: 900.00,
            accessDescription: 'Test description',
            researchIndicator: true,
            jurisdiction: jurisdictionCode.jurisdiction_code_id,
            species: species.species_id,
            rangeUnitNumber: 'A7890'
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
                expect(body.length).to.be.equal(update.length);
                expect(body.rangeUnitNumber).to.be.equal(update.rangeUnitNumber);
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
});

// -----------------------------------------------------------------------------------------------------------
