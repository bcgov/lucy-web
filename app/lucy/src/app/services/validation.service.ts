import { Injectable } from '@angular/core';
import { Observation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public isValidNumber(string: string): boolean {
    const toNumber: number = +string;
    return toNumber ? true : false;
  }

  public isValidInteger(string: string): boolean {
    return (this.isValidNumber(string) && this.decimalPlaces(string) === 0);
  }

  public isValidUTMNorthings(string: string): boolean {
    return (this.isValidNumber(string) && string.length < 8);
  }

  public isValidUTMEastings(string: string): boolean {
    return (this.isValidNumber(string) && string.length < 7);
  }

  public hasMinDecimalPlaces(number: any, minDecimals: number): boolean {
    const service = new ValidationService();
    const numberOfDecimals = service.decimalPlaces(number);
    return numberOfDecimals >= minDecimals;
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

  /**
   * TODO: Refactor/ find better validation
   * Allow 5 or more decimal place
   * @param latitude string - * use String(number) if needed.
   */
  public isValidLatitude(latitude: string) {
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
    const regexpOne = new RegExp('^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\\.{1}\\d{1,6}');
    const regexpOneResult = regexpOne.test(longitude);
    return regexpOneResult;
  }

  public isValidObservationMessage(observation: Observation): string | null {
    if (!observation) { return `Object does not exist`; }
    const service = new ValidationService();
    if (!service.hasMinDecimalPlaces(observation.lat, 6) || !service.hasMinDecimalPlaces(observation.long, 6)) {
      return `Location is invalid`;
    }

    if (!observation.date) {
      return `Observation date is missing`;
    }

    if (!observation.observerFirstName) {
      return `Observer's first name is missing`;
    }

    if (!observation.observerLastName) {
      return `Observer's last name is missing`;
    }

    if (!observation.observerOrganization) {
      return `Observer organization is missing`;
    }

    if (observation.speciesObservations.length < 1) {
      return `You must add an invasive plant species`;
    }

    for (const species of observation.speciesObservations) {
      if (!species.width || !species.length) {
        return `You must specify Plot for invasive plant species`;
      }

      if (!species.jurisdiction) {
        return `You must add a jurisdiction for invasive plant species`;
      }

      if (!species.species) {
        return `You must add a plant species for invasive plant species`;
      }

      if (!species.density) {
        return `You must add density for invasive plant species`;
      }

      if (!species.distribution) {
        return `You must add distribution for invasive plant species`;
      }

      if (!species.surveyType) {
        return `You must add survey type for invasive plant species`;
      }

      if (!species.surveyGeometry) {
        return `You must add survey geometry type for invasive plant species`;
      }

      if (!species.specificUseCode) {
        return `You must add specific use code for invasive plant species`;
      }

      if (!species.soilTexture) {
        return `You must add soil texture for invasive plant species`;
      }
    }
    return null;
  }
}
