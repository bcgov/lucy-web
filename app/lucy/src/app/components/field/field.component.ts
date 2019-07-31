import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
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

export class FieldComponent implements OnInit {
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


  private _required = false;
  get required(): boolean {
    return this._required;
  }
  @Input() set required(value: boolean) {
    if (value) {
      this.fieldFormControl = new FormControl('', [
        Validators.required,
      ]);
    }
    this._required = value;
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

  fieldFormControl: FormControl;

  constructor(private validation: ValidationService) { }

  ngOnInit() {
  }

}
