import { Injectable } from '@angular/core';
import { Observation } from '../models';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { ObjectValidatorService } from './object-validator.service';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  public async submitObservation(observation: Observation): Promise<boolean> {
    // You shouldn't use the object directly because api expects ids, not objects
    const observationBody = this.observationBody(observation);

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
   * Creates json body for observation creation.
   * @param observation object
   */
  private observationBody(observation: Observation): any {
    const body = {
      // basic information
      lat: observation.lat,
      long: observation.long,
      date: observation.date,
      observerFirstName: observation.observerFirstName,
      observerLastName: observation.observerLastName,
      speciesAgency: observation.speciesAgency.species_agency_code_id,
      // invasive plant species
      species: observation.species.species_id,
      jurisdiction: observation.jurisdiction.jurisdiction_code_id,
      density: observation.density.species_density_code_id,
      distribution: observation.distribution.species_distribution_code_id,
      observationType: observation.observationType.observation_type_code_id,
      observationGeometry: observation.observationGeometry.observation_geometry_code_id,
      specificUseCode: observation.specificUseCode.specific_use_code_id,
      soilTexture: observation.soilTexture.soil_texture_code_id,
      width: +observation.width,
      length: +observation.length,
      accessDescription: observation.accessDescription,
    };

    return body;
  }

  public async getAll(): Promise<Observation[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observation, null);
    if (response.success && Array.isArray(response.response) && this.objectValidator.isObservationObject(response.response[0])) {
      return response.response;
    } else {
      return[];
    }
  }

  public async getWithId(id: number): Promise<Observation | undefined> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_observationWith(id), null);
    if (response.success && this.objectValidator.isObservationObject(response.response)) {
      console.log(response.response);
      return response.response;
    } else {
      return undefined;
    }
  }

  public getEmptyObservation(): Observation {
    const object: Observation = {
      observation_id: -1,
      lat: undefined,
      long: undefined,
      date: undefined,

      observerFirstName: undefined,
      observerLastName: undefined,
      speciesAgency: undefined,

      species: undefined,
      jurisdiction: undefined,
      density: undefined,
      distribution: undefined,
      observationType: undefined,
      observationGeometry: undefined,
      specificUseCode: undefined,
      soilTexture: undefined,
      width: undefined,
      length: undefined,
      accessDescription: undefined,
    }
    return object;
  }
}
