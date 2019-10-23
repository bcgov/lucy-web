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
import { ApiService, APIRequestMethod } from './api.service';
import { MechanicalTreatment } from '../models/MechanicalTreatment';
import { AppConstants } from '../constants';
import { ObjectValidatorService } from './object-validator.service';
import { DummyService } from './dummy.service';

export interface MechanicalTreatmentDiffResult {
  changed: boolean;
  newMechanicalTreatment: MechanicalTreatment;
  originalMechanicalTreatment: MechanicalTreatment;
  diffMessage: string;
  changes: Object;
}

@Injectable({
  providedIn: 'root'
})
export class MechanicalTreatmentService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService, private dummyService: DummyService) { }

  /**
   * Creates json body for observation creation.
   * @param observation object
   */
  private body(object: MechanicalTreatment): any {
    /**
     * Note: If your observation ends up having nested objects,
     * this function will no longer work for compare() in this class.
     * You'll need to create a similar function to "flatten" an observation.
     */
    const body = {
      latitude: +String(object.latitude),
      longitude: +String(object.longitude),
      length: +String(object.length),
      width: +String(object.width),
      applicatorFirstName: object.applicatorFirstName,
      applicatorLastName: object.applicatorLastName,
      secondaryApplicatorFirstName: object.secondaryApplicatorFirstName,
      secondaryApplicatorLastName: object.secondaryApplicatorLastName,
      providerContractor: object.providerContractor.treatment_provider_contractor_id,
      date: object.date,
      paperFileReference: object.paperFileReference,
      comment: object.comment,
      observation: object.observation.observation_id,
      species: object.species.species_id,
      speciesAgency: object.speciesAgency.species_agency_code_id,
      mechanicalMethod: object.mechanicalMethod.mechanical_method_code_id,
      mechanicalDisposalMethod: object.mechanicalDisposalMethod.mechanical_disposal_method_code_id,
      soilDisturbance: object.soilDisturbance.mechanical_soil_disturbance_code_id,
      rootRemoval: object.rootRemoval.mechanical_root_removal_code_id,
      issue: object.issue.mechanical_treatment_issue_code_id,
      signageOnSiteIndicator: object.signageOnSiteIndicator,
    };

    return body;
  }

  public async submit(mechanicalTreatment: MechanicalTreatment): Promise<boolean> {
    // You shouldn't use the object directly because api expects ids, not objects
    const mechanicalTreatmentBody = this.body(mechanicalTreatment);
    console.dir(mechanicalTreatment);

    // Make the call
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_mechanicalTreatment, mechanicalTreatmentBody);
    if (response.success) {
      console.dir(response.response);
      const _Id = response.response[`mechanical_treatment_id`];
      if (_Id) {
        console.log(`Created successfully`);
        return true;
      } else {
        console.log(`Got a response, but something is off - id is missing`);
        console.dir(response);
        return false;
      }
    } else {
      console.log(`mechanical treatment creation failed`);
      console.dir(response);
      return false;
    }
  }

  /**
   * Submit changes for a Mechanical Treatment.
   * Send Full object
   */
  public async editMechanicalTreatment(mechanicalTreatment: MechanicalTreatment): Promise<boolean> {
    // You shouldn't use the object directly because api expects ids, not objects
    const body = this.body(mechanicalTreatment);

    // Make the call
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_observationWith(mechanicalTreatment.mechanical_treatment_id), body);
    if (response.success) {
      const _Id = response.response[`mechanical_treatment_id`];
      if (_Id) {
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
   * Submit changes for a Mechanical Treatment.
   * Send Only changes
   */
  public async editMechanicalTreatmentChangeOnly(newMechanicalTreatment: MechanicalTreatment, oldMechanicalTreatment: MechanicalTreatment): Promise<boolean> {
    const changes = await this.compare(newMechanicalTreatment, oldMechanicalTreatment);
    console.dir(changes);
    // Make the call
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_mechanicalTreatmentWith(newMechanicalTreatment.mechanical_treatment_id), changes);
    if (response.success) {
      const observation_Id = response.response[`mechanical_treatment_id`];
      if (observation_Id) {
        console.log(`Edited successfully`);
        console.dir(response.response);
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
   * Fetch and returns all MechanicalTreatment objects
   */
  public async getAll(): Promise<MechanicalTreatment[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_mechanicalTreatment, null);
    if (response.success && Array.isArray(response.response) && this.objectValidator.isMechanicalTreatmentObject(response.response[0])) {
      return response.response;
    } else {
      return[];
    }
  }

  /**
   * Fetch and return a specific Mechanical Treatment
   * @param id Observation Id
   */
  public async getWithId(id: number): Promise<MechanicalTreatment | undefined> {
    // return this.dummyService.createDummyMechanicalTreatment();
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_mechanicalTreatmentWith(id), null);
    console.dir(response);
    if (response.success && this.objectValidator.isMechanicalTreatmentObject(response.response)) {
      console.dir(response);
      return response.response;
    } else {
      return undefined;
    }
  }

  public getEmptyObject(): MechanicalTreatment {
    const object: MechanicalTreatment = {
      mechanical_treatment_id: -1,
      latitude: undefined,
      longitude: undefined,
      length: undefined,
      width: undefined,
      applicatorFirstName: undefined,
      applicatorLastName: undefined,
      secondaryApplicatorFirstName: undefined,
      secondaryApplicatorLastName: undefined,
      providerContractor: undefined,
      date: undefined,
      paperFileReference: undefined,
      comment: undefined,
      observation: undefined,
      species: undefined,
      speciesAgency: undefined,
      mechanicalMethod: undefined,
      mechanicalDisposalMethod: undefined,
      soilDisturbance: undefined,
      rootRemoval: undefined,
      issue: undefined,
      signageOnSiteIndicator: false,
    };
    return object;
  }

  ////////////////////////////// Diff //////////////////////////////

  /**
   * Compare specified MechanicalTreatment object with its original version.
   * if undefinied is returned, there was a failure
   * @param mechanicalTreatment MechanicalTreatment
   * @return MechanicalTreatmentDiffResult | undefined
   */
  public async diffMechanicalTreatment(mechanicalTreatment: MechanicalTreatment): Promise<MechanicalTreatmentDiffResult | undefined> {
    // 1) Fetch the latest original
    const original = await this.getWithId(mechanicalTreatment.mechanical_treatment_id);
    // if couldnt fetch the original, return undefind
    if (!original) {
      return undefined;
    }
    // 2) Compare
    const changes = this.compare(mechanicalTreatment, original);
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
      newMechanicalTreatment: mechanicalTreatment,
      originalMechanicalTreatment: original,
      diffMessage: changedKeys,
      changes: changes
    };
  }

  /**
   * Compare a change Object to original MechanicalTreatment
   * and return a string describing what changed.
   * @param changes Object
   * @param original MechanicalTreatment
   */
  private createDiffMessage(changes: Object, original: MechanicalTreatment): string {
    // TODO: This function needs to be tweaked for usage: handle codes & date format
    let msg = ``;
    const originalObservation = JSON.parse(JSON.stringify(this.body(original)));
    Object.keys(changes).forEach(function (key, index) {
      const originaValue = originalObservation[key];
      msg = `${msg}* ${key}: From: ${originaValue} -> To: ${changes[key]}\n`;
    });
    console.log(msg);
    return msg;
  }

  /**
   * Compare 2 MechanicalTreatment objects
   * and return Object containing differences
   * between the two.
   * * Note: This function uses this.body()
   * and doesnt use the objects that are passed in directly.
   * @param mechanicalTreatment MechanicalTreatment
   * @param original MechanicalTreatment
   */
  public compare(mechanicalTreatment: MechanicalTreatment, original: MechanicalTreatment): Promise<Object | undefined> {
    const originalObservation = JSON.parse(JSON.stringify(this.body(original)));
    const newObservation = JSON.parse(JSON.stringify(this.body(mechanicalTreatment)));
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
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
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
  //////////////////////////////  Diff //////////////////////////////
}
