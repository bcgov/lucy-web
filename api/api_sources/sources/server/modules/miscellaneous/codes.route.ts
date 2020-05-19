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
 * File: codes.route.ts
 * Project: lucy
 * File Created: Monday, 16th September 2019 2:03:12 pm
 * Author: pushan
 * -----
 * Last Modified: Monday, 16th September 2019 2:24:36 pm
 * Modified By: pushan
 * -----
 */

import { RouteHandler, Route, SecureRouteController, HTTPMethod } from '../../core';
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
    MechanicalSoilDisturbanceCodeController,
    MechanicalRootRemovalCodeController,
    TreatmentProviderContractorController,
    ProjectManagementPlanCodeController,
    ChemicalTreatmentMethodCodeController,
    WindDirectionCodesController,
    HerbicideController,
    LifeStageCodeController,
    BehaviourCodeController,
    AnimalSpeciesController
} from '../../../database/models';
import { DataController } from '../../../database/data.model.controller';
import { ChemicalTreatmentEmployeeController } from '../../../database/models/controllers/chemicalTreatmentEmployee.controller';
import { PesticideEmployerCodeController } from '../../../database/models/controllers/pesticideEmployerCode.controller';
import { MechanicalDisposalMethodCodeController } from '../../../database/models/controllers/mechanicalDisposalMethodCode.controller';
import { MechanicalTreatmentIssueCodeController } from '../../../database/models/controllers/mechanicalTreatmentIssueCode.controller';
import { MechanicalMethodCodeController } from '../../../database/models/controllers/mechanicalMethodCode.controller';
import { EfficacyCodeController } from '../../../database/models/controllers/efficacyCode.controller';
export class CodeTableRouteController extends SecureRouteController<any> {
    static get shared(): CodeTableRouteController {
        return this.sharedInstance<CodeTableRouteController>() as CodeTableRouteController;
    }

    constructor() {
        super();
    }

    codeTableObj: any;

    private async  addCodes(controller: DataController) {
        this.codeTableObj[controller.meta.modelName] = await controller.all();
    }
    async codeTables(): Promise<void> {
        this.codeTableObj = {};
        await this.addCodes(JurisdictionCodeController.shared);
        await this.addCodes(SpeciesController.shared);
        await this.addCodes(SpeciesAgencyCodeController.shared);
        await this.addCodes(SpeciesDensityCodeController.shared);
        await this.addCodes(SpeciesDistributionCodeController.shared);
        await this.addCodes(SoilTextureCodeController.shared);
        await this.addCodes(ObservationTypeCodeController.shared);
        await this.addCodes(ObservationGeometryCodeController.shared);
        await this.addCodes(SpecificUseCodeController.shared);
        await this.addCodes(SlopeCodeController.shared);
        await this.addCodes(AspectCodeController.shared);
        await this.addCodes(ProposedActionCodeController.shared);
        await this.addCodes(MechanicalMethodCodeController.shared);
        await this.addCodes(MechanicalDisposalMethodCodeController.shared);
        await this.addCodes(MechanicalSoilDisturbanceCodeController.shared);
        await this.addCodes(MechanicalRootRemovalCodeController.shared);
        await this.addCodes(MechanicalTreatmentIssueCodeController.shared);
        await this.addCodes(TreatmentProviderContractorController.shared);
        await this.addCodes(ProjectManagementPlanCodeController.shared);
        await this.addCodes(PesticideEmployerCodeController.shared);
        await this.addCodes(ChemicalTreatmentEmployeeController.shared);
        await this.addCodes(ChemicalTreatmentMethodCodeController.shared);
        await this.addCodes(WindDirectionCodesController.shared);
        await this.addCodes(HerbicideController.shared);
        await this.addCodes(EfficacyCodeController.shared);
        await this.addCodes(LifeStageCodeController.shared);
        await this.addCodes(BehaviourCodeController.shared);
        await this.addCodes(AnimalSpeciesController.shared);
        return this.codeTableObj;
    }

    @Route({
        path: 'api/codes#/',
        description: 'API to fetch all application codes',
        method: HTTPMethod.get,
        responses: {
            200: {
                description: 'Success',
                schema: {
                    type: 'object'
                }
            }
        }
    })
    get codes(): RouteHandler {
        return this.routeConfig<any>(`${this.className}: codes`, async () => [200, await this.codeTables()]);
    }
}

// --------------------------------------------------------
