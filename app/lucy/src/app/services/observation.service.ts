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
    const observationBody = {
      lat: observation.lat,
      long: observation.long,
      date: observation.date
    };
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_observation, observationBody);
    if (response.success) {
      const observation_Id = response.response[`observation_id`];
      let failed = false;
      for (const species of observation.speciesObservations) {
        console.dir(species);
        const speciesBody = this.speciesObservationBody(species, observation, observation_Id);
        const speciesResponse = await this.api.request(APIRequestMethod.POST, AppConstants.API_observationSpecies, speciesBody);
        if (speciesResponse.success) {
          console.log(`species success!!`);
        } else {
          console.log(`species FAIL!!`);
          failed = true;
        }
      }
      return !failed;

    } else {
      console.log(`observation FAIL!!`);
    }
    return false;
  }

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

      surveyorFirstName: observation.observerFirstName,
      surveyorLastName: observation.observerLastName,
      speciesAgency: observation.observerOrganization.species_agency_code_id
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
