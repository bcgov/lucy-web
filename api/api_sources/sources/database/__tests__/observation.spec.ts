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
 * File: observation.spec.ts
 * Project: lucy
 * File Created: Friday, 12th July 2019 3:38:46 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Friday, 12th July 2019 3:39:05 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */

import { expect, should } from 'chai';
import { commonTestSetupAction, commonTestTearDownAction } from '../../test-helpers/testHelpers';
import { observationFactory, destroyObservation, observationSpeciesFactory, destroyObservationSpecies } from '../factory';
import { ObservationController, ObservationSpeciesController } from '../models';
import { speciesDensityCodeFactory, speciesDistributionCodeFactory} from '../factory';

describe('Observation tests', () => {
    before(async () => {
        await commonTestSetupAction();
    });
    after(async () => {
        await commonTestTearDownAction();
        return;
    });

    it('should create/fetch observation', async () => {
        const f = await observationFactory();
        should().exist(f);
        const obs = await ObservationController.shared.findById(f.observation_id);
        should().exist(obs);
        should().exist(obs.createdBy);
        should().exist(obs.updatedBy);
        expect(obs.createdBy.user_id).to.equal(f.createdBy.user_id);
        expect(obs.updatedBy.user_id).to.equal(f.updatedBy.user_id);
        expect(obs.observation_id).to.equal(f.observation_id);
        await destroyObservation(obs);
    });

    it('should create/fetch observation-species', async () => {
        const f = await observationSpeciesFactory();
        should().exist(f);
        const obs = await ObservationSpeciesController.shared.findById(f.observation_species_id);
        // console.dir(obs);
        should().exist(obs);
        should().exist(obs.createdBy);
        should().exist(obs.updatedBy);
        should().exist(obs.jurisdiction);
        should().exist(obs.species);
        expect(obs.createdBy.user_id).to.equal(f.createdBy.user_id);
        expect(obs.updatedBy.user_id).to.equal(f.updatedBy.user_id);
        expect(obs.observation_species_id).to.equal(f.observation_species_id);
        await destroyObservationSpecies(obs);
    });

    it('should fetch species density code', async () => {
        const code = await speciesDensityCodeFactory(2);
        should().exist(code);
        expect(code.species_density_code_id).to.be.equals(2);
    });

    it('should fetch species density code', async () => {
        const code = await speciesDistributionCodeFactory(2);
        should().exist(code);
        expect(code.species_distribution_code_id).to.be.equals(2);
    });
});

// -------------------------------------------------------------
