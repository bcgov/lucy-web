// /*
//  * Copyright © 2019 Province of British Columbia
//  * Licensed under the Apache License, Version 2.0 (the "License")
//  * You may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  * **
//  * http://www.apache.org/licenses/LICENSE-2.0
//  * **
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  * File: mechanical.monitor.route.spec.ts
//  * Project: lucy
//  * File Created: Tuesday, 21st January 2020 11:54:16 am
//  * Author: Williams, Andrea IIT (you@you.you)
//  * -----
//  * Last Modified: Tuesday, 21st January 2020 2:14:04 pm
//  * Modified By: Williams, Andrea IIT (you@you.you>)
//  * -----
//  */


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
    mechanicalMonitorCreateSpecFactory,
    RequestFactory,
    mechanicalMonitorFactory,
    destroyMechanicalMonitor,
    Destroyer,
    // mechanicalTreatmentFactory
} from '../../../../database/factory';
import {
    // MechanicalTreatmentController,
    MechanicalMonitorController,
    MechanicalMonitorSpec,
    MechanicalMonitorUpdateSpec,
    // MechanicalTreatment
} from '../../../../database/models';
import { viewerToken } from '../../../../test-helpers/token';
import { MechanicalMonitorSchema } from '../../../../database/database-schema';

describe('Test for mechanical monitoring', () => {
    // let mechTreatment: MechanicalTreatment;

    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
        // mechTreatment = await mechanicalTreatmentFactory();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should create mechanical monitoring  for {admin}', async () => {
        const create = await mechanicalMonitorCreateSpecFactory();
        const createReq = RequestFactory<MechanicalMonitorSpec>(create, {
            schema: MechanicalMonitorSchema.shared
        });
        await testRequest(SharedExpressApp.app , {
            url: '/api/monitor/mechanical/',
            type: HttpMethodType.post,
            expect: 201,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            // console.dir(resp.body);
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.mechanical_monitor_id);
                should().exist(data.efficacy);
                should().exist(data.observerFirstName);
                should().exist(data.observerLastName);
                should().exist(data.timestamp);
                should().exist(data.paperFileID);
                should().exist(data.speciesAgency);
                should().exist(data.mechanicalTreatmentID);

                expect(data.efficacy.efficacy_code_id).to.be.equal(create.efficacy.efficacy_code_id);
                expect(data.observerFirstName).to.be.equal(create.observerFirstName);
                expect(data.observerLastName).to.be.equal(create.observerLastName);
                expect(data.timestamp).to.be.equal(create.timestamp);
                expect(data.paperFileID).to.be.equal(create.paperFileID);
                expect(data.speciesAgency.species_agency_code_id)
                .to.be.equal(create.speciesAgency.species_agency_code_id);
                expect(data.mechanicalTreatmentID.mechanical_treatment_id).to.be.equal(create.mechanicalTreatmentID.mechanical_treatment_id);

                await MechanicalMonitorController.shared.removeById(data.mechanical_monitor_id);
                // await MechanicalTreatmentController.shared.remove(mechTreatment);
            });
        });
    });

    it('should not create mechanical monitor for {admin}: missing * fields', async () => {
        const create = await mechanicalMonitorCreateSpecFactory();
        const createReq = RequestFactory<MechanicalMonitorSpec>(create, {
            schema: MechanicalMonitorSchema.shared
        });
        // Removing some required fields
        delete (createReq.applicatorLastName);
        delete (createReq.efficacy);
        await testRequest(SharedExpressApp.app , {
            url: '/api/monitor/mechanical/',
            type: HttpMethodType.post,
            expect: 422,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
        });
    });

    it('should not create mechanical monitor for {viewer}', async () => {
        const create = await mechanicalMonitorCreateSpecFactory();
        const createReq = RequestFactory<MechanicalMonitorSpec>(create, {
            schema: MechanicalMonitorSchema.shared
        });
        await testRequest(SharedExpressApp.app , {
            url: '/api/monitor/mechanical/',
            type: HttpMethodType.post,
            expect: 401,
            auth: AuthType.viewer,
            send: createReq
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await Destroyer(MechanicalMonitorController.shared)(create, true);
        });
    });

    it('should fetch mechanical monitoring records {all} for any user', async () => {
        const monitorRecord = await mechanicalMonitorFactory();
        await testRequest(SharedExpressApp.app , {
            url: `/api/monitor/mechanical/`,
            type: HttpMethodType.get,
            expect: 200,
            auth: AuthType.viewer
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async data => {
                expect(data.length).to.be.greaterThan(0);
            });
            await destroyMechanicalMonitor(monitorRecord);
        });
    });

    it('should update mechanical monitoring record for {admin}', async () => {
        const monitorRecord = await mechanicalMonitorFactory();
        const updateReq = RequestFactory<MechanicalMonitorUpdateSpec>(monitorRecord, {
            schema: MechanicalMonitorSchema.shared
        });
        await testRequest(SharedExpressApp.app , {
            url: `/api/monitor/mechanical/${monitorRecord.mechanical_monitor_id}`,
            type: HttpMethodType.put,
            expect: 200,
            auth: AuthType.admin,
            send: updateReq
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.mechanical_monitor_id);
                expect(data.mechanical_monitor_id).to.be.equal(monitorRecord.mechanical_monitor_id);
                expect(data.mechanicalTreatmentID.mechanical_treatment_id).to.be.equal(monitorRecord.mechanicalTreatmentID.mechanical_treatment_id);
                expect(data.speciesAgency.species_agency_code_id).to.be.equal(updateReq.speciesAgency);
                expect(data.timestamp).to.be.equal(monitorRecord.timestamp);
            });
            await destroyMechanicalMonitor(monitorRecord);
        });
    });

    it('should fetch mechanical monitoring record {single} for any user', async () => {
        let monitorRecord: any;
        try {
            monitorRecord = await mechanicalMonitorFactory();
        } catch (excp) {
            console.log(`${excp}`);
        }

        await request(SharedExpressApp.app)
            .get(`/api/monitor/mechanical/${monitorRecord.mechanical_monitor_id}`)
            .set('Authorization', `Bearer ${viewerToken()}`)
            .expect(200)
            .then(async (resp) => {
                await verifySuccessBody(resp.body, async data => {
                    expect(data.mechanical_monitor_id).to.be.equal(monitorRecord.mechanical_monitor_id);
                });
                await destroyMechanicalMonitor(monitorRecord);
            });
    });

    it('should fetch mechanical monitor resource config', async () => {
        await testRequest(SharedExpressApp.app, {
            url: `/api/monitor/mechanical/config`,
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
