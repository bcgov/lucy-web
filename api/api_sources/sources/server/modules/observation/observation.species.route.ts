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
import * as moment from 'moment';
import { Router } from 'express';
import { check } from 'express-validator';
import { RouteHandler, MakeOptionalValidator, idValidator, UpdateRequest, WriterRouteController } from '../../core';
import { Observation,
    ObservationController,
    SpeciesController,
    JurisdictionCodeController,
    SpeciesAgencyCodeController,
    SpeciesDensityCodeController,
    SpeciesDistributionCodeController,
    ObservationTypeCodeController,
    ObservationGeometryCodeController,
    SpecificUseCodeController,
    SoilTextureCodeController,
    ObservationCreateModel,
    ObservationUpdateModel,
    SlopeCodeController,
    AspectCodeController,
    ProposedActionCodeController
} from '../../../database/models';
// import { DataController } from '../../../database/data.model.controller';

const CreateValidator = (): any[] =>  {
    return [
        check('lat').isNumeric().withMessage('lat: should be number'),
        check('long').isNumeric().withMessage('long: should be number'),
        check('date').isString().custom(async (value: string, {req}) => {
            assert(moment(value, 'YYYY-MM-DD').isValid(), `date: should be string in YYYY-MM-DD format`);
        }),
        check('width').isNumeric().withMessage('width: should be number'),
        check('length').isNumeric().withMessage('length: should be number'),
        check('accessDescription').isString().withMessage('accessDescription: should be string'),
        check('observerFirstName').isString().withMessage('observerFirstName: should be string'),
        check('observerLastName').isString().withMessage('observerLastName: should be string'),
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
        idValidator<SpeciesAgencyCodeController>('speciesAgency', SpeciesAgencyCodeController.shared, async (data, req) => {
            UpdateRequest(req, {speciesAgency: data});
        }),
        idValidator<SpeciesDensityCodeController>('density', SpeciesDensityCodeController.shared, async (data, req) => {
            UpdateRequest(req, {density: data});
        }),
        idValidator<SpeciesDistributionCodeController>('distribution', SpeciesDistributionCodeController.shared, async (data, req) => {
            UpdateRequest(req, {distribution: data});
        }),
        idValidator<ObservationTypeCodeController>('observationType', ObservationTypeCodeController.shared, async (data, req) => {
            UpdateRequest(req, {observationType: data});
        }),
        idValidator<ObservationGeometryCodeController>('observationGeometry', ObservationGeometryCodeController.shared, async (data, req) => {
            UpdateRequest(req, {observationGeometry: data});
        }),
        idValidator<SpecificUseCodeController>('specificUseCode', SpecificUseCodeController.shared, async (data, req) => {
            UpdateRequest(req, {specificUseCode: data});
        }),
        idValidator<SoilTextureCodeController>('soilTexture', SoilTextureCodeController.shared, async (data, req) => {
            UpdateRequest(req, {soilTexture: data});
        }),
        idValidator<SlopeCodeController>('slopeCode', SlopeCodeController.shared, async (data, req) => {
            UpdateRequest(req, {slopeCode: data});
        }),
        idValidator<AspectCodeController>('aspectCode', AspectCodeController.shared, async (data, req) => {
            UpdateRequest(req, {aspectCode: data});
        }),
        idValidator<ProposedActionCodeController>('proposedAction', ProposedActionCodeController.shared, async (data, req) => {
            UpdateRequest(req, {proposedAction: data});
        })

    ];
};

const CreateOptionalValidator = (): any[] => {
    return [
        check('sampleIdentifier').isString().isAlphanumeric().exists().withMessage('sampleIdentifier: should be alphanumeric string'),
        check('rangeUnitNumber').isString().withMessage('rangeUnitNumber: should be alphanumeric string').custom(async (value: string) => {
            assert(value.match(/^[a-zA-Z0-9]*$/gm), `rangeUnitNumber: should be alphanumeric string`);
        }),
        check('legacySiteIndicator').isBoolean().withMessage('legacySiteIndicator: should be boolean'),
        check('edrrIndicator').isBoolean().withMessage('edrrIndicator: should be boolean'),
        check('researchIndicator').isBoolean().withMessage('researchIndicator: should be boolean'),
        check('sampleTakenIndicator').isBoolean().withMessage('sampleTakenIndicator: should be boolean'),
        check('wellIndicator').isBoolean().withMessage('wellIndicator: should be boolean'),
        check('specialCareIndicator').isBoolean().withMessage('specialCareIndicator: should be boolean'),
        check('biologicalIndicator').isBoolean().withMessage('biologicalIndicator: should be boolean'),
        check('aquaticIndicator').isBoolean().withMessage('aquaticIndicator: should be boolean')
    ];
};

export class ObservationModifyRouteController extends WriterRouteController <ObservationController> {

    static get shared(): ObservationModifyRouteController {
        return this.sharedInstance<ObservationController>() as ObservationModifyRouteController;
    }

    constructor() {
        super();
        this.dataController = ObservationController.shared;
        this.router.post('/', this.combineValidator(CreateValidator(), MakeOptionalValidator(CreateOptionalValidator)), this.create);
        this.router.put('/:id', this.combineValidator(MakeOptionalValidator(CreateValidator), this.idValidation(), MakeOptionalValidator(CreateOptionalValidator)), this.update);
    }

    // Create Observation - species entry
    get create(): RouteHandler {
        return this.routeConfig<any>('obs:species-create', async (data: any, req: any) => {
            const model: ObservationCreateModel = {
                lat: data.lat,
                long: data.long,
                date: data.date,
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observationType: req.validation.observationType,
                speciesAgency: req.validation.speciesAgency,
                density: req.validation.density,
                distribution: req.validation.distribution,
                observationGeometry: req.validation.observationGeometry,
                specificUseCode: req.validation.specificUseCode,
                soilTexture: req.validation.soilTexture,
                observerFirstName: data.observerFirstName,
                observerLastName: data.observerLastName,
                slopeCode: req.validation.slopeCode,
                aspectCode: req.validation.aspectCode,
                proposedAction: req.validation.proposedAction,
                sampleIdentifier: data.sampleIdentifier,
                rangeUnitNumber: data.rangeUnitNumber,
                legacySiteIndicator: data.legacySiteIndicator,
                edrrIndicator: data.edrrIndicator,
                researchIndicator: data.researchIndicator,
                sampleTakenIndicator: data.sampleTakenIndicator,
                wellIndicator: data.wellIndicator,
                specialCareIndicator: data.specialCareIndicator,
                biologicalIndicator: data.biologicalIndicator,
                aquaticIndicator: data.aquaticIndicator
            };
            return [201, await this.dataController.createObservation(model, req.user)];
        });
    }

    /**
     * @description Route handle to update observation species
     */
    get update(): RouteHandler {
        return this.routeConfig<any>('obs:species-update', async (data: any, req: any) => {
            const model: ObservationUpdateModel = {
                lat: data.lat,
                long: data.long,
                date: data.date,
                length: data.length,
                width: data.width,
                accessDescription: data.accessDescription,
                jurisdiction: req.jurisdictionCode,
                species: req.species,
                observationType: req.validation.observationType,
                speciesAgency: req.validation.speciesAgency,
                density: req.validation.density,
                distribution: req.validation.distribution,
                observationGeometry: req.validation.observationGeometry,
                specificUseCode: req.validation.specificUseCode,
                soilTexture: req.validation.soilTexture,
                observerFirstName: data.observerFirstName,
                observerLastName: data.observerLastName,
                slopeCode: req.validation.slopeCode,
                aspectCode: req.validation.aspectCode,
                proposedAction: req.validation.proposedAction,
                sampleIdentifier: data.sampleIdentifier,
                rangeUnitNumber: data.rangeUnitNumber,
                legacySiteIndicator: data.legacySiteIndicator,
                edrrIndicator: data.edrrIndicator,
                researchIndicator: data.researchIndicator,
                sampleTakenIndicator: data.sampleTakenIndicator,
                wellIndicator: data.wellIndicator,
                specialCareIndicator: data.specialCareIndicator,
                biologicalIndicator: data.biologicalIndicator,
                aquaticIndicator: data.aquaticIndicator
            };
            const observation: Observation = this.validation<any>(req).id as Observation;
            return [200, await this.dataController.update(observation, model, req.user)];
        });
    }
}

/**
 * @description Exposing router object
 */
export const observationModifyRoute = (): Router => ObservationModifyRouteController.shared.router;

// -----------------------------------------------------------------------------------------------------------
