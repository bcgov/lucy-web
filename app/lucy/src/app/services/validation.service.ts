import { Injectable } from '@angular/core';
import { Observation } from '../models';
import { MechanicalTreatment } from '../models/MechanicalTreatment';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  //////////////// Number Validations ////////////////

  public isValidNumber(value: string): boolean {
    const toNumber: number = +value;
    return toNumber ? true : false;
  }

  public isValidInteger(value: string): boolean {
    return (this.isValidNumber(value) && this.decimalPlaces(value) === 0);
  }

  public hasMinDecimalPlaces(number: any, minDecimals: number): boolean {
    const service = new ValidationService();
    const numberOfDecimals = service.decimalPlaces(number);
    return numberOfDecimals >= minDecimals;
  }

  public isPositiveNumber(value: string): boolean {
    if (this.isValidNumber(value)) {
      return +value >= 0;
    }
  }

  public isAphaNumeric(value: string): boolean {
    const regexpOne = new RegExp('^[+-]?((90\\.?0*$)|(([0-8]?[0-9])\\.?[0-9]*$))');
    const regexpOneResult = regexpOne.test(value);
    return regexpOneResult;
  }

  /**
   * TODO: Refactor
   * From:
   * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
   * @param n number of decimals
   */
  private decimalPlaces(n: any) {
    const s = `` + (+n);
    const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
    if (!match) { return 0; }
    return Math.max(0,
      (match[1] === '0' ? 0 : (match[1] || '').length)
      - (+match[2] || 0));
  }

  //////////////// End Number Validations ////////////////

  //////////////// Specific Field Validations ////////////////

  public isValidPlotDimention(value: string): boolean {
    return this.isPositiveNumber(value);
  }

  //////////////// End Specific Field Validations ////////////////

  //////////////// Location Validations ////////////////

  public isValidUTMNorthings(value: string): boolean {
    return (this.isValidNumber(value) && value.length < 8);
  }

  public isValidUTMEastings(value: string): boolean {
    return (this.isValidNumber(value) && value.length < 7);
  }

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal place
   * @param latitude string - * use String(number) if needed.
   */
  public isValidLatitude(latitude: string) {
    return +latitude >= 48 && +latitude <= 61;
  }

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal places
   * @param longitude string - * use String(number) if needed.
   */
  public isValidLongitude(longitude: string) {
    return +longitude >= -139 && +longitude <= -114;
  }

  //////////////// End Location Validations ////////////////

  public isValidObservationMessage(observation: Observation): string | null {
    if (!observation) { return `Object does not exist`; }
    const service = new ValidationService();

    //////////////// Basic ////////////////
    // Location
    if (!service.isValidLongitude(String(observation.long))) {
      return `Longitude is invalid:\n*Longitude must be between -139 and -114 and have at least 5 decimals.`;
    }

    if (!service.isValidLatitude(String(observation.lat))) {
      return `Latitude is invalid:\n*Latitude must be between 48 and 61 and have at least 5 decimals.`;
    }
    // Observer
    if (!observation.date) {
      return `Observation date is missing`;
    }

    if (!observation.observerFirstName) {
      return `Observer's first name is missing`;
    }

    if (!observation.observerLastName) {
      return `Observer's last name is missing`;
    }

    // Invasive Plant species
    if (!observation.speciesAgency) {
      return `Observer organization is missing`;
    }

    if (!observation.width || !observation.length || !this.isValidPlotDimention(String(observation.length)) || !this.isValidPlotDimention(String(observation.width))) {
      return `You must specify a valid plot dimension for invasive plant species`;
    }

    if (!observation.jurisdiction) {
      return `You must add a jurisdiction for invasive plant species`;
    }

    if (!observation.species) {
      return `You must add a plant species for invasive plant species`;
    }

    if (!observation.density) {
      return `You must add density for invasive plant species`;
    }

    if (!observation.distribution) {
      return `You must add distribution for invasive plant species`;
    }

    if (!observation.observationType) {
      return `You must add survey type for invasive plant species`;
    }

    if (!observation.specificUseCode) {
      return `You must add specific use code for invasive plant species`;
    }

    if (!observation.soilTexture) {
      return `You must add soil texture for invasive plant species`;
    }

    //////////////// Advanced ////////////////
    if (!observation.proposedAction) {
      return `You must specify a proposed action in advanced data section`;
    }

    if (!observation.aspectCode) {
      return `You must specify an aspect code in advanced data section`;
    }

    if (!observation.slopeCode) {
      return `You must specify a slope code in advanced data section`;
    }

    if (!observation.observationGeometry) {
      return `You must specify survey geometry in advanced data section`;
    }
    console.dir(observation);
    if (observation.sampleTakenIndicator) {
      if (observation.sampleIdentifier === undefined || observation.sampleIdentifier === `` ) {
          return `Please provide a sample identifier for the sample identified in advanced section`;
        }
    }

    return null;
  }

  public isValidMechanicalTreatmentMessage(mechanicalTreatment: MechanicalTreatment): string | null {
    if (!mechanicalTreatment) { return `Object does not exist`; }

    if (!mechanicalTreatment.latitude) {
      return `Treatment location is missing`;
    }

    if (!mechanicalTreatment.longitude) {
      return `Treatment location is missing`;
    }

    if (!mechanicalTreatment.width) {
      return `Treatment width is missing`;
    }

    if (!mechanicalTreatment.length) {
      return `Treatment length is missing`;
    }

    if (!mechanicalTreatment.applicatorFirstName) {
      return `Applicator First Name is missing`;
    }

    if (!mechanicalTreatment.applicatorLastName) {
      return `Applicator Last Name is missing`;
    }

    if (!mechanicalTreatment.date) {
      return `Treatment date is missing`;
    }
 ///
    if (!mechanicalTreatment.paperFileReference) {
      return `Paper File Reference is missing`;
    }

    if (!mechanicalTreatment.comment) {
      return `comment is missing`;
    }

    if (!mechanicalTreatment.observation) {
      return `observation is missing`;
    }

    if (!mechanicalTreatment.species) {
      return `species is missing`;
    }

    if (!mechanicalTreatment.speciesAgency) {
      return `Species Agency is missing`;
    }

    if (!mechanicalTreatment.mechanicalMethod) {
      return `Mechanical Method is missing`;
    }

    return null;
  }
}
