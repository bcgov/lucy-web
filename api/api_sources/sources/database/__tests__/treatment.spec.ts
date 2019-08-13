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
 * File: treatment.spec.ts
 * Project: lucy
 * File Created: Monday, 12th August 2019 11:05:15 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 12th August 2019 11:05:23 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import {
    mechanicalTreatmentFactory,
    destroyMechanicalTreatment,
    mechanicalTreatmentCreateSpecFactory,
    userFactory, mechanicalTreatmentUpdateSpecFactory,
    destroyObservation
} from '../factory';
import { MechanicalTreatmentController, MechanicalTreatment, User, UserDataController, MechanicalTreatmentUpdateSpec, ObservationController, Observation } from '../models';
import { Destroy } from '../factory/helper';

describe('Treatment Test', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    // Test1: Create Treatment fro factory
    it('should create treatment from factory', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const mt: MechanicalTreatment = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        expect(mt.observation.observation_id).to.be.equal(f.observation.observation_id);
        await destroyMechanicalTreatment(mt);
    });

    // Test2: Create Treatment with specification
    it('should create treatment with spec', async () => {
        const f = await mechanicalTreatmentCreateSpecFactory();
        const user = await userFactory();
        const obj = await MechanicalTreatmentController.shared.createNew(f, user);
        const mt = await MechanicalTreatmentController.shared.findById(obj.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        expect(mt.observation.observation_id).to.be.equal(f.observation.observation_id);
        await destroyMechanicalTreatment(mt);
    });

    // Test2: Create Treatment with specification
    it('should update treatment with spec', async () => {
        const f = await mechanicalTreatmentFactory();
        const user = await userFactory();
        const spec: MechanicalTreatmentUpdateSpec = await mechanicalTreatmentUpdateSpecFactory();
        await MechanicalTreatmentController.shared.update(f, spec, user);
        const mt = await MechanicalTreatmentController.shared.findById(f.mechanical_treatment_id);
        should().exist(mt);
        should().exist(mt.observation);
        const updateObs = spec.observation || {observation_id: 0};
        expect(mt.observation.observation_id).to.be.equal(updateObs.observation_id);
        await destroyMechanicalTreatment(mt);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
        await destroyObservation(f.observation);
    });

    // Test3: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation with promise', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observation;
        should().exist(obs);
        let list: MechanicalTreatment[] = await obs.getMechanicalTreatments;
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
    });

    // Test3: Fetch Mechanical Treatments of observation
    it('should fetch MechanicalTreatment for observation through prop', async () => {
        const f = await mechanicalTreatmentFactory();
        should().exist(f);
        const obs = f.observation;
        const fetchObs: Observation = await ObservationController.shared.findById(obs.observation_id);
        should().exist(fetchObs);
        let list: MechanicalTreatment[] = fetchObs.mechanicalTreatments || [];
        list = list.filter( t => t.mechanical_treatment_id === f.mechanical_treatment_id);
        expect(list.length).to.be.equal(1);
    });

});

// ----------------------------------------------------------------------------------------

