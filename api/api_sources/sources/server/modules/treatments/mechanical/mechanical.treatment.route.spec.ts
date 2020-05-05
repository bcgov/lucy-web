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
 * File: mechanical.treatment.route.spec.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 1:45:08 pm
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 1:59:47 pm
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import {
    should,
    expect
} from 'chai';
import * as request from 'supertest';
import { SharedExpressApp } from '../../../initializers';
import {
    verifySuccessBody,
    verifyErrorBody,
    commonTestSetupAction,
    commonTestTearDownAction,
    testRequest,
    AuthType,
    HttpMethodType
} from '../../../../test-helpers/testHelpers';
import {
    mechanicalTreatmentCreateSpecFactory,
    RequestFactory,
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment,
    observationFactory,
    Destroyer
} from '../../../../database/factory';
import {
    ObservationController,
    MechanicalTreatmentController,
    MechanicalTreatmentSpec,
    MechanicalTreatmentUpdateSpec
} from '../../../../database/models';
import { viewerToken } from '../../../../test-helpers/token';
import { MechanicalTreatmentSchema } from '../../../../database/database-schema';


describe('Test for mechanical treatment', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should create mechanical treatment for {admin}', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentSpec>(create, {
            schema: MechanicalTreatmentSchema.shared
        });
        const obs = await observationFactory();
        createReq.observations = [obs.observation_id];
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 201,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            // console.dir(resp.body);
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.mechanical_treatment_id);
                should().exist(data.speciesAgency);
                should().exist(data.mechanicalMethod);
                should().exist(data.mechanicalDisposalMethod);
                should().exist(data.soilDisturbance);
                should().exist(data.rootRemoval);
                should().exist(data.issue);
                should().exist(data.providerContractor);
                expect(data.observations.length).to.be.greaterThan(0);
                expect(data.speciesAgency.species_agency_code_id)
                .to.be.equal(create.speciesAgency.species_agency_code_id);
                expect(data.mechanicalMethod.mechanical_method_code_id)
                .to.be.equal(create.mechanicalMethod.mechanical_method_code_id);
                expect(data.mechanicalDisposalMethod.mechanical_disposal_method_code_id)
                .to.be.equal(create.mechanicalDisposalMethod.mechanical_disposal_method_code_id);
                expect(data.soilDisturbance.mechanical_soil_disturbance_code_id).to.be.equal(create.soilDisturbance.mechanical_soil_disturbance_code_id);
                expect(data.rootRemoval.mechanical_root_removal_code_id)
                .to.be.equal(create.rootRemoval.mechanical_root_removal_code_id);
                expect(data.issue.mechanical_treatment_issue_code_id)
                .to.be.equal(create.issue.mechanical_treatment_issue_code_id);
                expect(data.providerContractor.treatment_provider_contractor_id)
                .to.be.equal(create.providerContractor.treatment_provider_contractor_id);
                expect(data.date).to.be.equal(create.date);
                await MechanicalTreatmentController.shared.removeById(data.mechanical_treatment_id);
                await ObservationController.shared.remove(obs);
            });
        });
    });

    it('should create mechanical treatment for multiple observations', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentSpec>(create, {
            schema: MechanicalTreatmentSchema.shared
        });
        const obs1 = await observationFactory();
        const obs2 = await observationFactory();
        createReq.observations = [obs1.observation_id, obs2.observation_id];
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 201,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            // console.dir(resp.body);
            await verifySuccessBody(resp.body, async (data: any) => {
                expect(data.observations.length).to.be.equal(2);
                await MechanicalTreatmentController.shared.removeById(data.mechanical_treatment_id);
                await ObservationController.shared.remove(obs1);
                await ObservationController.shared.remove(obs2);
            });
        });
    });

    it('should not create mechanical treatment for {admin}: missing * fields', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentSpec>(create, {
            schema: MechanicalTreatmentSchema.shared
        });
        // Removing some required fields
        delete (createReq.longitude);
        delete (createReq.applicatorLastName);
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 422,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });

    it('should not create mechanical treatment for {viewer}', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentSpec>(create, {
            schema: MechanicalTreatmentSchema.shared
        });
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 401,
            auth: AuthType.viewer,
            send: createReq
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await Destroyer(MechanicalTreatmentController.shared)(create, true);
        });
    });

    it('should fetch mechanical treatments {all} for any user', async () => {
        const mt = await mechanicalTreatmentFactory();
        await testRequest(SharedExpressApp.app , {
            url: `/api/treatment/mechanical/`,
            type: HttpMethodType.get,
            expect: 200,
            auth: AuthType.viewer
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.length).to.be.greaterThan(0);
                /*const filtered = data.filter( (obj: any) => obj.mechanical_treatment_id === mt.mechanical_treatment_id);
                expect(filtered.length === 1).to.be.equal(true);*/
            });
            await destroyMechanicalTreatment(mt);
        });
    });

    it('should update mechanical treatment for {admin}', async () => {
        const mt = await mechanicalTreatmentFactory();
        const create = await mechanicalTreatmentCreateSpecFactory();
        delete create.applicatorLastName;
        delete create.speciesAgency;
        const updateReq = RequestFactory<MechanicalTreatmentUpdateSpec>(create, {
            schema: MechanicalTreatmentSchema.shared
        });
        await testRequest(SharedExpressApp.app , {
            url: `/api/treatment/mechanical/${mt.mechanical_treatment_id}`,
            type: HttpMethodType.put,
            expect: 200,
            auth: AuthType.admin,
            send: updateReq
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.mechanical_treatment_id);
                expect(data.mechanical_treatment_id).to.be.equal(mt.mechanical_treatment_id);
                expect(data.speciesAgency.species_agency_code_id).to.be.equal(mt.speciesAgency.species_agency_code_id);
                expect(data.mechanicalMethod.mechanical_method_code_id).to.be.equal(updateReq.mechanicalMethod);
                expect(data.date).to.be.equal(create.date);
            });
            await destroyMechanicalTreatment(mt);
        });
    });

    it('should fetch mechanical treatments {single} for any user', async () => {
        let mt: any;
        try {
            mt = await mechanicalTreatmentFactory();
        } catch (excp) {
            console.log(`${excp}`);
        }

        await request(SharedExpressApp.app)
            .get(`/api/treatment/mechanical/${mt.mechanical_treatment_id}`)
            .set('Authorization', `Bearer ${viewerToken()}`)
            .expect(200)
            .then(async (resp) => {
                await verifySuccessBody(resp.body, async data => {
                    expect(data.mechanical_treatment_id).to.be.equal(mt.mechanical_treatment_id);
                });
                await destroyMechanicalTreatment(mt);
            });
    });

    it('should fetch mechanical treatment resource config', async () => {
        await testRequest(SharedExpressApp.app, {
            url: `/api/treatment/mechanical/config`,
            type: HttpMethodType.get,
            expect: 200,
            auth: AuthType.viewer
        })
        .then(async (resp) => {
            verifySuccessBody(resp.body, async data => {
                should().exist(data.idKey);
                should().exist(data.layout);
                should().exist(data.meta);
                should().exist(data.fields);
                should().exist(data.schemaName);
                should().exist(data.modelName);
                should().exist(data.description);
            });
        });
    });
});

// -----------------------------------------------------------------
