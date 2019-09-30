import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

export enum ComputationMethod {
  calculateArea,
  somethingElse
}

@Component({
  selector: 'app-computed-field',
  templateUrl: './computed-field.component.html',
  styleUrls: ['./computed-field.component.css']
})
export class ComputedFieldComponent implements OnChanges, OnInit {
  // Field header
  @Input() header = '';
  // Rules
  @Input() computationRules: any;

  private _formBody: any = {};
  get formBody(): any {
    return this._formBody;
  }
  @Input() set formBody(object: any) {
    this._formBody = object;
  }

  private _value = `xx`;
  get value(): string {
    return this._value;
  }
  @Input() set value(value: string) {
    this._value = value;
  }

  get fieldId(): string {
    return this.header;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.dir(changes.formBody.currentValue);
    this.compute();
  }

  compute() {
    if (!this.formBody || !this.computationRules || !this.computationRules[0])  {
      return;
    }
    if (this.requiredFieldsForComputationExist()) {
      const compMethod : ComputationMethod = this.computationRules.method as keyof typeof ComputationMethod;
    }
  }

  requiredFieldsForComputationExist(): boolean {
    if (!this.formBody || !this.computationRules || !this.computationRules[0]) {
      return false;
    }

    for (const key of this.computationRules[0].keys) {
      if (this.formBody[key] === undefined) {
        return false;
      }
    }
    return true;
  }

}
