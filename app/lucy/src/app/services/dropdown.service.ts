import { Injectable } from '@angular/core';
import { Juristiction, InvasivePlantSpecies } from '../models';

export interface DropdownObject {
  name: string;
  object: any;
}

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  /**
   * TODO: Everything is Incomplete
   */
  private juristictions: Juristiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];
  private surveyModes: string[];
  private soilTextureCodes: string[];
  private specificUseCodes: string[];
  private distributions: string[];
  private densities: string[];
  private test: DropdownObject[];

  constructor() { }

  private createDropdownObjectsFrom(objects: any[], displayValue: string) {
    const dropdownObjects: DropdownObject[] = [];
    for (const object of objects) {
      dropdownObjects.push( {
        name: object[displayValue],
        object: object,
      });
    }
  }

  /**
   * TODO: Incomplete
   */
  public async getJuristictions(): Promise<Juristiction[]> {
    return [];
  }

  /**
   * TODO: Incomplete
   */
  public async getInvasivePlantSpecies(): Promise<InvasivePlantSpecies[]> {
    return [];
  }

  /**
   * TODO: Incomplete
   */
  public async getSurveyModes(): Promise<string[]> {
    return ['Operational', 'Non Operational'];
  }

   /**
   * TODO: Incomplete
   */
  public async getSoilTextureCodes(): Promise<string[]> {
    return ['01-Quick Description', '02-Slow Description', '03-Regular Description'];
  }

   /**
   * TODO: Incomplete
   */
  public async getSpecificUseCodes(): Promise<string[]> {
    return ['Gravel Pit', 'Grass', 'Corn Field'];
  }

   /**
   * TODO: Incomplete
   */
  public async getDistributions(): Promise<string[]> {
    return ['Low', 'Medium', 'High'];
  }

  /**
   * TODO: Incomplete
   */
  public async getDensities(): Promise<string[]> {
    return ['Low', 'Medium', 'High'];
  }

}
