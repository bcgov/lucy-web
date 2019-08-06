import { Injectable } from '@angular/core';
import { LatLong } from '../components/map-preview/map-preview.component';
import { Jurisdiction,
   InvasivePlantSpecies,
   SpeciesDensityCodes,
   SpeciesDistributionCodes,
   SpeciesAgencyCodes,
   ObservationTypeCodes,
   SoilTextureCodes,
   ObservationGeometryCodes,
   SpecificUseCodes,
   Observation, SlopeCodes,
   AspectCodes,
   ProposedActionCodes } from '../models';
import { CodeTableService } from './code-table.service';
import * as faker from 'faker';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  constructor(private codeTables: CodeTableService) { }

  /**
   * Return a random jurisdiction
   */
  public async randomJurisdiction():  Promise<Jurisdiction | undefined> {
    const codes = await this.codeTables.getJuristictions();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  /**
   * Return a random invasive plant species.
   */
  public async randomInvasivePlantSpecies(): Promise<InvasivePlantSpecies | undefined> {
    const codes = await this.codeTables.getInvasivePlantSpecies();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

   /**
   * Return a random density code.
   */
  public async randomSpeciesDensityCodes(): Promise<SpeciesDensityCodes | undefined> {
    const codes = await this.codeTables.getDensityCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

   /**
   * Return a random distribution code.
   */
  public async randomSpeciesDistributionCodes(): Promise<SpeciesDistributionCodes | undefined> {
    const codes = await this.codeTables.getDistributionCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }


  public async randomSpeciesAgencyCodes(): Promise<SpeciesAgencyCodes | undefined> {
    const codes = await this.codeTables.getSpeciesAgencyCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomSurveyTypeCodes(): Promise<ObservationTypeCodes | undefined> {
    const codes = await this.codeTables.observationTypeCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }


  public async randomSoilTextureCodes(): Promise<SoilTextureCodes | undefined> {
    const codes = await this.codeTables.getSoilTextureCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomSurveyGeometryCodes(): Promise<ObservationGeometryCodes | undefined> {
    const codes = await this.codeTables.observationGeometryCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomSpecificUseCodes(): Promise<SpecificUseCodes | undefined> {
    const codes = await this.codeTables.getSpecificUseCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomProposedActionCodes(): Promise<ProposedActionCodes | undefined> {
    const codes = await this.codeTables.getProposedActionCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomGroundAspectCodes(): Promise<AspectCodes | undefined> {
    const codes = await this.codeTables.getGroundAspectCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomGroundSlopeCodes(): Promise<SlopeCodes | undefined> {
    const codes = await this.codeTables.getGroundSlopeCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  /**
   * Create and return a random array of observations
   * @param number of observations
   */
  async createDummyObservations(number: number): Promise<Observation[]> {
    const observations: Observation[] = [];
    for (let _i = 0; _i < number; _i++) {
      const observation = await this.createDummyObservation(observations);
      if (observation) {
        observations.push(observation);
      } else {
        console.log(`Error while creating a random observation`);
      }
    }
    return observations;
  }

  /**
   * Generate a random observation
   * @param forObservations observations array: because id needs to be unique.
   */
  public async createDummyObservation(forObservations: Observation[]): Promise<Observation | undefined> {
    const invasivePlantSpecies = await this.randomInvasivePlantSpecies();
    const jurisdiction = await this.randomJurisdiction();
    const agency = await this.randomSpeciesAgencyCodes();
    const density = await this.randomSpeciesDensityCodes();
    const distribution = await this.randomSpeciesDistributionCodes();
    const surveyType = await this.randomSurveyTypeCodes();
    const soilTexture = await this.randomSoilTextureCodes();
    const geometry = await this.randomSurveyGeometryCodes();
    const useCode = await this.randomSpecificUseCodes();
    const groundSlope = await this.randomGroundSlopeCodes();
    const groundAspect = await this.randomGroundAspectCodes();
    const proposedAction = await this.randomProposedActionCodes();

    const sampleTakenIndicator = faker.random.boolean();
    let sampleIdentifier = faker.lorem.word();
    const rangeUnitNumber = String(faker.random.number());

    if (!sampleTakenIndicator) {
      sampleIdentifier = undefined;
    }

    if (!jurisdiction || ! invasivePlantSpecies) {
      return undefined;
    }

    const observation: Observation = {
      observation_id: this.getUniqueObservationId(forObservations),

      // Basic //
      // Location
      lat: this.randomLat(),
      long: this.randomLong(),
      date: this.randomDateString(),
      // Observer
      observerFirstName: faker.name.firstName(),
      observerLastName: faker.name.lastName(),
      // Invasive Plant
      speciesAgency: agency,
      species: invasivePlantSpecies,
      jurisdiction: jurisdiction,
      density: density,
      distribution: distribution,
      observationType: surveyType,
      specificUseCode: useCode,
      soilTexture: soilTexture,
      width: this.randomIntFromInterval(4, 20),
      length: this.randomIntFromInterval(4, 20),
      accessDescription: faker.lorem.sentences(),
      // Advanced //
      // indicators
      sampleTakenIndicator: sampleTakenIndicator,
      wellIndicator: faker.random.boolean(),
      legacySiteIndicator: faker.random.boolean(),
      edrrIndicator: faker.random.boolean(),
      researchIndicator: faker.random.boolean(),
      specialCareIndicator: faker.random.boolean(),
      biologicalIndicator: faker.random.boolean(),
      aquaticIndicator: faker.random.boolean(),
      // Further details
      proposedAction: proposedAction,
      sampleIdentifier: sampleIdentifier,
      rangeUnitNumber: rangeUnitNumber,
      aspectCode: groundAspect,
      slopeCode: groundSlope,
      observationGeometry: geometry,
    };
    return observation;
  }

  /**
   * Generate a unique incremental id based on given observations
   * @param observations objects
   */
  private getUniqueObservationId(observations: Observation[]): number {
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
   * Return a random date in string format
   */
  public randomDateString() {
    const date = faker.date.past();
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * Generate a random number
   * @param min number
   * @param max number
   */
  public randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

   /**
   * Generate a random longitude within bc
   */
  public randomLong(): number {
    const max = 127977180;
    const min = 120845602;

    const a = this.randomIntFromInterval(0, 7);
    const b = this.randomIntFromInterval(845602, 977180);
    const z = `-12${a}.${b}`;
    return +z;

    const randomString = String(this.randomIntFromInterval(min, max));
    const withDecimal = randomString.slice(0, 3) + '.' + randomString.slice(2);
    return Math.abs(+withDecimal) * -1;
  }

  /**
   * Generate a random latitude within bc
   */
  public randomLat() {
    const max = 58202679;
    const min = 50713134;

    const a = this.randomIntFromInterval(0, 8);
    const b = this.randomIntFromInterval(713134, 202679);
    const z = `5${a}.${b}`;
    return +z;

    const randomString = String(this.randomIntFromInterval(min, max));
    const withDecimal = randomString.slice(0, 2) + '.' + randomString.slice(1);
    return +withDecimal;
  }

  /**
   * Generate random coordinates in BC
   * @param number of coordinates
   */
  public generateCoordinates(number: number): LatLong[] {
    const coordinates: LatLong[] = [];
    for (let _i = 0; _i < number; _i++) {
      coordinates.push( {
        latitude: this.randomLat(),
        longitude: this.randomLong()
      });
    }
    return coordinates;
  }

}
