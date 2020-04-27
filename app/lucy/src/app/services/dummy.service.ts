/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Injectable } from '@angular/core';
import { CodeTableService } from './code-table.service';
import * as faker from 'faker';
import * as moment from 'moment';
import { ObservationService } from './observation.service';
import { MapMarker } from '../components/Utilities/map-preview/map-preview.component';
import { UIConfigObject } from './form/form.service';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  constructor() { }

  /**
   * Generate testr data for given config
   * @param configuration 
   * @returns config with values & json body
   */
  async generateTest(configuration: UIConfigObject): Promise<{config: UIConfigObject, json: JSON}> {
    const responseBody = {};
    const config = { ...configuration};
    for (const section of config.sections) {
      for (const subsection of section.subSections) {
        for (let i = 0; i < subsection.fields.length; i++) {
          const field = subsection.fields[i];
          if (field.isComputedField) {
            continue;
          } else if (field.isSpaceGeom) {
            const fake = await this.fakeFieldValue(field);
            field.spaceGeom.value = fake.fieldValue;
            responseBody['spaceGeom'] =  fake.bodyValue;
          } else {
            const fake = await this.fakeFieldValue(field);
            if (field.multiple) {
              field.value = [fake.fieldValue];
              responseBody[field.key] = [fake.bodyValue];
            } else {
              field.value = fake.fieldValue;
              responseBody[field.key] = fake.bodyValue;
            }
          }
        }
      }
    }

    return {
      config: config,
      json: JSON.parse(JSON.stringify(responseBody)),
    };
  }

  private async fakeFieldValue(field: any): Promise<{fieldValue: any, bodyValue: any}> {
    if (field.isDateField) {
      const date = faker.date.past();
      const fake = moment(date).format('YYYY-MM-DD');
      return {
        fieldValue: fake,
        bodyValue: fake,
      }
    }

    if (field.isCheckbox) {
      if (field.verification && field.verification.required) {
        return {
          fieldValue: true,
          bodyValue: true,
        }
      }
      const fake = faker.random.boolean();
      return {
        fieldValue: fake,
        bodyValue: fake,
      }
    }

    if (field.isTextAreaField) {
      const fake = faker.lorem.sentences();
      return {
        fieldValue: fake,
        bodyValue: fake,
      }
    }

    if (field.isInputField && field.type.toLowerCase() === 'string') {
      const fake = faker.lorem.word();
      return {
        fieldValue: fake,
        bodyValue: fake,
      }
    }

    if (field.isInputField && field.type.toLowerCase() === 'number') {
      const fake = this.randomNumber(4, 20)
      return {
        fieldValue: `${fake}`,
        bodyValue: `${fake}`,
      }
    }
    
    // Dropdown
    if (field.isDropdown) {
      return this.randomDropdownOption(field.dropdown);
    }

    if (field.isSpaceGeom) {
      const geometryDropdown = field.spaceGeom.embeddedFields.geometry.dropdown;
      const latitude = this.randomLat();
      const longitude = this.randomLong();
      const fakeOption = this.randomDropdownOption(geometryDropdown);;

      return {
        fieldValue: this.generateSpaceGeom(latitude, longitude, fakeOption.fieldValue),
        bodyValue: this.generateSpaceGeom(latitude, longitude, fakeOption.bodyValue),
      }
    }

    console.log(`Unknown field ${field}`);
    return {
      fieldValue: undefined,
      bodyValue: undefined,
    }
    
  }

  public generateSpaceGeom(
    latitude: number,
    longitude: number,
    geometry: any
  ) {
    return ({
      latitude,
      longitude,
      geometry,
      inputGeometry: {
        attributes: {
          geomId: geometry,
          area: {
            length: this.randomNumber(1, 20),
            width: this.randomNumber(1, 20)
          }
        },
        geoJson: {}
      }
    });
  }

  /**
   * Generate a random option from dropdown
   */
  public randomDropdownOption(options: any[]): ({ fieldValue: any, bodyValue: any }) {
    const randomIndex = this.randomNumber(0, options.length - 1);
    const value = options[randomIndex];
    let selectedID = 0;
    for (const key in value) {
      if (key.toLowerCase().indexOf(`id`) !== -1) {
        selectedID = value[key];
        break;
      }
    }
    return {
      fieldValue: value,
      bodyValue: selectedID,
    }
  }

  /**
  * Generate a random longitude within bc
  */
  public randomLong(): number {
    const a = this.randomNumber(0, 7);
    const b = this.randomNumber(845602, 977180);
    const z = `-12${a}.${b}`;
    return +z;
  }

  /**
   * Generate a random latitude within bc
   */
  public randomLat() {
    const a = this.randomNumber(0, 8);
    const b = this.randomNumber(713134, 202679);
    const z = `5${a}.${b}`;
    return +z;
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

   /**
   * Return a random date in string format
   */
  public randomDateString() {
    const date = faker.date.past();
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Generate a unique incremental id based on given observations
   * @param observations objects
   */
  private getUniqueObservationId(observations: any[]): number {
    if (observations.length < 1) {
      return 0;
    }
    const usedIds: number[] = [];
    for (const object of observations) {
      usedIds.push(object.observation_id);
    }

    const sortedUsedIds = usedIds.sort((n1, n2) => n1 - n2);
    return sortedUsedIds.pop() + 1;
  }

  /**
   * Generate random coordinates in BC
   * @param number of coordinates
   */
  public generateCoordinates(number: number): MapMarker[] {
    const coordinates: MapMarker[] = [];
    for (let _i = 0; _i < number; _i++) {
      coordinates.push( {
        latitude: this.randomLat(),
        longitude: this.randomLong()
      });
    }
    return coordinates;
  }

  public async createDummyObservations(number: number): Promise<any[]> {
    return;
  }

}
