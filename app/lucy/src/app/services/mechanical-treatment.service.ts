import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { MechanicalTreatment } from '../models/MechanicalTreatment';
import { AppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class MechanicalTreatmentService {

  constructor(private api: ApiService) { }

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
      latitude: object.latitude,
      longitude: object.longitude,
      length: object.length,
      width: object.width,
      applicatorFirstName: object.applicatorFirstName,
      applicatorLastName: object.applicatorLastName,
      date: object.date,
      paperFileReference: object.paperFileReference,
      comment: object.comment,
      observation: object.observation.observation_id,
      species: object.species.species_id,
      speciesAgency: object.speciesAgency.species_agency_code_id,
      mechanicalMethod: object.mechanicalMethod.mechanical_method_code_id,
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

  public getEmptyObject(): MechanicalTreatment {
    const object: MechanicalTreatment = {
      latitude: undefined,
      longitude: undefined,
      length: undefined,
      width: undefined,
      applicatorFirstName: undefined,
      applicatorLastName: undefined,
      date: undefined,
      paperFileReference: undefined,
      comment: undefined,
      observation: undefined,
      species: undefined,
      speciesAgency: undefined,
      mechanicalMethod: undefined,
    };
    return object;
  }
}
