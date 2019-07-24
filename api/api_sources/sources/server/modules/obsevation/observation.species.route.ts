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
// Created by Pushan Mitra on 2019-07-09.
/**
 * Imports
 */
import * as assert from 'assert';
import { Router } from 'express';
import { check } from 'express-validator';
import { RouteHandler, MakeOptionalValidator, idValidator, UpdateRequest, WriterRouteController } from '../../core';
import { ObservationSpeciesController,
    SpeciesController,
    JurisdictionCodeController,
    ObservationController,
    SpeciesAgencyCodeController,
    SpeciesDensityCodeController,
    SpeciesDistributionCodeController,
    SurveyTypeCodeController,
    SurveyGeometryCodeController,
    SpecificUseCodeController,
    SoilTextureCodeController
} from '../../../database/models';
import { ObservationSpeciesCreateModel,
    ObservationSpeciesUpdateModel,
    ObservationSpecies 
} from '../../../database/models';
// import { DataController } from '../../../database/data.model.controller';

const CreateValidator = (): any[] =>  {
    return [
        check('width').isNumeric().withMessage('width: should be number'),
        check('length').isNumeric().withMessage('length: should be number'),
        check('accessDescription').isString().withMessage('accessDescription: should be string'),
        check('surveyorFirstName').isString().withMessage('surveyorFirstName: should be string'),
        check('surveyorLastName').isString().withMessage('surveyorLastName: should be string'),
        check('species').isInt().custom(async (value: number, {req}) => {
            const species = await SpeciesController.shared.findById(value);
            assert(species, `species: No Species exists with id ${value}`);
            req.species = species;
        }),
        check('jurisdiction').isInt().custom(async (value: number, {req}) => {
            const code = await JurisdictionCodeController.shared.findById(value);
            assert(code, `jurisdiction: No Jurisdiction code exists with id ${value}`);
            req.jurisdictionCode = code;
        }),
        check('observation').isInt().custom(async (value: number, {req}) => {
            const obs = await ObservationController.shared.findById(value);
            assert(obs, `observation: No observation exists with id ${value}`);
            req.observation = obs;
        }),
        idValidator<SpeciesAgencyCodeController>('speciesAgency', SpeciesAgencyCodeController.shared, (data, req) => {
            UpdateRequest(req, {speciesAgency: data});
        }),
        idValidator<SpeciesDensityCodeController>('density', SpeciesDensityCodeController.shared, (data, req) => {
            UpdateRequest(req, {density: data});
        }),
        idValidator<SpeciesDistributionCodeController>('distribution', SpeciesDistributionCodeController.shared, (data, req) => {
            UpdateRequest(req, {distribution: data});
        }),
        idValidator<SurveyTypeCodeController>('surveyType', SurveyTypeCodeController.shared, (data, req) => {
            UpdateRequest(req, {surveyType: data});
        }),
        idValidator<SurveyGeometryCodeController>('surveyGeometry', SurveyGeometryCodeController.shared, (data, req) => {
            UpdateRequest(req, {surveyGeometry: data});
        }),
        idValidator<SpecificUseCodeController>('specificUseCode', SpecificUseCodeController.shared, (data, req) => {
            UpdateRequest(req, {specificUseCode: data});
        }),
        idValidator<SoilTextureCodeController>('soilTexture', SoilTextureCodeController.shared, (data, req) => {
            UpdateRequest(req, {soilTexture: data});
        })
    ];
};

export class ObservationSpeciesRouteController extends WriterRouteController <ObservationSpeciesController> {

    static get shared(): ObservationSpeciesRouteController {
        return this.sharedInstance<ObservationSpeciesController>() as ObservationSpeciesRouteController;
    }

    constructor() {
        super();
        this.dataController = ObservationSpeciesController.shared;
        this.router.post('/', CreateValidator(), this.create);
        this.router.put('/:id', this.combineValidator(MakeOptionalValidator(CreateValidator), this.idValidation()), this.update);
    }

    // Create Observation - species entry
    get create(): RouteHandler {
        return this.routeConfig<any>('obs:species-create', async (data: any, req: any) => {
            const model: ObservationSpeciesCreateModel = {
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observation: req.observation,
                surveyType: req.validation.surveyType,
                speciesAgency: req.validation.speciesAgency,
                density: req.validation.density,
                distribution: req.validation.distribution,
                surveyGeometry: req.validation.surveyGeometry,
                specificUseCode: req.validation.specificUseCode,
                soilTexture: req.validation.soilTexture,
                surveyorFirstName: data.surveyorFirstName,
                surveyorLastName: data.surveyorLastName
            };
            return [201, await this.dataController.createObservationOfSpecies(model, req.user)];
        });
    }

    /**
     * @description Route handle to update observation species
     */
    get update(): RouteHandler {
        return this.routeConfig<any>('obs:species-update', async (data: any, req: any) => {
            const model: ObservationSpeciesUpdateModel = {
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observation: req.observation,
                density: req.validation.density,
                distribution: req.validation.distribution,
                surveyType: req.validation.surveyType,
                speciesAgency: req.validation.speciesAgency,
                surveyGeometry: req.validation.surveyGeometry,
                specificUseCode: req.validation.specificUseCode,
                soilTexture: req.validation.soilTexture,
                surveyorFirstName: data.surveyorFirstName,
                surveyorLastName: data.surveyorLastName
            };
            const observationSpecies: ObservationSpecies = this.validation<any>(req).id as ObservationSpecies;
            return [200, await this.dataController.updateObservationOfSpecies(observationSpecies, model, req.user)];
        });
    }
}

/**
 * @description Exposing router object
 */
export const observationSpeciesRoute = (): Router => ObservationSpeciesRouteController.shared.router;

// -----------------------------------------------------------------------------------------------------------
