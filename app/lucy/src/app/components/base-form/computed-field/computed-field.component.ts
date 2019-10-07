import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';


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
  // full config
  @Input() config: any;

  private _formBody: any = {};
  get formBody(): any {
    return this._formBody;
  }
  @Input() set formBody(object: any) {
    this._formBody = object;
  }

  private _value = ``;
  get value(): string {
    return this._value;
  }
  @Input() set value(value: string) {
    this._value = value;
  }

  get fieldId(): string {
    return this.header;
  }

  get requiredFieldsForComputationExist(): boolean {
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

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.compute();
  }

  /**
   * Perform the computation method specified in computationRules -> method
   */
  compute() {
    if (!this.formBody || !this.computationRules || !this.computationRules[0]) {
      return;
    }
    if (this.requiredFieldsForComputationExist) {
      // convert method to enum
      const tempMethod = this.computationRules[0].method as keyof typeof ComputationMethod;
      const compMethod: ComputationMethod = ComputationMethod[tempMethod];
      // switch ComputationMethods
      switch (compMethod) {
        case ComputationMethod.calculateArea:
          this.setCalculatedArea();
          break;
        case ComputationMethod.somethingElse:
          console.log('not implemented');
          break;
        default:
          console.log('default not implemented');
          break;
      }
    } else {
      this.value = ``;
    }
  }

  /**
   * Get an array of key value objects containing
   * required keys and their current values.
   */
  private getRequiredFields(): { key: string; value: any }[] | undefined {
    if (!this.formBody || !this.computationRules || !this.computationRules[0]) {
      return undefined;
    }
    const fields = [];

    for (const key of this.computationRules[0].keys) {
      if (this.formBody[key] === undefined) {
        return undefined;
      } else {
        fields.push({
          key: [key],
          value: this.formBody[key],
        });
      }
    }
    return fields;
  }

  /**
   * Check if a required key is a dropdown.
   * @param key
   */
  private isDropdown(key: string): boolean {
    if (!this.config || !this.config.dropdownFieldKeys) {
      return false;
    }
    return this.config.dropdownFieldKeys.indexOf(String(key)) !== -1;
  }

  // ----------------------- Calculate observed area based on Geometry ---------------------
  private getHorizontalDimension(): number {
    return this.formBody.horizontalDimension;
  }

  private getVerticalDimension(): number {
    return this.formBody.verticalDimension;
  }

  /**
   * Calculate area and set value text
   */
  private setCalculatedArea() {
    const area = String(this.calculateArea());
    this.value = `${area}\tm²`;
  }

  /**
   * Determines whether rectangular area of circular area should be calculated,
   * based on key(s) in required fields
   */
  private calculateArea(): number {
    if (this.formBody.observationGeometry === 2) {
      return this.calculateAreaRectangle();
    } else if (this.formBody.observationGeometry === 1) {
      return this.calculateAreaCircle();
    } else { return 0; }
  }

  /**
   * Return area of rectangle calculated by multiplying required fields
   */
  private calculateAreaRectangle(): number {
    const horizontal = this.getHorizontalDimension();
    const vertical = this.getVerticalDimension();
    return horizontal * vertical;
  }

  /**
   * Return area of circle calculated by multiplying radius by PI^2
   */
  private calculateAreaCircle(): number {
      return Math.PI * Math.pow(this.getHorizontalDimension(), 2);
  }
}
  // ----------------------- End of Calculate observed area based on Geometry ---------------------

