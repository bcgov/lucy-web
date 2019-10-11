import { Injectable } from '@angular/core';
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
import { MechanicalTreatment, MechanicalTreatmentMethodsCodes, MechanicalDisposalMethodsCodes, MechanicalSoilDisturbanceCodes, MechanicalRootRemovalCodes, MechanicalIssueCodes, MechanicalTreatmentProviders } from '../models/MechanicalTreatment';
import { ObservationService } from './observation.service';
import { MapMarker } from '../components/Utilities/map-preview/map-preview.component';
import { UIConfigObject } from './form/form.service';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  constructor(private codeTables: CodeTableService, private observationService: ObservationService) { }

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
          }
          if (field.isLocationField) {
            const fakeLat = await this.fakeFieldValue(field.latitude);
            field.latitude.value = fakeLat.fieldValue;
            responseBody[field.latitude.key] = fakeLat.bodyValue;
            const fakeLong = await this.fakeFieldValue(field.longitude);
            field.longitude.value = fakeLong.fieldValue;
            responseBody[field.longitude.key] = fakeLong.bodyValue;
          } else {
            const fake = await this.fakeFieldValue(field);
            field.value = fake.fieldValue;
            responseBody[field.key] = fake.bodyValue;
          }
        }
      }
    }
    // console.dir(config);
    // console.dir(this.responseBody)
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
      const randomIndex = this.randomNumber(0, field.dropdown.length - 1);
      const value = field.dropdown[randomIndex];
      const vieldValue = value;
      let selectedID = 0;
      for (const key in value) {
        if (key.toLowerCase().indexOf(`id`) !== -1) {
          selectedID = value[key];
          break;
        }
      }
      return {
        fieldValue: vieldValue,
        bodyValue: selectedID,
      }
    }

    if (field.key.toLowerCase() === `lat` || field.key.toLowerCase() === `latitude`) {
      const value = this.randomLat();
      return {
        fieldValue: value,
        bodyValue: value,
      }
    }

    if (field.key.toLowerCase() === `lon` || field.key.toLowerCase() === `long` ||field.key.toLowerCase() === `longitude` ) {
      const value = this.randomLong();
      return {
        fieldValue: value,
        bodyValue: value,
      }
    }

    console.log(`Unknown field ${field}`);
    console.dir(field);
    return {
      fieldValue: undefined,
      bodyValue: undefined,
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
    return await this.createDummyObservationsOLD(number);
  } 
  
   ////////////////// REMOVE EVEYRYTHING BELOW THIS LINE //////////////////
   ////////////////// REMOVE EVEYRYTHING BELOW THIS LINE //////////////////
   ////////////////// REMOVE EVEYRYTHING BELOW THIS LINE //////////////////
   ////////////////// REMOVE EVEYRYTHING BELOW THIS LINE //////////////////
   ////////////////// REMOVE EVEYRYTHING BELOW THIS LINE //////////////////

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

  public async randomMechanicalMethodCodes(): Promise<MechanicalTreatmentMethodsCodes | undefined> {
    const codes = await this.codeTables.getMechanicalTreatmentMethodsCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  //---
  public async randomMechanicalDisposalMethodsCodes(): Promise<MechanicalDisposalMethodsCodes | undefined> {
    const codes = await this.codeTables.getMechanicalDisposalMethodCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomMechanicalSoilDisturbanceCodes(): Promise<MechanicalSoilDisturbanceCodes | undefined> {
    const codes = await this.codeTables.getMechanicalSoilDisturbanceCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomMechanicalRootRemovalCodes(): Promise<MechanicalRootRemovalCodes | undefined> {
    const codes = await this.codeTables.getsMechanicalRootRemovalCodesCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomMechanicalIssueCodes(): Promise<MechanicalIssueCodes | undefined> {
    const codes = await this.codeTables.getMechanicalIssueCodesCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async randomProviderContractor(): Promise<MechanicalTreatmentProviders | undefined> {
    const codes = await this.codeTables.getMechanicalTreatmentProviderCodes();
    if (codes.length > 0) {
      return codes[this.randomIntFromInterval(0, codes.length - 1)];
    } else {
      return undefined;
    }
  }

  public async createDummyMechanicalTreatment(): Promise<MechanicalTreatment> {
    const invasivePlantSpecies = await this.randomInvasivePlantSpecies();
    const agency = await this.randomSpeciesAgencyCodes();
    const mechanicalMethod = await this.randomMechanicalMethodCodes();
    const observations = await this.observationService.getAll();
    const mechanicalDisposalMethodsCodes = await this.randomMechanicalDisposalMethodsCodes();
    const mechanicalSoilDisturbanceCodes = await this.randomMechanicalSoilDisturbanceCodes();
    const mechanicalRootRemovalCodes = await this.randomMechanicalRootRemovalCodes();
    const mechanicalIssueCodes = await this.randomMechanicalIssueCodes();
    const providerContractor = await this.randomProviderContractor();

    const observation = observations[0];
    if (!observation) {
      console.log(`could not find observations to generate a treatment`);
      return undefined;
    }
    const mechanicalTreatment: MechanicalTreatment = {
      mechanical_treatment_id: 1,
      latitude: this.randomLat(),
      longitude: this.randomLong(),
      verticalDimension: this.randomIntFromInterval(4, 20),
      horizontalDimension: this.randomIntFromInterval(4, 20),
      applicatorFirstName: faker.name.firstName(),
      applicatorLastName: faker.name.lastName(),
      secondaryApplicatorFirstName: faker.name.firstName(),
      secondaryApplicatorLastName: faker.name.lastName(),
      date: this.randomDateString(),
      paperFileReference: faker.lorem.word(),
      comment: faker.lorem.sentences(),
      observation: observation,
      species: invasivePlantSpecies,
      speciesAgency: agency,
      mechanicalMethod: mechanicalMethod,
      signageOnSiteIndicator: faker.random.boolean(),
      mechanicalDisposalMethod: mechanicalDisposalMethodsCodes,
      soilDisturbance: mechanicalSoilDisturbanceCodes,
      rootRemoval: mechanicalRootRemovalCodes,
      issue: mechanicalIssueCodes,
      providerContractor: providerContractor,
    };

    return mechanicalTreatment;
  }

  /**
   * Create and return a random array of observations
   * @param number of observations
   */
  async createDummyObservationsOLD(number: number): Promise<Observation[]> {
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

    // if (!sampleTakenIndicator) {
    //   sampleIdentifier = undefined;
    // }

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
      horizontalDimension: this.randomIntFromInterval(4, 20),
      verticalDimension: this.randomIntFromInterval(4, 20),
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
      mechanicalTreatments: [],
    };
    return observation;
  }


  /**
   * Generate a random number
   * @param min number
   * @param max number
   */
  public randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}
