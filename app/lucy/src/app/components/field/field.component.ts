import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  // Response
  @Output() valueChanged = new EventEmitter<string>();

  @Input() header = '';

  get isValid(): boolean {
    if (this.validationFunc) {
      const result = this.validationFunc(this.value);
      return result;
    } else {
      return true;
    }
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

  ///// Form Mode
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

  @Input() validationFunc: any;

  constructor(private validation: ValidationService) { }

  ngOnInit() {
  }

}
