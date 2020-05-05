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
    testModel,
} from '../../test-helpers/testHelpers';
import {    ModelFactory,
    userFactory,
    mechanicalMonitorFactory,
    mechanicalMonitorCreateSpecFactory,
    destroyMechanicalMonitor,
    mechanicalMonitorUpdateSpecFactory,
    Destroy,
    Destroyer,
} from '../factory';
import * as faker from 'faker';
import { MechanicalMonitorController,
         MechanicalMonitorUpdateSpec,
         User,
         UserDataController,
         MechanicalMonitor,
         MechanicalTreatment,
         EfficacyCode,
         EfficacyCodeController,
         SpeciesAgencyCode,
         SpeciesAgencyCodeController,
         MechanicalTreatmentController } from '../models';
import { SpeciesAgencyCodeSchema, MechanicalTreatmentSchema } from '../database-schema';

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

        expect(f.efficacy.efficacy_code_id).to.be.equal(mm.efficacy.efficacy_code_id);
        expect(f.mechanicalTreatmentID.mechanical_treatment_id).to.be.equal(mm.mechanicalTreatmentID.mechanical_treatment_id);
        expect(f.paperFileID).to.be.equal(mm.paperFileID);
        expect(f.speciesAgency.species_agency_code_id).to.be.equal(mm.speciesAgency.species_agency_code_id);
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
        expect(obj.mechanicalTreatmentID.mechanical_treatment_id).to.be.equal(mm.mechanicalTreatmentID.mechanical_treatment_id);
        expect(obj.speciesAgency.species_agency_code_id).to.be.equal(mm.speciesAgency.species_agency_code_id);
        expect(obj.paperFileID).to.be.equal(mm.paperFileID);
        expect(obj.efficacy.efficacy_code_id).to.be.equal(mm.efficacy.efficacy_code_id);

        await destroyMechanicalMonitor(obj);
    });

    it('should update mechanical monitor with spec', async () => {
        const f = await mechanicalMonitorFactory();
        const user = await userFactory();
        const spec: MechanicalMonitorUpdateSpec = await mechanicalMonitorUpdateSpecFactory();
        await MechanicalMonitorController.shared.updateObject(f, spec, user);
        const mm = await MechanicalMonitorController.shared.findById(f.mechanical_monitor_id);
        should().exist(mm);
        should().exist(mm.mechanicalTreatmentID);
        should().exist(mm.efficacy.efficacy_code_id);
        should().exist(mm.timestamp);
        should().exist(mm.speciesAgency);

        const updatedSpeciesAgency = spec.speciesAgency || {species_agency_code_id: 0};
        const updatedEfficacy = spec.efficacy || {efficacy_code_id: 3};
        expect(mm.speciesAgency.species_agency_code_id).to.be.equal(updatedSpeciesAgency.species_agency_code_id);
        expect(mm.efficacy.efficacy_code_id).to.be.equal(updatedEfficacy.efficacy_code_id);

        await destroyMechanicalMonitor(f);
        await Destroy<User, UserDataController>(UserDataController.shared)(user);
    });

    it('should fetch all mechanical monitoring records', async () => {
        const f = await mechanicalMonitorFactory();
        should().exist(f);
        const mmArray: MechanicalMonitor[] = await MechanicalMonitorController.shared.all({});
        should().exist(mmArray);
        expect(mmArray.length).to.be.greaterThan(0);
        await destroyMechanicalMonitor(f);
    });

    it('should fetch efficacy rating codes', async () => {
        const code: EfficacyCode = await EfficacyCodeController.shared.random();
        should().exist(code);
        should().exist(code.displayLabel);
    });

    it('should fetch species agency codes', async () => {
        const code: SpeciesAgencyCode = await SpeciesAgencyCodeController.shared.random();
        testModel(code, SpeciesAgencyCodeSchema.shared);
    });

    it('should fetch mechanical treatment records', async () => {
        const obj: MechanicalTreatment = await ModelFactory(MechanicalTreatmentController.shared)();
        testModel(obj, MechanicalTreatmentSchema.shared);
        const mt = MechanicalTreatmentController.shared.findById(obj.mechanical_treatment_id);
        should().exist(mt);
        await Destroyer(MechanicalTreatmentController.shared)(obj);
    });

    it('should not allow creation of mechanical monitor object without a foreign key reference to a mechanical treatment ID', async () => {
        const f = await mechanicalMonitorCreateSpecFactory();
        delete f.mechanicalTreatmentID;
        const user = await userFactory();

        try {
            const obj = await MechanicalMonitorController.shared.createNewObject(f, user);
            expect(obj).to.be.equal(undefined);
        } catch (e) {
            should().exist(e);
        }
    });

    it('should not allow creation of mechanical monitor object with reference to invalid mechanical treatment ID', async() => {
        const user = await userFactory();
        const f = await ModelFactory(MechanicalMonitorController.shared)();
        should().exist(f);
        should().exist(f.mechanicalTreatmentID);
        const treatmentId = f.mechanicalTreatmentID;
        const dup: any = {...f};

        try {
            // we should never have mechanical treatments with negative ID values
            const fakeMechTreatment: MechanicalTreatment = await MechanicalTreatmentController.shared.findById(-1);
            dup.mechanicalTreatmentID = fakeMechTreatment.mechanical_treatment_id;
            should().not.exist(fakeMechTreatment);
        } catch (e) {
            should().exist(e);
        }

        try {
            const update = await MechanicalTreatmentController.shared.updateObject(f, dup, user);
            expect(update).to.be.eqls(undefined);
        } catch (e) {
            should().exist(e);
        }

        expect(f.mechanicalTreatmentID).to.not.equal(-1);
        should().exist(f.mechanicalTreatmentID);
        expect(treatmentId).to.be.equal(f.mechanicalTreatmentID);

        await Destroyer(MechanicalMonitorController.shared)(f);
    });

    it('should not allow creation of mechanical monitor object with reference to invalid efficacy code', async () => {
        const user = await userFactory();
        const f = await ModelFactory(MechanicalMonitorController.shared)();
        should().exist(f);
        should().exist(f.efficacy);
        const efficacyId = f.efficacy.efficacy_code_id;
        const dup: any = {...f};

        try {
            // we should never have an efficacy code with an id this large
            const fakeEfficacyCode: EfficacyCode = await EfficacyCodeController.shared.findById(250);
            dup.efficacy = fakeEfficacyCode;
            should().not.exist(fakeEfficacyCode);
        } catch (e) {
            should().exist(e);
        }

        try {
            const update = await MechanicalMonitorController.shared.updateObject(f, dup, user);
            expect(update).to.be.eqls(undefined);
        } catch (e) {
            should().exist(e);
        }

        expect(f.efficacy.efficacy_code_id).to.not.equal(250);
        should().exist(f.efficacy);
        should().exist(f.efficacy.efficacy_code_id);
        expect(efficacyId).to.be.equal(f.efficacy.efficacy_code_id);

        await Destroyer(MechanicalMonitorController.shared)(f);
    });

    it('should not allow creation of mechanical monitor object with reference to invalid species agency code', async() => {
        const user = await userFactory();
        const f = await ModelFactory(MechanicalMonitorController.shared)();
        should().exist(f);
        should().exist(f.speciesAgency);
        const specId = f.speciesAgency.species_agency_code_id;
        const dup: any = {...f};

        // we should never have a species agency with an id this large
        const bigNumber = faker.random.number({min: 30000, max: 999999});
        try {
            const fakeAgency: SpeciesAgencyCode = await SpeciesAgencyCodeController.shared.findById(bigNumber);
            dup.speciesAgency = fakeAgency;
            should().not.exist(fakeAgency);
        } catch (e) {
            should().exist(e);
        }

        try {
            const update = await MechanicalMonitorController.shared.updateObject(f, dup, user);
            expect(update).to.be.eqls(undefined);
        } catch (e) {
            should().exist(e);
        }

        expect(f.speciesAgency.species_agency_code_id).to.not.equal(bigNumber);
        should().exist(f.speciesAgency);
        should().exist(f.speciesAgency.species_agency_code_id);
        expect(specId).to.be.equal(f.speciesAgency.species_agency_code_id);

        await Destroyer(MechanicalMonitorController.shared)(f);
    });
});
