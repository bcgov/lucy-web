import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {
  // Output
  @Output() valueChanged = new EventEmitter<string>();
  // Optional Input
  @Input() validationFunc: any;
  // Optional Input
  @Input() multiline = false;
  // Field header
  @Input() header = '';

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
    return this.mode === FormMode.View;
  }

  ///// Value
  private _value = ``;
  // Get
  get value(): string {
    return this._value;
  }
  // Set
  @Input() set value(value: string) {
    console.log(value);
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
    if (this.validationFunc) {
      const result = this.validationFunc(this.value);
      return result;
    } else {
      return true;
    }
  }

  constructor(private validation: ValidationService) { }

  ngOnInit() {
  }

}
