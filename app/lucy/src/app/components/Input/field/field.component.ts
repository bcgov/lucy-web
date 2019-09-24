import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import {FormControl, FormGroupDirective, NgForm, Validators, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

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
  @Input() validationFunc: any;
  // Optional Input
  @Input() multiline = false;
  // Field header
  @Input() header = '';

  private _verification: any;
  @Input() set verification(object: any) {
    this._verification = object;
    console.log(object);
    this.setMaterialVerifications();
  }
  get verification(): any {
    return this._verification;
  }


  private _required = false;
  get required(): boolean {
    return this._required;
  }
  @Input() set required(value: boolean) {
    if (value) {
      this._required = value;
      console.log(value);
      this.setMaterialVerifications();
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
    if (this.validationFunc) {
      const result = this.validationFunc(this.value);
      return result;
    } else {
      return true;
    }
  }

  private _fieldFormControl: FormControl;
  set fieldFormControl(object: FormControl) {
    this._fieldFormControl = object;
  }
  get fieldFormControl(): FormControl {
    return this._fieldFormControl;
  }
  matcher = new MyErrorStateMatcher();

  constructor(private validation: ValidationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  //  this.setMaterialVerifications();
  }

  private setMaterialVerifications() {
    console.log(`ring ring`);
    const validatorOptions: ValidatorFn[] = [];
    if (this.verification !== undefined && this.verification.size) {
      console.log('adding max size');
      validatorOptions.push(Validators.maxLength(this.verification.size));
    } else {
      console.log(this.verification);
    }
    if (this.required) {
      console.log('adding is required');
      validatorOptions.push(Validators.required);
    }
    this.fieldFormControl = new FormControl('', validatorOptions);
  }

}
