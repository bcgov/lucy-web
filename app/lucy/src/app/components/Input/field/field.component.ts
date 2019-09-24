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
    this.valueChanged.emit(value);
  }
  ////////////////////

  /**
   * If a validation function has been
   * passed to @Input validationFunc, the result
   * will be used.
   * Otherwise returns true.
   */
  get isValid(): boolean {
    if (this.value === undefined || this.value === ``) {
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
    if (this.verification.required !== undefined) {
      validatorOptions.push(Validators.required);
    }
    // regex
    if (this.verification.regx !== undefined) {
      console.log(this.verification.regx);
      validatorOptions.push(Validators.pattern(this.verification.regx.re));
    }
    this.fieldFormControl = new FormControl('', validatorOptions);
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

}
