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
 * File: miscellaneous.router.spec.ts
 * Project: lucy
 * File Created: Wednesday, 31st July 2019 11:08:11 am
 * Author: pushan
 * -----
 * Last Modified: Wednesday, 31st July 2019 11:08:17 am
 * Modified By: pushan
 * -----
 */

import { should, expect } from 'chai';
import { SharedExpressApp } from '../../../initializers';
import {
    verifySuccessBody,
    commonTestSetupAction,
    commonTestTearDownAction,
    testRequest,
    HttpMethodType,
    AuthType
} from '../../../../test-helpers/testHelpers';
import { testIdr1Token, testIdr3Token, viewerToken } from '../../../../test-helpers/token';
import {
    JurisdictionCodeController,
    SpeciesController,
    SpeciesDensityCodeController,
    SpeciesAgencyCodeController,
    SpeciesDistributionCodeController,
    SoilTextureCodeController,
    ObservationTypeCodeController,
    ObservationGeometryCodeController,
    SpecificUseCodeController,
    SlopeCodeController,
    AspectCodeController,
    ProposedActionCodeController,
    MechanicalMethodCodeController,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCodeController,
    MechanicalRootRemovalCodeController,
    MechanicalTreatmentIssueCodeController,
    TreatmentProviderContractorController,
    ProjectManagementPlanCodeController,
    PesticideEmployerCodeController
} from '../../../../database/models';
import { DataController } from '../../../../database/data.model.controller';
import { ChemicalTreatmentEmployeeController } from '../../../../database/models/controllers/chemicalTreatmentEmployee.controller';

describe('Test miscellaneous routes', () => {
    before(async () => {
        await commonTestSetupAction();
        await SharedExpressApp.initExpress();
    });
    after(async () => {
        await commonTestTearDownAction();
    });

    it('should return version', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/misc/version',
            expect: 200
        }).then(resp => {
            verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.version);
            });
        });
    });

    it('should return token [admin]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/misc/test-token/admin',
            expect: 200
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.token);
                expect(data.token).to.be.equal(testIdr1Token());
            });
        });
    });

    it('should return token [sme]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/misc/test-token/sme',
            expect: 200
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.token);
                expect(data.token).to.be.equal(testIdr3Token());
            });
        });
    });

    it('should return token [viewer]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/misc/test-token/viewer',
            expect: 200
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.token);
                expect(data.token).to.be.equal(viewerToken());
            });
        });
    });

    it('should return empty token [any key]', async () => {
        await testRequest(SharedExpressApp.app, {
            type: HttpMethodType.get,
            url: '/api/misc/test-token/any',
            expect: 200
        }).then(async resp => {
            await verifySuccessBody(resp.body, async (data: any) => {
                should().exist(data.token);
                expect(data.token).to.be.equal('');
            });
        });
    });

    it('should return codes', async () => {
        await testRequest(SharedExpressApp.app, {
            url: '/api/codes',
            type: HttpMethodType.get,
            expect: 200,
            auth: AuthType.viewer
        }).then(async resp => {
            await verifySuccessBody(resp.body, async data => {
                const checkCodes = async (controller: DataController) => {
                    should().exist(data[controller.meta.modelName]);
                };
                await checkCodes(JurisdictionCodeController.shared);
                await checkCodes(SpeciesController.shared);
                await checkCodes(SpeciesAgencyCodeController.shared);
                await checkCodes(SpeciesDensityCodeController.shared);
                await checkCodes(SpeciesDistributionCodeController.shared);
                await checkCodes(SoilTextureCodeController.shared);
                await checkCodes(ObservationTypeCodeController.shared);
                await checkCodes(ObservationGeometryCodeController.shared);
                await checkCodes(SpecificUseCodeController.shared);
                await checkCodes(SlopeCodeController.shared);
                await checkCodes(AspectCodeController.shared);
                await checkCodes(ProposedActionCodeController.shared);
                await checkCodes(MechanicalMethodCodeController.shared);
                await checkCodes(MechanicalDisposalMethodCodeController.shared);
                await checkCodes(MechanicalSoilDisturbanceCodeController.shared);
                await checkCodes(MechanicalRootRemovalCodeController.shared);
                await checkCodes(MechanicalTreatmentIssueCodeController.shared);
                await checkCodes(TreatmentProviderContractorController.shared);
                await checkCodes(ProjectManagementPlanCodeController.shared);
                await checkCodes(PesticideEmployerCodeController.shared);
                await checkCodes(ChemicalTreatmentEmployeeController.shared);
            });
        });
    });
});
// ----------------------------------------------------------------------------
