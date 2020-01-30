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
 * File: mechanicalMonitor.spec.ts
 * Project: lucy
 * File Created: Friday, 24th January 2020 2:56:14 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Friday, 24th January 2020 2:56:37 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import { expect, should } from 'chai';
import {
    commonTestSetupAction,
    commonTestTearDownAction,
    // testModel,
} from '../../test-helpers/testHelpers';
import {    ModelFactory,
    // Destroyer,
    // ModelSpecFactory,
    userFactory,
    // mechanicalMonitorUpdateSpecFactory,
    // mechanicalMonitorFactory,
    mechanicalMonitorCreateSpecFactory,
    destroyMechanicalMonitor,
    // Destroy,
} from '../factory';
// import {
//     MechanicalMonitorSchema,
//     MechanicalTreatmentSchema,
//     EfficacyCodeSchema,
//     SpeciesAgencyCodeSchema,
// } from '../database-schema';
// import * as faker from 'faker';
import { MechanicalMonitorController } from '../models';

describe('Test Mechanical Monitoring', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create mechanical monitor from factory', async () => {
        const f = await ModelFactory(MechanicalMonitorController.shared)();
        should().exist(f);
        const mm = await MechanicalMonitorController.shared.findById(f.mechanical_monitor_id);
        should().exist(mm.efficacy);
        should().exist(mm.mechanicalTreatmentID);
        should().exist(mm.paperFileID);
        should().exist(mm.speciesAgency);
        should().exist(mm.timestamp);

        expect(f.efficacy).to.be.equal(mm.efficacy);
        expect(f.mechanicalTreatmentID).to.be.equal(mm.mechanicalTreatmentID);
        expect(f.paperFileID).to.be.equal(mm.paperFileID);
        expect(f.speciesAgency).to.be.equal(mm.speciesAgency);
        expect(f.timestamp).to.be.equal(mm.timestamp);
        if (f.comments) {
            expect(f.comments).to.be.equal(mm.comments);
        }

        await destroyMechanicalMonitor(f);
    });

    it('should create mechanical monitor with spec', async () => {
        const f = await mechanicalMonitorCreateSpecFactory();
        const user = await userFactory();
        const obj = await MechanicalMonitorController.shared.createNewObject(f, user);
        const mm = await MechanicalMonitorController.shared.findById(obj.mechanical_monitor_id);
        should().exist(mm);
        should().exist(mm.mechanicalTreatmentID);
        should().exist(mm.timestamp);

        expect(obj.timestamp).to.be.equal(mm.timestamp);
        expect(obj.mechanicalTreatmentID).to.be.equal(mm.mechanicalTreatmentID);
        expect(obj.speciesAgency).to.be.equal(mm.speciesAgency);
        expect(obj.paperFileID).to.be.equal(mm.paperFileID);
        expect(obj.efficacy).to.be.equal(mm.efficacy);

        await destroyMechanicalMonitor(obj);
    });

    it('should update mechanical monitor with spec', async () => {

    });

    it('should fetch all mechanical monitoring records', async () => {

    });
    it('should create mechanical monitor record with spaceGeom factory', async () => {

    });
    it('should create mechanical monitor record with spaceGeom spec factory', async () => {

    });
    it('should fetch efficacy rating codes', async () => {

    });
    it('should fetch species agency codes', async () => {

    });
    it('should fetch mechanical treatment records', async () => {

    });
    it('should create/fetch mechanical monitor object', async () => {

    });
    it('should not allow creation of mechanical monitor object with foreign key reference to a mechanical treatment ID that doesn\t exist in the database', async () => {

    });
    it('should not allow creation of mechanical monitor object without a foreign key reference to a mechanical treatment ID', async () => {

    });
    it('should not allow creation of mechanical monitor object with reference to invalid mechanical treatment ID', async() => {

    });
    it('should not allow creation of mechanical monitor object with reference to invalid efficacy code', async () => {

    });
    it('should not allow creation of mechanical monitor object with reference to invalid species agency code', async() => {

    });
    it('should not allow creation of mechanical monitor object with reference to invalid spaceGeom object', async() => {

    });
});
