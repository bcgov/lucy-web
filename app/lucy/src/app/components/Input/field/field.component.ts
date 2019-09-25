import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit, AfterViewInit {

  // Output
  @Output() valueChanged = new EventEmitter<string>();
  // Optional Input
  @Input() editable = true;
  // Optional Input
  @Input() multiline = false;
  // Field header
  @Input() header = '';

  ///// Verification
  private _verification: any;
  // Get
  get verification(): any {
    return this._verification;
  }
  // Set
  @Input() set verification(object: any) {
    this._verification = object;
    this.setMaterialVerifications();
  }

  private _required = false;
  get required(): boolean {
    return this._required;
  }
  @Input() set required(value: boolean) {
    if (value) {
      this._required = value;
    }
  }

  get fieldId(): string {
    return this.header;
  }

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  // Get
  get mode(): FormMode {
    return this._mode;
  }
  // Set
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  get readonly(): boolean {
    if (this.mode === FormMode.View) {
      return true;
    } else {
      return !this.editable;
    }
  }

  ///// Value
  private _value = ``;
  // Get
  get value(): string {
    return this._value;
  }
  // Set
  @Input() set value(value: string) {
    this._value = value;
    console.log(value);
    this.valueChanged.emit(value);
  }
  ////////////////////

  /**
   * Used in Multi-line
   */
  get isValid(): boolean {
    if (this.value === undefined || this.value === ``) {
      return false;
    } else {
      return true;
    }
  }

  ///// Form Control
  private _fieldFormControl: FormControl;
  // Get
  get fieldFormControl(): FormControl {
    return this._fieldFormControl;
  }
  // Set
  set fieldFormControl(object: FormControl) {
    this._fieldFormControl = object;
  }

  matcher = new MyErrorStateMatcher();

  constructor(private validation: ValidationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.setMaterialVerifications();
  }

  private setMaterialVerifications() {
    const validatorOptions: ValidatorFn[] = [];
    if (this.verification === undefined) {
      return;
    }
    // Max char length
    if (this.verification.size) {
      validatorOptions.push(Validators.maxLength(this.verification.size));
    }
    // Positive numbers
    if (this.verification.positiveNumber) {
      validatorOptions.push(this.positiveNumber);
    }
    // Required field
    if (this.verification.required !== undefined && this.verification.required) {
      validatorOptions.push(Validators.required);
    }
    // regex
    if (this.verification.regx !== undefined) {
      validatorOptions.push(Validators.pattern(this.verification.regx.re));
    }
    // Latitude
    if (this.verification.isLatitude) {
      validatorOptions.push(this.validLatitude);
    }
    // Longitude
    if (this.verification.isLongitude) {
      validatorOptions.push(this.validLongitude);
    }
    this.fieldFormControl = new FormControl(this.value, validatorOptions);
  }

  /**
   * Custom Form Control validation fucntion
   * Validate Positive numbers greater than 0
   * @param control FormControl
   */
  positiveNumber(control: FormControl): { [key: string]: any; } {
    if (Number(control.value) <= 0 || !Number(control.value)) {
      return { positiveNumber: true };
    } else {
      return null;
    }
  }

  /**
   * Custom Form Control validation fucntion
   * Validate Latitudes
   * @param control FormControl
   */
  validLatitude(control: FormControl): { [key: string]: any; } {
    // Must be a number
    if (!Number(control.value)) {
      return { validLatitude: true };
    }
    // Must have at least 5 decimal places
    const separated = control.value.split('.');
    if (separated.length > 2) {
      return { validLatitude: true };
    }
    if (!separated[1] || separated[1].length < 5) {
      return { validLatitude: true };
    }
    // Must be between 48 and 61
    if (!(Number(separated[0]) >= 48 && Number(separated[0]) <= 61)) {
      return { validLatitude: true };
    }
    return null;
  }

  /**
   * Custom Form Control validation fucntion
   * Validate Longitudes
   * @param control FormControl
   */
  validLongitude(control: FormControl): { [key: string]: any; } {
       // Must be a number
       if (!Number(control.value)) {
        return { validLongitude: true };
      }
      // Must have at least 5 decimal places
      const separated = control.value.split('.');
      if (separated.length > 2) {
        return { validLongitude: true };
      }
      if (!separated[1] || separated[1].length < 5) {
        return { validLongitude: true };
      }
      // Must be between 48 and 61
      if (!(Number(separated[0]) >= -139 && Number(separated[0]) <= -114)) {
        return { validLongitude: true };
      }
      return null;
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
    return +latitude >= 48 && +latitude <= 61;
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
    return +longitude >= -139 && +longitude <= -114;
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

  public hasMinDecimalPlaces(number: any, minDecimals: number): boolean {
    const numberOfDecimals = this.decimalPlaces(number);
    return numberOfDecimals >= minDecimals;
  }
}
