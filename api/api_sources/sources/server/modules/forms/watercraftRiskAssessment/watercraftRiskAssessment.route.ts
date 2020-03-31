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
 * File: watercraftRiskAssessment.route.ts
 * Project: lucy
 * File Created: Tuesday, 5th November 2019 10:16:47 am
 * Author: pushan
 * -----
 * Last Modified: Tuesday, 5th November 2019 10:58:51 am
 * Modified By: pushan
 * -----
 */
/**
 * Imports
 */
import * as express from 'express';
import {
    // SecureRouteController,
    ResourceRoute,
    CreateMiddleware,
    ResourceRouteController,
    UpdateMiddleware,
    Get,
    inspectAppEditorRoute,
    inspectAppAdminRoute
} from '../../../core';
import {
    WatercraftRiskAssessmentController,
    WatercraftRiskAssessmentSpec,
    CountryProvince,
    CountryProvinceController
} from '../../../../database/models';

// Check Country and Province Code
const CheckCountryAndProvinceCode = async (req: any, resp: express.Response, next: any) => {
    const body: any = req.body || {};
    let errorMessage = '';
    if (body.provinceOfResidence && body.countryOfResidence) {
        // Get all provinces
        const code: CountryProvince = await CountryProvinceController.shared.fetchOne({
            provinceCode: body.provinceOfResidence,
            countryCode: body.countryOfResidence
        });
        if (code) {
            next();
            return;
        } else {
            errorMessage = `Unknown values for countryOfResidence = ${body.countryOfResidence}, provinceOfResidence = ${body.provinceOfResidence}`;
        }
    } else {
        errorMessage = `Missing keys provinceOfResidence | countryOfResidence`;
    }
    if (errorMessage) {
        resp.status(422).json({
            message: errorMessage,
            time: new Date(),
            errors: [
                {
                    msg: 'provinceOfResidence | countryOfResidence: required',
                    param: 'provinceOfResidence | countryOfResidence',
                    location: 'body'
                }
            ]
        });
    }
};
@ResourceRoute({
    path: '/api/mussels/wra/#',
    description: 'API route controller for Watercraft risk assessment',
    dataController: WatercraftRiskAssessmentController.shared,
    // validators: CreateTreatmentValidator,
    secure: true
})
@CreateMiddleware(() => [ inspectAppEditorRoute(), CheckCountryAndProvinceCode ])
@UpdateMiddleware(() => [ inspectAppEditorRoute() ])
export class WatercraftRiskAssessmentRouteController extends ResourceRouteController<WatercraftRiskAssessmentController, WatercraftRiskAssessmentSpec, any> {
    static get shared(): WatercraftRiskAssessmentRouteController {
        return this.sharedInstance() as WatercraftRiskAssessmentRouteController;
    }

    /**
     * @description Create New Object
     * @param Request req
     * @param any data
     */
    public async createResource(req: any, data: any): Promise<[number, any]> {
        // Get Proper data mapping
        return [201, await this.dataController.createNewObject(data, req.user)];
    }

    @Get({
        path: '/export',
        secure: true,
        middleware: () => [ inspectAppAdminRoute() ]
    })
    public async export() {
        return [200, await this.dataController.export()];
    }
}
