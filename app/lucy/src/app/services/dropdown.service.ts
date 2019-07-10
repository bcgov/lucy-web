import { Injectable } from '@angular/core';
import { Jurisdiction, InvasivePlantSpecies } from '../models';
import { CodeTableService } from './code-table.service';

export interface DropdownObject {
  name: string;
  object: any;
}

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  public displayedJuristictionsField = `code`;
  public displayedInvasivePlantspeciesField = `latinName`;

  constructor(private codeTableService: CodeTableService) { }

  /**
   * Create an array of dropdown objects from an array of objects.
   * @param objects array of objects
   * @param displayValue field in objects that should be displayed in dropdown
   */
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
   * Fetch juristictions code table, return as array of
   * deopdown objects
   */
  public async getJuristictions(): Promise<DropdownObject[]> {
    const jurisdictions = await this.codeTableService.getJuristictions();
    return this.createDropdownObjectsFrom(jurisdictions, this.displayedJuristictionsField);
  }

  /**
   * Fetch invasive plant species code table, return as array of
   * deopdown objects
   */
  public async getInvasivePlantSpecies(): Promise<DropdownObject[]> {
    const invasivePlantSpecies =  await this.codeTableService.getInvasivePlantSpecies();
    return this.createDropdownObjectsFrom(invasivePlantSpecies, this.displayedInvasivePlantspeciesField);
  }

  /**
   * TODO: Incomplete
   */
  public async getSurveyModes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getSoilTextureCodes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getSpecificUseCodes(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

   /**
   * TODO: Incomplete
   */
  public async getDistributions(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

  /**
   * TODO: Incomplete
   */
  public async getDensities(): Promise<DropdownObject[]> {
    return this.getDummyDropdownObjects();
  }

  /**
   * Return array of dropdowns to use for testing.
   */
  public async getDummyDropdownObjects(): Promise<DropdownObject[]> {
    const dropdownObjects: DropdownObject[] = [];
    dropdownObjects.push( {
      name: `NOT YET IMPLEMENTED.`,
      object: 'item Zero',
    });
    dropdownObjects.push( {
      name: `Item One`,
      object: 'item One',
    });
    dropdownObjects.push( {
      name: `Item Two`,
      object: 'item Two',
    });
    dropdownObjects.push( {
      name: `Item Three`,
      object: 'item Three',
    });
    dropdownObjects.push( {
      name: `Item Four`,
      object: 'item Four',
    });
    return dropdownObjects;
  }
}
