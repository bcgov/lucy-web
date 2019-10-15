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

import { Injectable } from '@angular/core';

export interface DropdownObject {
  name: string;
  object: any;
}

@Injectable({
  providedIn: 'root'
})

export class DropdownService {
  private possibleDisplayKeys = ['observation_id', 'description', 'businessName', 'commonName', 'certificate'];

  constructor() { }

  /**
   * Create an array of dropdown objects from an array of objects.
   * @param objects array of objects
   * @param displayValue field in objects that should be displayed in dropdown
   */
  public createDropdownObjectsFrom(objects: any[], displayValue: string): DropdownObject[] {
    const dropdownObjects: DropdownObject[] = [];
    if (!objects) {
      return dropdownObjects;
    }
    for (const object of objects) {
      console.dir(object);
      let name: string = object.displayLabel;

      // if (!name || name.length < 1) {
      //   name = object[displayValue];
      // }

      // // If display value isnt found, pick from possible options
      // if (!name || name.length < 1) {
      //   for (const possibleKey of this.possibleDisplayKeys) {
      //     if (object[possibleKey]) {
      //       name = object[possibleKey];
      //       break;
      //     }
      //   }
      // }
      // // if the object doesnt have those keys either, just pick the first key
      // if (!name || name.length < 1) {
      //   name = object[Object.keys(object)[0]];
      // }
      dropdownObjects.push({
        name: name,
        object: object,
      });
    }
    return dropdownObjects;
  }

  /**
   * Return array of dropdowns to use for testing.
   */
  public async getDummyDropdownObjects(): Promise<DropdownObject[]> {
    const dropdownObjects: DropdownObject[] = [];
    dropdownObjects.push({
      name: `NOT YET IMPLEMENTED.`,
      object: 'item Zero',
    });
    dropdownObjects.push({
      name: `Item One`,
      object: 'item One',
    });
    dropdownObjects.push({
      name: `Item Two`,
      object: 'item Two',
    });
    dropdownObjects.push({
      name: `Item Three`,
      object: 'item Three',
    });
    dropdownObjects.push({
      name: `Item Four`,
      object: 'item Four',
    });
    return dropdownObjects;
  }
}
