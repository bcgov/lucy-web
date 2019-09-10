//
// Account route controller
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-07-08.
/**
 * Imports
 */
import { Request, Router} from 'express';
import { RouteHandler,
    SecureRouteController,
    Route,
    HTTPMethod,
    ValidatorCheck
} from '../../core';
import { ObservationController,
    JurisdictionCodeController,
    SpeciesController,
    Observation,
    SpeciesAgencyCodeController,
    ObservationGeometryCodeController,
    ObservationTypeCodeController,
    SpecificUseCodeController,
    SoilTextureCodeController,
    SlopeCodeController,
    AspectCodeController,
    ProposedActionCodeController,
    MechanicalMethodCodeController,
    MechanicalDisposalMethodCodeController,
    MechanicalSoilDisturbanceCodeController,
    MechanicalRootRemovalCodeController,
    MechanicalTreatmentIssueCodeController,
    TreatmentProviderContractorController
} from '../../../database/models';
import { SpeciesDensityCodeController, SpeciesDistributionCodeController } from '../../../database/models';
import { observationModifyRoute } from './observation.species.route';
import { unWrap } from '../../../libs/utilities';


/**
 * @description Validation response object in request
 */
interface ObservationIdValidation {
    id: Observation;
}


export class ObservationRouteController extends SecureRouteController<ObservationController> {

    static get shared(): ObservationRouteController {
        return this.sharedInstance<ObservationController>() as ObservationRouteController;
    }

    constructor() {
        super();
        // Data controller
        this.dataController = ObservationController.shared;

        this.applyRouteConfig();

        // Get all codes
        this.router.get('/codes', this.indexCodes);


        // Get all observation
        // this.router.get('/', this.index);

        // Get single observation
        this.router.get('/:id', this.idValidation(), this.index);

        // Observation modify species route
        this.router.use('/', observationModifyRoute());
    }

    /**
     * @description Route Handler to load all codes for observation
     */
    get indexCodes(): RouteHandler {
        return this.routeConfig<any>('indexCodes', async () => [200, {
            jurisdictionCodes : await JurisdictionCodeController.shared.all(),
            speciesList: await SpeciesController.shared.all(),
            speciesDensityCodes: await SpeciesDensityCodeController.shared.all(),
            speciesDistributionCodes: await SpeciesDistributionCodeController.shared.all(),
            speciesAgencyCodes: await SpeciesAgencyCodeController.shared.all(),
            observationTypeCodes: await ObservationTypeCodeController.shared.all(),
            soilTextureCodes: await SoilTextureCodeController.shared.all(),
            observationGeometryCodes: await ObservationGeometryCodeController.shared.all(),
            specificUseCodes: await SpecificUseCodeController.shared.all(),
            slopeCodes: await SlopeCodeController.shared.all(),
            aspectCodes: await AspectCodeController.shared.all(),
            proposedActionCodes: await ProposedActionCodeController.shared.all(),
            mechanicalTreatmentMethodsCodes: await MechanicalMethodCodeController.shared.all(),
            mechanicalDisposalMethodCodes: await MechanicalDisposalMethodCodeController.shared.all(),
            mechanicalSoilDisturbanceCodes: await MechanicalSoilDisturbanceCodeController.shared.all(),
            mechanicalRootRemovalCodes: await MechanicalRootRemovalCodeController.shared.all(),
            mechanicalIssueCodes: await MechanicalTreatmentIssueCodeController.shared.all(),
            mechanicalTreatmentProviders: await TreatmentProviderContractorController.shared.all()

        }]);
    }

    /**
     * @description Route handler to fetch all observation
     */
    @Route({
        path: 'api/observation#/',
        description: 'API to fetch observation',
        method: HTTPMethod.get,
        validators: () => {
            return ValidatorCheck({
                lat: {
                    validate: validate => validate.isNumeric().optional(),
                    message: 'should be number'
                },
                long: {
                    validate: validate => validate.isNumeric().optional(),
                    message: 'should be number'
                },
                observerFirstName: {
                    validate: validate => validate.isString().optional(),
                    message: 'should be string'
                },
                observerLastName: {
                    validate: validate => validate.isString().optional(),
                    message: 'should be string'
                }
            });
        },
        responses: {
            200: {
                description: 'Fetch success',
                schema: {
                    type: 'array',
                    $ref: '#/definitions/Observation'
                }
            }
        }
    })
    get index(): RouteHandler {
        return this.routeConfig<any>('observation-index', async (d: any, req: Request) => [
            200,
            unWrap(this.validation<ObservationIdValidation>(req, 'obs-index'), {}).id || await this.dataController.all(req.query)
        ]);
    }
}

/**
 * @description Exposing router object
 */
export const observationRoute = (): Router => ObservationRouteController.shared.router;


 // -----------------------------------------------------------------------------------------------------------

