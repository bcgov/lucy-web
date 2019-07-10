import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { ObjectValidatorService } from './object-validator.service';
import { AppConstants } from '../constants';
import { Jurisdiction, InvasivePlantSpecies } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CodeTableService {

  private juristictions: Jurisdiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];

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

    const juristictionCodes = codes['jurisdictionCodes'];
    if ( juristictionCodes && (Array.isArray(juristictionCodes) && this.objectValidator.isJurisdictionObject(juristictionCodes[0]))) {
      this.juristictions = juristictionCodes;
      return this.juristictions;
    }
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

    const speciesCodes = codes['speciesList'];
    if ( speciesCodes && (Array.isArray(speciesCodes) && this.objectValidator.isInvasivePlantSpeciesObject(speciesCodes[0]))) {
      this.invasivePlantSpecies = speciesCodes;
      return speciesCodes;
    }
  }
}
