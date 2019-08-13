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
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Monday, 12th August 2019 1:59:47 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * Imports
 */
import {
    should,
    expect
} from 'chai';
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
    RequestFactory
} from '../../../../database/factory';
import {
    ObservationController,
    MechanicalTreatmentController,
    MechanicalTreatmentCreateSpec
} from '../../../../database/models';

describe('Test for mechanical treatment', () => {
    before(async () => {
        await SharedExpressApp.initExpress();
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should create mechanical treatment for {admin}', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentCreateSpec>(create);
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 200,
            auth: AuthType.admin,
            send: createReq
        })
        .then(async (resp) => {
            await verifySuccessBody(resp.body, async (data: any) => {
                // console.dir(data);
                should().exist(data.mechanical_treatment_id);
                expect(data.observation.observation_id).to.be.equal(create.observation.observation_id);
                await MechanicalTreatmentController.shared.removeById(data.mechanical_treatment_id);
            });
            await ObservationController.shared.remove(create.observation);
        });
    });

    it('should not create mechanical treatment for {admin}: missing * fields', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        const createReq = RequestFactory<MechanicalTreatmentCreateSpec>(create);
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
            await ObservationController.shared.remove(create.observation);
        });
    });

    it('should not create mechanical treatment for {viewer}', async () => {
        const create = await mechanicalTreatmentCreateSpecFactory();
        await testRequest(SharedExpressApp.app , {
            url: '/api/treatment/mechanical/',
            type: HttpMethodType.post,
            expect: 401,
            auth: AuthType.viewer,
            send: create
        })
        .then(async (resp) => {
            await verifyErrorBody(resp.body);
            await ObservationController.shared.remove(create.observation);
        });
    });
});

// -----------------------------------------------------------------
