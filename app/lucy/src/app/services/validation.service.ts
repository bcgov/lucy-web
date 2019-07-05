import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public isValidNumber(string: string): boolean {
    const toNumber: number = +string;
    return toNumber ? true : false;
  }

  public hasMinDecimalPlaces(number: any, minDecimals: number): boolean {
    const numberOfDecimals = this.decimalPlaces(number);
    return numberOfDecimals >= minDecimals;
  }

  /**
   * TODO: Refactor
   * From:
   * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
   * @param n
   */
  private decimalPlaces(n) {
    // Make sure it is a number and use the builtin number -> string.
    let s = `` + (+n);
    // Pull out the fraction and the exponent.
    const match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
    // NaN or Infinity or integer.
    // We arbitrarily decide that Infinity is integral.
    if (!match) { return 0; }
    // Count the number of digits in the fraction and subtract the
    // exponent to simulate moving the decimal point left by exponent places.
    // 1.234e+2 has 1 fraction digit and '234'.length -  2 == 1
    // 1.234e-2 has 5 fraction digit and '234'.length - -2 == 5
    return Math.max(
      0,  // lower limit.
      (match[1] === '0' ? 0 : (match[1] || '').length)  // fraction length
      - (+match[2] || 0));  // exponent
  }

  /**
   * TODO: Refactor/ find better validation
   * @param latitude string - * use String(number) if needed.
   */
  public isValidLatitude(latitude: string) {
    const regexpOne = new RegExp('^[+-]?((90\\.?0*$)|(([0-8]?[0-9])\\.?[0-9]*$))');
    const regexpOneResult = regexpOne.test(latitude);
    // console.log(regexpOneResult);
    return regexpOneResult;

    const regexpTwo = new RegExp('^(\\+|-)?(\\d\.\\d{1,6}|[1-8]\\d\\.\\d{1,6}|90\\.0{1,6})$');
    const regexpTwoResult = regexpTwo.test(latitude);
    console.log(regexpTwoResult);

    if (!regexpTwoResult || !regexpOneResult) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * TODO: Refactor/ find better validation
   * @param longitude string - * use String(number) if needed.
   */
  public isValidLongitude(longitude: string) {
    const regexpOne = new RegExp('^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\\.{1}\\d{1,6}');
    const regexpOneResult = regexpOne.test(longitude);
    console.log(regexpOneResult);

    const regexpTwo = new RegExp('^[+-]?((180\\.?0*$)|(((1[0-7][0-9])|([0-9]{0,2}))\\.?[0-9]*$))');
    const regexpTwoResult = regexpTwo.test(longitude);
    console.log(regexpTwoResult);

    if (!regexpTwoResult || !regexpOneResult) {
      return false;
    } else {
      return true;
    }
  }
}
