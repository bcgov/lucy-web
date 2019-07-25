import { Injectable } from '@angular/core';
import { Observation } from '../models';

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
    if (!this.hasMinDecimalPlaces(latitude, 5)) {
      return false;
    }
    const regexpOne = new RegExp('^[+-]?((90\\.?0*$)|(([0-8]?[0-9])\\.?[0-9]*$))');
    const regexpOneResult = regexpOne.test(latitude);
    return regexpOneResult;
  }

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal places
   * @param longitude string - * use String(number) if needed.
   */
  public isValidLongitude(longitude: string) {
    if (!this.hasMinDecimalPlaces(longitude, 5)) {
      return false;
    }
    const regexpOne = new RegExp('^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\\.{1}\\d{1,6}');
    const regexpOneResult = regexpOne.test(longitude);
    return regexpOneResult;
  }

   //////////////// End Location Validations ////////////////

  public isValidObservationMessage(observation: Observation): string | null {
    if (!observation) { return `Object does not exist`; }
    const service = new ValidationService();
    if (!service.isValidLongitude(String(observation.long)) || !service.isValidLatitude(String(observation.lat))) {
      return `Location is invalid:\nLatitude and Longitude must have at least 5 decimal.`;
    }

    if (!observation.date) {
      return `Observation date is missing`;
    }

    if (!observation.surveyorFirstName) {
      return `Observer's first name is missing`;
    }

    if (!observation.surveyorLastName) {
      return `Observer's last name is missing`;
    }

    if (!observation.speciesAgency) {
      return `Observer organization is missing`;
    }

    if (!observation.width || !observation.length || !this.isValidPlotDimention(String(observation.length)) || !this.isValidPlotDimention(String(observation.width)) ) {
      return `You must specify a valid plot dimention for invasive plant species`;
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

    if (!observation.surveyType) {
      return `You must add survey type for invasive plant species`;
    }

    if (!observation.surveyGeometry) {
      return `You must add survey geometry type for invasive plant species`;
    }

    if (!observation.specificUseCode) {
      return `You must add specific use code for invasive plant species`;
    }

    if (!observation.soilTexture) {
      return `You must add soil texture for invasive plant species`;
    }
    return null;
  }
}
