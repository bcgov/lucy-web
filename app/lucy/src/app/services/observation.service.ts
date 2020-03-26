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
import { Observation } from '../models';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { ObjectValidatorService } from './object-validator.service';

export interface ObservationDiffResult {
  changed: boolean;
  newObervation: Observation;
  originalObservation: Observation;
  diffMessage: string;
  changes: Object;
}
@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  /**
   * Creates json body for observation creation.
   * @param observation object
   */
  private observationBody(observation: Observation): any {
    /**
     * Note: If your observation ends up having nested objects,
     * this function will no longer work for compare() in this class.
     * You'll need to create a similar function to "flatten" an observation.
     */
    const body = {
      // basic //
      // Location
      lat: +String(observation.lat),
      long: +String(observation.long),
      date: observation.date,
      updatedAt: observation.updatedAt,
      // Observer
      observerFirstName: observation.observerFirstName,
      observerLastName: observation.observerLastName,
      speciesAgency: observation.speciesAgency.species_agency_code_id,
      // invasive plant species
      species: observation.species.species_id,
      jurisdiction: observation.jurisdiction.jurisdiction_code_id,
      density: observation.density.species_density_code_id,
      distribution: observation.distribution.species_distribution_code_id,
      observationType: observation.observationType.observation_type_code_id,
      specificUseCode: observation.specificUseCode.specific_use_code_id,
      soilTexture: observation.soilTexture.soil_texture_code_id,
      width: +String(observation.width),
      length: +String(observation.length),
      accessDescription: observation.accessDescription,
      // Advanced
      // indicators
      sampleTakenIndicator: observation.sampleTakenIndicator,
      wellIndicator: observation.wellIndicator,
      legacySiteIndicator: observation.legacySiteIndicator,
      edrrIndicator: observation.edrrIndicator,
      researchIndicator: observation.researchIndicator,
      specialCareIndicator: observation.specialCareIndicator,
      biologicalIndicator: observation.biologicalIndicator,
      aquaticIndicator: observation.aquaticIndicator,
      // Further details
      proposedAction: observation.proposedAction.observation_proposed_action_code_id,
      sampleIdentifier: observation.sampleIdentifier,
      rangeUnitNumber: observation.rangeUnitNumber,
      aspectCode: observation.aspectCode.observation_aspect_code_id,
      slopeCode: observation.slopeCode.observation_slope_code_id,
      observationGeometry: observation.observationGeometry.observation_geometry_code_id,
    };

    return body;
  }

  public async submitObservation(observation: Observation): Promise<boolean> {
    // You shouldn't use the object directly because api expects ids, not objects
    const observationBody = this.observationBody(observation);
    console.dir(observationBody);
    console.log(observationBody);

    // Make the call
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_observation, observationBody);
    if (response.success) {
      const observation_Id = response.response[`observation_id`];
      if (observation_Id) {
        console.log(`Created successfully`);
        return true;
      } else {
        console.log(`Got a response, but something is off - id is missing`);
        console.dir(response);
        return false;
      }
    } else {
      console.log(`observation creation failed`);
      console.dir(response);
      return false;
    }
  }

  /**
   * Submit changes for an observation.
   * Send Full object
   */
  public async editObservation(observation: Observation): Promise<boolean> {
    // You shouldn't use the object directly because api expects ids, not objects
    const observationBody = this.observationBody(observation);

    // Make the call
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_observationWith(observation.observation_id), observationBody);
    if (response.success) {
      const observation_Id = response.response[`observation_id`];
      if (observation_Id) {
        console.log(`Edited successfully`);
        return true;
      } else {
        console.log(`Got a response, but something is off - id is missing`);
        console.dir(response);
        return false;
      }
    } else {
      console.log(`observation edit failed`);
      console.dir(response);
      return false;
    }
  }

  /**
   * Submit changes for an observation.
   * Send Only changes
   */
  public async editObservationChangeOnly(newObservation: Observation, oldObservation: Observation): Promise<boolean> {
    const changes = await this.compare(newObservation, oldObservation);
    console.dir(changes);
    // Make the call
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_observationWith(newObservation.observation_id), changes);
    if (response.success) {
      const observation_Id = response.response[`observation_id`];
      if (observation_Id) {
        console.log(`Edited successfully`);
        return true;
      } else {
        console.log(`Got a response, but something is off - id is missing`);
        console.dir(response);
        return false;
      }
    } else {
      console.log(`observation edit failed`);
      console.dir(response);
      return false;
    }
  }

  /**
   * Fetch and returns all observation objects
   */
  public async getAll(): Promise<Observation[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observation, null);
    if (response.success && Array.isArray(response.response) && this.objectValidator.isObservationObject(response.response[0])) {
      return response.response;
    } else {
      return[];
    }
  }

  /**
   * Fetch and returns filtered observation objects
   */
  public async getFilteredObservations(keyword: string): Promise<Observation[]> {
    const response = await this.api.request(
      APIRequestMethod.GET,
      `${AppConstants.API_observation}/search?keyword=${keyword}`,
      null
    );
    if (response.success && Array.isArray(response.response) && this.objectValidator.isObservationObject(response.response[0])) {
      return response.response;
    } else {
      return[];
    }
  }

  /**
   * Fetch and return a specific observation object
   * @param id Observation Id
   */
  public async getWithId(id: number): Promise<Observation | undefined> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observationWith(id), null);
    if (response.success && this.objectValidator.isObservationObject(response.response)) {
      return response.response;
    } else {
      return undefined;
    }
  }

  /**
   * Fetch and return all observation objects associated with a given lat/long
   */
  public async getByLocation(lat: number, long: number): Promise<Observation[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observationAt(lat, long), null);
    if (response.success && Array.isArray(response.response) && this.objectValidator.isObservationObject(response.response[0])) {
      return response.response;
    } else {
      return [];
    }
  }

  /**
   * Helper function to create an empty abstract object
   * with all property values undefined
   */
  public createEmptyObject = (obj: any, props: string[]) => {
    for (const k of props) {
      Object.defineProperty(obj, k, {
        value: undefined,
        writable: true,
      });
    }
  }

  /**
   * Return an empty observation object
   */
  public getEmptyObservation(): Observation {
    const observationProps = ['observation_id', 'lat', 'long', 'date', 'updatedAt', 'observerFirstName', 'observerLastName', 'speciesAgency', 'species', 'jurisdiction',
   'density', 'distribution', 'observationType', 'specificUseCode', 'soilTexture', 'width', 'length', 'accessDescription', 'sampleTakenIndicator',
   'wellIndicator', 'legacySiteIndicator', 'edrrIndicator', 'researchIndicator', 'specialCareIndicator', 'biologicalIndicator',
   'aquaticIndicator', 'proposedAction', 'sampleIdentifier', 'rangeUnitNumber', 'aspectCode', 'slopeCode', 'observationGeometry'];

    let object: Observation;
    this.createEmptyObject(object, observationProps);
    // add mechanicalTreatments property (specific to Observation object) as an empty list instead of 'undefined'
    Object.defineProperty(object, 'mechanicalTreatments', []);

    return object;
  }

  ////////////////////////////// Observation Diff //////////////////////////////

  /**
   * Compare specified Observation object with its original version.
   * if undefinied is returned, there was a failure
   * @param observation Observation
   * @return ObservationDiffResult | undefined
   */
  public async diffObservation(observation: Observation): Promise<ObservationDiffResult | undefined> {
    // 1) Fetch the latest original
    const original = await this.getWithId(observation.observation_id);
    // if couldnt fetch the original, return undefind
    if (!original) {
      return undefined;
    }
    // 2) Compare
    const changes = this.compare(observation, original);
    // if comparison fails, return undefinied.
    if (!changes) {
      return undefined;
    }

    // 3) Successfully diffed, generate response

    // Convert keys from camel case:
    const keys =  Object.keys(changes).map(x => {
      const fromCamel = x.replace( /([A-Z])/g, ` $1` );
      return fromCamel.charAt(0).toUpperCase() + fromCamel.slice(1);
    });
    const changedKeys = keys.join(`, `);
    const changed = changedKeys.length > 1;
    return {
      changed: changed,
      newObervation: observation,
      originalObservation: original,
      diffMessage: changedKeys,
      changes: changes
    };
  }

  /**
   * Compare a change Object to original observation
   * and return a string describing what changed.
   * @param changes Object
   * @param original Observation
   */
  private createDiffMessage(changes: Object, original: Observation): string {
    // TODO: This function needs to be tweaked for usage: handle codes & date format
    let msg = ``;
    const originalObservation = JSON.parse(JSON.stringify(this.observationBody(original)));
    Object.keys(changes).forEach(function (key, index) {
      const originaValue = originalObservation[key];
      msg = `${msg}* ${key}: From: ${originaValue} -> To: ${changes[key]}\n`;
    });
    console.log(msg);
    return msg;
  }

  /**
   * Compare 2 observation objects
   * and return Object containing differences
   * between the two.
   * * Note: This function uses this.observationBody()
   * and doesnt use the objects that are passed in directly.
   * @param observation Observation
   * @param original Observation
   */
  public compare(observation: Observation, original: Observation): Promise<Object | undefined> {
    const originalObservation = JSON.parse(JSON.stringify(this.observationBody(original)));
    const newObservation = JSON.parse(JSON.stringify(this.observationBody(observation)));
    const r = this.diff(originalObservation, newObservation);
    return r;
  }

  /**
   * Compare 2 JSON object and
   * return Object containing differences
   * between the two.
   * * Note: Keys should be in the same order
   * @param obj1 JSON object
   * @param obj2 JSON object
   */
  private diff(obj1: JSON, obj2: JSON): any {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            result[key] = obj2[key];
        }
        if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = this.diff(obj1[key], obj2[key]);
            if (value !== undefined) {
                result[key] = value;
            }
        }
    });
    return result;
  }

  ////////////////////////////// End Observation Diff //////////////////////////////
}
