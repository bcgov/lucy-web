import { Injectable } from '@angular/core';
import { Observation, SpeciesObservations } from '../models';
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
      surveyorFirstName: observation.surveyorFirstName,
      surveyorLastName: observation.surveyorLastName,
      speciesAgency: observation.speciesAgency.species_agency_code_id,
      // invasive plant species
      species: observation.species.species_id,
      jurisdiction: observation.jurisdiction.jurisdiction_code_id,
      density: observation.density.species_density_code_id,
      distribution: observation.distribution.species_distribution_code_id,
      surveyType: observation.surveyType.survey_type_code_id,
      surveyGeometry: observation.surveyGeometry.survey_geometry_code_id,
      specificUseCode: observation.specificUseCode.specific_use_code_id,
      soilTexture: observation.soilTexture.soil_texture_code_id,
      width: +observation.width,
      length: +observation.length,
      accessDescription: observation.accessDescription,
    };

    return body;
  }

  // TODO: Remove
  private speciesObservationBody(species: SpeciesObservations, observation: Observation, observationId: number): any {
    const speciesBody = {
      observation: observationId,
      species: species.species.species_id,
      jurisdiction: species.jurisdiction.jurisdiction_code_id,
      density: species.density.species_density_code_id,
      distribution: species.distribution.species_distribution_code_id,
      surveyType: species.surveyType.survey_type_code_id,
      surveyGeometry: species.surveyGeometry.survey_geometry_code_id,
      specificUseCode: species.specificUseCode.specific_use_code_id,
      soilTexture: species.soilTexture.soil_texture_code_id,
      width: +species.width,
      length: +species.length,
      accessDescription: species.accessDescription,

      surveyorFirstName: observation.surveyorFirstName,
      surveyorLastName: observation.surveyorLastName,
      speciesAgency: observation.speciesAgency.species_agency_code_id
    };

    return speciesBody;
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
      return response.response;
    } else {
      return undefined;
    }
  }
}
