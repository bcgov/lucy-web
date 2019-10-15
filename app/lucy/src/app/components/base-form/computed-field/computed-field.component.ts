/**
 * Copyright 2019 Province of British Columbia
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

  /**
   * Calculate area and set value text
   */
  private setCalculatedArea() {
    const area = String(this.calculateArea());
    this.value = `${area}\tm²`;
  }

/**
 * Determines whether rectangular area or circular area should be calculated,
 * based on key(s) in required fields
 */
  private calculateArea(): number {
    const fields = this.getRequiredFields();
    if (fields[0].key === `width` || fields[0].key === `length`) {
      return this.calculateAreaRectangle();
    } else if (fields[0].key === `radius`) {
      return this.calculateAreaCircle();
    } else { return 0; }
  }

  /**
   * Return area of rectangle calculated by multiplying required fields.
   * (ignores required dropdown value)
   */
  private calculateAreaRectangle(): number {
    const fields = this.getRequiredFields();
    if (!fields) {
      return 0;
    }
    let result = 0;
    for (const field of fields) {
      if (!this.isDropdown(field.key)) {
        if (result === 0) {
          result = Number(field.value);
        } else {
          result = result * Number(field.value);
        }
      }
    }
    return result;
  }

  /**
   * Returns area of circle calculated by multiplying radius by PI^2
   */
  private calculateAreaCircle(): number {
    const fields = this.getRequiredFields();
    let result: number;
    if (!fields) {    // no value entered
      result = 0;
    } else if (fields.length > 1) {   // multiple values entered (so can't be radius)
      result = 0;
    } else {
      result = Math.PI * Math.pow(fields[0].value, 2);
    }
    return result;
  }
}
