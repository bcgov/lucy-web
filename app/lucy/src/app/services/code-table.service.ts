import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { ObjectValidatorService } from './object-validator.service';
import { AppConstants } from '../constants';
import { Jurisdiction, InvasivePlantSpecies, SpeciesDensityCodes, SpeciesDistributionCodes, SpeciesAgencyCodes, SurveyTypeCodes, SoilTextureCodes, SurveyGeometryCodes, SpecificUseCodes } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CodeTableService {

  private juristictions: Jurisdiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];
  private agencies: SpeciesAgencyCodes[];
  private density: SpeciesDensityCodes[];
  private distributions: SpeciesDistributionCodes[];

  private surveyTypes: SurveyTypeCodes[];
  private soilTextures: SoilTextureCodes[];
  private geometries: SurveyGeometryCodes[];
  private useCodes: SpecificUseCodes[];

  private codeTables: any| null = null;

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

    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observationCodes, null);
    if (response.success) {
      this.codeTables = response.response;
      return response.response;
    } else {
      return null;
    }
  }

  /**
   * Get Codes (all code tables)
   * and return Juristictions.
   *
   * Result is cached and returned next time the function is called.
   */
  public async getJuristictions(): Promise<Jurisdiction[]> {
    if (this.juristictions && this.juristictions.length > 0 ) {
      return this.juristictions;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const juristictionCodes = codes.jurisdictionCodes;
    if ( juristictionCodes && (Array.isArray(juristictionCodes) && this.objectValidator.isJurisdictionObject(juristictionCodes[0]))) {
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
    if (this.invasivePlantSpecies && this.invasivePlantSpecies.length > 0 ) {
      return this.invasivePlantSpecies;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const speciesCodes = codes.speciesList;
    if ( speciesCodes && (Array.isArray(speciesCodes) && this.objectValidator.isInvasivePlantSpeciesObject(speciesCodes[0]))) {
      this.invasivePlantSpecies = speciesCodes;
      return speciesCodes;
    }
    return [];
  }

  public async getDensityCodes(): Promise<SpeciesDensityCodes[]> {
    if (this.density && this.density.length > 0 ) {
      return this.density;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const densityCodes = codes.speciesDensityCodes;
    if ( densityCodes && (Array.isArray(densityCodes) && this.objectValidator.isSpeciesDensityCodeObject(densityCodes[0]))) {
      this.density = densityCodes;
      return densityCodes;
    }
    return [];
  }

  public async getDistributionCodes(): Promise<SpeciesDistributionCodes[]> {
    if (this.distributions && this.distributions.length > 0 ) {
      return this.distributions;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const distributionCodes = codes.speciesDistributionCodes;
    if ( distributionCodes && (Array.isArray(distributionCodes) && this.objectValidator.isSpeciesDistributionCodeObject(distributionCodes[0]))) {
      this.distributions = distributionCodes;
      return distributionCodes;
    }
    return [];
  }

  public async getSpeciesAgencyCodes(): Promise<SpeciesAgencyCodes[]> {
    if (this.agencies && this.agencies.length > 0 ) {
      return this.agencies;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const agencies = codes.speciesAgencyCodes;
    if ( agencies && (Array.isArray(agencies) && this.objectValidator.isSpeciesAgencyCodeObject(agencies[0]))) {
      this.agencies = agencies;
      return agencies;
    }
    return this.agencies;
  }

  public async getSurveyTypeCodes(): Promise<SurveyTypeCodes[]> {
    if (this.surveyTypes && this.surveyTypes.length > 0 ) {
      return this.surveyTypes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const surveyTypes = codes.surveyTypeCodes;
    if ( surveyTypes && (Array.isArray(surveyTypes) && this.objectValidator.isSurveyTypeCodesObject(surveyTypes[0]))) {
      this.surveyTypes = surveyTypes;
      return surveyTypes;
    }
    return this.surveyTypes;
  }

  public async getSoilTextureCodes(): Promise<SoilTextureCodes[]> {
    if (this.soilTextures && this.soilTextures.length > 0 ) {
      return this.soilTextures;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const soilTextures = codes.soilTextureCodes;
    if ( soilTextures && (Array.isArray(soilTextures) && this.objectValidator.isSoilTextureCodesObject(soilTextures[0]))) {
      this.soilTextures = soilTextures;
      return soilTextures;
    }
    return this.soilTextures;
  }

  public async getSurveyGeometryCodes(): Promise<SurveyGeometryCodes[]> {
    if (this.geometries && this.geometries.length > 0 ) {
      return this.geometries;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const geometries = codes.surveyGeometryCodes;
    if ( geometries && (Array.isArray(geometries) && this.objectValidator.isSurveyGeometryCodesObject(geometries[0]))) {
      this.geometries = geometries;
      return geometries;
    }
    return this.geometries;
  }

  public async getSpecificUseCodes(): Promise<SpecificUseCodes[]> {
    if (this.useCodes && this.useCodes.length > 0 ) {
      return this.useCodes;
    }

    const codes = await this.getCodes();
    if (codes === null) {
       return [];
    }

    const useCodes = codes.specificUseCodes;
    if ( useCodes && (Array.isArray(useCodes) && this.objectValidator.isSpecificUseCodesObject(useCodes[0]))) {
      this.useCodes = useCodes;
      return useCodes;
    }
    return this.useCodes;
  }
}
