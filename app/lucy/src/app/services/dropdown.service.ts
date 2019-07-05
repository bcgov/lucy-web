import { Injectable } from '@angular/core';
import { Jurisdiction, InvasivePlantSpecies } from '../models';

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
  private juristictions: Jurisdiction[];
  private invasivePlantSpecies: InvasivePlantSpecies[];
  private surveyModes: string[];
  private soilTextureCodes: string[];
  private specificUseCodes: string[];
  private distributions: string[];
  private densities: string[];
  private test: DropdownObject[];

  constructor() { }

  public createDropdownObjectsFrom(objects: any[], displayValue: string): DropdownObject[] {
    const dropdownObjects: DropdownObject[] = [];
    for (const object of objects) {
      dropdownObjects.push( {
        name: object[displayValue],
        object: object,
      });
    }
    return dropdownObjects;
  }

  /**
   * TODO: Incomplete
   */
  public async getJuristictions(): Promise<DropdownObject[]> {
    return this.createDropdownObjectsFrom(this.getDummyJuristictions(), 'Code');
  }

  /**
   * TODO: Incomplete
   */
  public async getInvasivePlantSpecies(): Promise<DropdownObject[]> {
    return this.createDropdownObjectsFrom(this.getDummyInvasivePlantSpecies(), 'species');
  }

  /**
   * TODO: Incomplete
   */
  public async getSurveyModes(): Promise<DropdownObject[]> {
    return [];
    // return ['Operational', 'Non Operational'];
  }

   /**
   * TODO: Incomplete
   */
  public async getSoilTextureCodes(): Promise<DropdownObject[]> {
    return [];
    // return ['01-Quick Description', '02-Slow Description', '03-Regular Description'];
  }

   /**
   * TODO: Incomplete
   */
  public async getSpecificUseCodes(): Promise<DropdownObject[]> {
    return [];
    // return ['Gravel Pit', 'Grass', 'Corn Field'];
  }

   /**
   * TODO: Incomplete
   */
  public async getDistributions(): Promise<DropdownObject[]> {
    return [];
    // return ['Low', 'Medium', 'High'];
  }

  /**
   * TODO: Incomplete
   */
  public async getDensities(): Promise<DropdownObject[]> {
    return [];
    // return ['Low', 'Medium', 'High'];
  }

  private getDummyJuristictions(): Jurisdiction[] {
    return ([
      {
        juristiction_id: 1,
        Code: `FLNRO`,
        description: `describing`,
      },
      {
        juristiction_id: 2,
        Code: `NRS`,
        description: `describing`,
      }
    ]);
  }

  private getDummyInvasivePlantSpecies(): InvasivePlantSpecies[] {
    return ([
      {
        species_id: 1,
        mapCode: `code`,
        earlyDetection: 2,
        containmentSpecies: 2,
        containmentSpacialRef: 2,
        species: `Green Flower`,
        genus: `floraris`,
        commonName: `flower`,
        latinName: `florarum`,
      },
      {
        species_id: 2,
        mapCode: `code`,
        earlyDetection: 2,
        containmentSpecies: 2,
        containmentSpacialRef: 2,
        species: `Red Flower`,
        genus: `floraris`,
        commonName: `flower`,
        latinName: `florarum`,
      },
      {
        species_id: 3,
        mapCode: `code`,
        earlyDetection: 2,
        containmentSpecies: 2,
        containmentSpacialRef: 2,
        species: `Purple Flower`,
        genus: `floraris`,
        commonName: `flower`,
        latinName: `florarum`,
      },
    ]);
  }
}
