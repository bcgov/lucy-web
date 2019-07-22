import { Injectable } from '@angular/core';
import { LatLong } from '../components/map-preview/map-preview.component';
import { Observation, InvasivePlantSpecies, Jurisdiction } from '../models';
import { CodeTableService } from './code-table.service';
import * as faker from 'faker';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  constructor(private codeTables: CodeTableService) { }

  /**
   * Return a random jurisdiction
   */
  public async randomJurisdiction():  Promise<Jurisdiction | undefined> {
    const jurisdiction = await this.codeTables.getJuristictions();
    if (jurisdiction.length > 0) {
      return jurisdiction[this.randomIntFromInterval(0, jurisdiction.length - 1)];
    } else {
      return undefined;
    }
  }

  /**
   * Return a random invasive plant species.
   */
  public async randomInvasivePlantSpecies(): Promise<InvasivePlantSpecies | undefined> {
    const invasivePlantSpecies = await this.codeTables.getInvasivePlantSpecies();
    if (invasivePlantSpecies.length > 0) {
      return invasivePlantSpecies[this.randomIntFromInterval(0, invasivePlantSpecies.length - 1)];
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
    if (!jurisdiction || ! invasivePlantSpecies) {
      return undefined;
    }
    const observation: Observation = {
      observation_id: this.getUniqueObservationId(forObservations),
      lat: this.randomLat(),
      long: this.randomLong(),
      date: this.randomDateString(),
      observerFirstName: faker.name.firstName(),
      observerLastName: faker.name.lastName(),
      observerOrganization: {
        name: faker.company.companyName()
      },
      speciesObservations: [{
        observationSpecies_Id: 1,
        species: invasivePlantSpecies,
        jurisdiction: jurisdiction,
        width: this.randomIntFromInterval(4, 20),
        length: this.randomIntFromInterval(4, 20),
        accessDescription: faker.lorem.sentences(),
      }]
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
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
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
