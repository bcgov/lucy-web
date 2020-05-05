/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { ObjectValidatorService } from './object-validator.service';
import { AppConstants } from '../constants';
import {
  Jurisdiction, InvasivePlantSpecies, SpeciesDensityCodes,
  SpeciesDistributionCodes, SpeciesAgencyCodes, ObservationTypeCodes,
  SoilTextureCodes, ObservationGeometryCodes, SpecificUseCodes,
  ProposedActionCodes, AspectCodes, SlopeCodes,
} from '../models';
import { EfficacyCodes } from '../models/Monitor';
import { MechanicalTreatmentMethodsCodes, MechanicalDisposalMethodsCodes, MechanicalSoilDisturbanceCodes, MechanicalRootRemovalCodes, MechanicalIssueCodes, MechanicalTreatmentProviders } from '../models/MechanicalTreatment';
import { HerbicideCodes } from 'src/app/models/ChemicalTreatment';
import { PreviousAISKnowledgeSource, PreviousInspectionSource, AdultMusselsLocation } from '../models/musselInspect';
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CodeTableService {

  private juristictions: Jurisdiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];
  private agencies: SpeciesAgencyCodes[];
  private density: SpeciesDensityCodes[];
  private distributions: SpeciesDistributionCodes[];

  private surveyTypes: ObservationTypeCodes[];
  private soilTextures: SoilTextureCodes[];
  private geometries: ObservationGeometryCodes[];
  private useCodes: SpecificUseCodes[];

  private proposedActions: ProposedActionCodes[];
  private groundAspects: AspectCodes[];
  private groundSlope: SlopeCodes[];

  private mechanicalTreatmentMethodsCodes: MechanicalTreatmentMethodsCodes[];
  private mechanicalDisposalMethodCodes: MechanicalDisposalMethodsCodes[];
  private mechanicalSoilDisturbanceCodes: MechanicalSoilDisturbanceCodes[];
  private mechanicalRootRemovalCodes: MechanicalRootRemovalCodes[];
  private mechanicalIssueCodes: MechanicalIssueCodes[];
  private mechanicalTreatmentProviders: MechanicalTreatmentProviders[];

  private herbicideCodes: HerbicideCodes[];

  private efficacyCodes: EfficacyCodes[];

  private previousAISKnowledgeSources: PreviousAISKnowledgeSource[];
  private previousInspectionSources: PreviousInspectionSource[];
  private musselFoundLocations: AdultMusselsLocation[];

  private codeTables: any | null = null;

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  /**
   * Ge all codes.
   *
   * Result is cached and returned next time the function is called.
   */
  private async getCodes(): Promise<any | null> {
    if (this.codeTables !== null) {
      return this.codeTables;
    }

    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_CodeTables, null);
    if (response.success) {
      this.codeTables = response.response;
      return response.response;
    } else {
      return null;
    }
  }

  public async getCodeTable(key: string): Promise<any[]> {
    const codes = await this.getCodes();
    if (codes === null) {
      console.dir('not found');
      return [];
    }
    return codes[key] ? codes[key] : [];
  }

  /**
   * Get Codes (all code tables)
   * and return Juristictions.
   *
   * Result is cached and returned next time the function is called.
   */
  public async getJuristictions(): Promise<Jurisdiction[]> {
    if (this.juristictions && this.juristictions.length > 0) {
      return this.juristictions;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const juristictionCodes = codes.JurisdictionCode;
    if (juristictionCodes && (Array.isArray(juristictionCodes) && this.objectValidator.isJurisdictionObject(juristictionCodes[0]))) {
      this.juristictions = juristictionCodes;
      return this.juristictions;
    }
    return [];
  }

  /**
   * Get Codes (all code tables)
   * and return species list.
   *
   * Result is cached and returned next time the function is called.
   */
  public async getInvasivePlantSpecies(): Promise<InvasivePlantSpecies[]> {
    if (this.invasivePlantSpecies && this.invasivePlantSpecies.length > 0) {
      return this.invasivePlantSpecies;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const speciesCodes = codes.Species;
    if (speciesCodes && (Array.isArray(speciesCodes) && this.objectValidator.isInvasivePlantSpeciesObject(speciesCodes[0]))) {
      this.invasivePlantSpecies = speciesCodes;
      return speciesCodes;
    }
    return [];
  }

  public async getHerbicideCodes(): Promise<HerbicideCodes[]> {
    if (this.herbicideCodes && this.herbicideCodes.length > 0) {
      return this.herbicideCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const herbicideCodes = codes.Herbicide;
    if (herbicideCodes && (Array.isArray(herbicideCodes) && this.objectValidator.isHerbicideObject(herbicideCodes[0]))) {
      this.herbicideCodes = herbicideCodes;
      return herbicideCodes;
    }
    return [];
  }

  public async getHerbicideWithId(id: number): Promise<HerbicideCodes> {
    const herbicide = this.herbicideCodes.filter(item => item.herbicide_id === id)[0];
    return herbicide;
  }

  public async getDensityCodes(): Promise<SpeciesDensityCodes[]> {
    if (this.density && this.density.length > 0) {
      return this.density;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const densityCodes = codes.SpeciesDensityCode;
    if (densityCodes && (Array.isArray(densityCodes) && this.objectValidator.isSpeciesDensityCodeObject(densityCodes[0]))) {
      this.density = densityCodes;
      return densityCodes;
    }
    return [];
  }

  public async getDistributionCodes(): Promise<SpeciesDistributionCodes[]> {
    if (this.distributions && this.distributions.length > 0) {
      return this.distributions;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const distributionCodes = codes.SpeciesDistributionCode;
    if (distributionCodes && (Array.isArray(distributionCodes) && this.objectValidator.isSpeciesDistributionCodeObject(distributionCodes[0]))) {
      this.distributions = distributionCodes;
      return distributionCodes;
    }
    return [];
  }

  public async getSpeciesAgencyCodes(): Promise<SpeciesAgencyCodes[]> {
    if (this.agencies && this.agencies.length > 0) {
      return this.agencies;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const agencies = codes.SpeciesAgencyCode;
    if (agencies && (Array.isArray(agencies) && this.objectValidator.isSpeciesAgencyCodeObject(agencies[0]))) {
      this.agencies = agencies;
      return agencies;
    }
    return this.agencies;
  }

  public async getEfficacyCodes(): Promise<EfficacyCodes[]> {
    if (this.efficacyCodes && this.efficacyCodes.length > 0) {
      return this.efficacyCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const efficacyCodes = codes.EfficacyCodes;
    if (efficacyCodes && (Array.isArray(efficacyCodes) && this.objectValidator.isEfficacyCodesObject(efficacyCodes[0]))) {
      this.efficacyCodes = efficacyCodes;
      return efficacyCodes;
    }
    return this.efficacyCodes;
  }

  public async getObservationTypeCodes(): Promise<ObservationTypeCodes[]> {
    if (this.surveyTypes && this.surveyTypes.length > 0) {
      return this.surveyTypes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const surveyTypes = codes.ObservationTypeCode;
    if (surveyTypes && (Array.isArray(surveyTypes) && this.objectValidator.isObservationTypeCodesObject(surveyTypes[0]))) {
      this.surveyTypes = surveyTypes;
      return surveyTypes;
    }
    return this.surveyTypes;
  }

  public async getSoilTextureCodes(): Promise<SoilTextureCodes[]> {
    if (this.soilTextures && this.soilTextures.length > 0) {
      return this.soilTextures;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const soilTextures = codes.SoilTextureCode;
    if (soilTextures && (Array.isArray(soilTextures) && this.objectValidator.isSoilTextureCodesObject(soilTextures[0]))) {
      this.soilTextures = soilTextures;
      return soilTextures;
    }
    return this.soilTextures;
  }

  public async observationGeometryCodes(): Promise<ObservationGeometryCodes[]> {
    if (this.geometries && this.geometries.length > 0) {
      return this.geometries;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const geometries = codes.ObservationGeometryCode;
    if (geometries && (Array.isArray(geometries) && this.objectValidator.isObservationGeometryCodesObject(geometries[0]))) {
      this.geometries = geometries;
      return geometries;
    }
    return this.geometries;
  }

  public async getSpecificUseCodes(): Promise<SpecificUseCodes[]> {
    if (this.useCodes && this.useCodes.length > 0) {
      return this.useCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const useCodes = codes.SpecificUseCode;
    if (useCodes && (Array.isArray(useCodes) && this.objectValidator.isSpecificUseCodesObject(useCodes[0]))) {
      this.useCodes = useCodes;
      return useCodes;
    }
    return this.useCodes;
  }

  public async getProposedActionCodes(): Promise<ProposedActionCodes[]> {
    if (this.proposedActions && this.proposedActions.length > 0) {
      return this.proposedActions;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const proposedActions = codes.ProposedActionCode;
    if (proposedActions && (Array.isArray(proposedActions) && this.objectValidator.isProposedActionCodesObject(proposedActions[0]))) {
      this.proposedActions = proposedActions;
      return proposedActions;
    }
    return this.proposedActions;
  }

  public async getMechanicalTreatmentMethodsCodes(): Promise<MechanicalTreatmentMethodsCodes[]> {
    if (this.mechanicalTreatmentMethodsCodes && this.mechanicalTreatmentMethodsCodes.length > 0) {
      return this.mechanicalTreatmentMethodsCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalTreatmentMethodsCodes = codes.MechanicalMethodCode;
    if (mechanicalTreatmentMethodsCodes && (Array.isArray(mechanicalTreatmentMethodsCodes) && this.objectValidator.isMechanicalTreatmentMethodsCodes(mechanicalTreatmentMethodsCodes[0]))) {
      this.mechanicalTreatmentMethodsCodes = mechanicalTreatmentMethodsCodes;
      return mechanicalTreatmentMethodsCodes;
    }
    return this.mechanicalTreatmentMethodsCodes;
  }

  public async getGroundSlopeCodes(): Promise<SlopeCodes[]> {
    if (this.groundSlope && this.groundSlope.length > 0) {
      return this.groundSlope;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const groundSlope = codes.SlopeCode;
    if (groundSlope && (Array.isArray(groundSlope) && this.objectValidator.isGroundSlopeCodesObject(groundSlope[0]))) {
      this.groundSlope = groundSlope;
      return groundSlope;
    }
    return this.groundSlope;
  }

  public async getGroundAspectCodes(): Promise<AspectCodes[]> {
    if (this.groundAspects && this.groundAspects.length > 0) {
      return this.groundAspects;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const groundAspects = codes.AspectCode;
    if (groundAspects && (Array.isArray(groundAspects) && this.objectValidator.isGroundAspectCodesObject(groundAspects[0]))) {
      this.groundAspects = groundAspects;
      return groundAspects;
    }
    return this.groundAspects;
  }


  public async getMechanicalDisposalMethodCodes(): Promise<MechanicalDisposalMethodsCodes[]> {
    if (this.mechanicalDisposalMethodCodes && this.mechanicalDisposalMethodCodes.length > 0) {
      return this.mechanicalDisposalMethodCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalDisposalMethods = codes.MechanicalDisposalMethodCode;
    if (mechanicalDisposalMethods && (Array.isArray(mechanicalDisposalMethods) && this.objectValidator.isMechanicalDisposalMethodCodesObject(mechanicalDisposalMethods[0]))) {
      this.mechanicalDisposalMethodCodes = mechanicalDisposalMethods;
      return mechanicalDisposalMethods;
    }
    return this.mechanicalDisposalMethodCodes;
  }

  public async getMechanicalSoilDisturbanceCodes(): Promise<MechanicalSoilDisturbanceCodes[]> {
    if (this.mechanicalSoilDisturbanceCodes && this.mechanicalSoilDisturbanceCodes.length > 0) {
      return this.mechanicalSoilDisturbanceCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalSoilDisturbanceCodes = codes.MechanicalSoilDisturbanceCode;
    if (mechanicalSoilDisturbanceCodes && (Array.isArray(mechanicalSoilDisturbanceCodes) && this.objectValidator.isMechanicalSoilDisturbanceCodesObject(mechanicalSoilDisturbanceCodes[0]))) {
      this.mechanicalSoilDisturbanceCodes = mechanicalSoilDisturbanceCodes;
      return mechanicalSoilDisturbanceCodes;
    }
    return this.mechanicalSoilDisturbanceCodes;
  }

  public async getsMechanicalRootRemovalCodesCodes(): Promise<MechanicalRootRemovalCodes[]> {
    if (this.mechanicalRootRemovalCodes && this.mechanicalRootRemovalCodes.length > 0) {
      return this.mechanicalRootRemovalCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalRootRemovalCodes = codes.MechanicalRootRemovalCode;
    if (mechanicalRootRemovalCodes && (Array.isArray(mechanicalRootRemovalCodes) && this.objectValidator.isMechanicalRootRemovalCodesObject(mechanicalRootRemovalCodes[0]))) {
      this.mechanicalRootRemovalCodes = mechanicalRootRemovalCodes;
      return mechanicalRootRemovalCodes;
    }
    return this.mechanicalRootRemovalCodes;
  }

  public async getMechanicalIssueCodesCodes(): Promise<MechanicalIssueCodes[]> {
    if (this.mechanicalIssueCodes && this.mechanicalIssueCodes.length > 0) {
      return this.mechanicalIssueCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalIssueCodes = codes.MechanicalTreatmentIssueCode;
    if (mechanicalIssueCodes && (Array.isArray(mechanicalIssueCodes) && this.objectValidator.isMechanicalIssueCodesObject(mechanicalIssueCodes[0]))) {
      this.mechanicalIssueCodes = mechanicalIssueCodes;
      return mechanicalIssueCodes;
    }
    return this.mechanicalIssueCodes;
  }

  public async getMechanicalTreatmentProviderCodes(): Promise<MechanicalTreatmentProviders[]> {
    if (this.mechanicalTreatmentProviders && this.mechanicalTreatmentProviders.length > 0) {
      return this.mechanicalTreatmentProviders;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const mechanicalTreatmentProviders = codes.TreatmentProviderContractor;
    if (mechanicalTreatmentProviders && (Array.isArray(mechanicalTreatmentProviders) && this.objectValidator.isMechanicalTreatmentProvidersObject(mechanicalTreatmentProviders[0]))) {
      this.mechanicalTreatmentProviders = mechanicalTreatmentProviders;
      return mechanicalTreatmentProviders;
    }
    return this.mechanicalTreatmentProviders;
  }

  public async getPreviousAISKnowledgeSourceCodes(): Promise<PreviousAISKnowledgeSource[]> {
    if (this.previousAISKnowledgeSources && this.previousAISKnowledgeSources.length > 0) {
      return this.previousAISKnowledgeSources;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const previousAISKnowledgeSources = codes.previousAISKnowledgeSources;
    if (previousAISKnowledgeSources && (Array.isArray(previousAISKnowledgeSources) && this.objectValidator.isPreviousAISKnowledgeSourceObject(previousAISKnowledgeSources[0]))) {
      return previousAISKnowledgeSources;
    }
  }

  public async getPreviousInspectionSourceCodes(): Promise<PreviousInspectionSource[]> {
    if (this.previousInspectionSources && this.previousInspectionSources.length > 0) {
      return this.previousInspectionSources;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const previousInspectionSources = codes.previousInspectionSources;
    if (previousInspectionSources && (Array.isArray(previousInspectionSources) && this.objectValidator.isPreviousInspectionSourceObject(previousInspectionSources[0]))) {
      return previousInspectionSources;
    }
  }

  public async getAdultMusselsLocationCodes(): Promise<AdultMusselsLocation[]> {
    if (this.musselFoundLocations && this.musselFoundLocations.length > 0) {
      return this.musselFoundLocations;
    }

    const codes = await this.getCodes();
    if (codes === null) {
      return [];
    }

    const musselFoundLocations = codes.musselFoundLocations;
    if (musselFoundLocations && (Array.isArray(musselFoundLocations) && this.objectValidator.isAdultMusselsLocationObject(musselFoundLocations[0]))) {
      return musselFoundLocations;
    }
  }
}
