
import { Component, OnInit, SimpleChanges, OnChanges, Input } from '@angular/core';
import { CodeTableService } from 'src/app/services/code-table.service';
import { ObservationService } from 'src/app/services/observation.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InvasivePlantSpecies, Observation } from 'src/app/models/observation';
import * as faker from 'faker';
import { FormControl, Validators } from '@angular/forms';

export interface SpeciesTreatedRecord {
  species: InvasivePlantSpecies;
  percentage: number;
}

@Component({
  selector: 'app-species-treated',
  templateUrl: './species-treated.component.html',
  styleUrls: ['./species-treated.component.css']
})
export class SpeciesTreatedComponent implements OnInit, OnChanges {

  // Base form response body
  private _responseBody: any = {};
  get responseBody(): any {
    return this._responseBody;
  }
  @Input() set responseBody(responseBody: any) {
    this._responseBody = responseBody;
  }

  _speciesBeingTreated: SpeciesTreatedRecord[] = [];
  _speciesNotBeingTreated: InvasivePlantSpecies[] = [];
  species: InvasivePlantSpecies[];

  observations: Observation[] = [];

  percentageFieldVerification = {
    required: true,
    positiveNumber: true,
    maximumValue: 100,
  };

  constructor(private codeTables: CodeTableService, 
              private loadingService: LoadingService, 
              private observationService: ObservationService) { }


  async ngOnInit() {
    // this.species = await this.codeTables.getInvasivePlantSpecies();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.responseBody.currentValue.latitude !== undefined && changes.responseBody.currentValue.longitude !== undefined) {
      const lat = changes.responseBody.currentValue.latitude;
      const long = changes.responseBody.currentValue.longitude;
      await this.fetchObservationsForLocation(lat, long);
      for (const o of this.observations) {
        this._speciesBeingTreated.push({species: o.species, percentage: undefined});
      }
    }
  }

  private async fetchObservationsForLocation(lat: number, long: number) {
    this.loadingService.add();
    const observations = await this.observationService.getByLocation(lat, long);
    this.observations = observations;
    this.loadingService.remove();
  }

  // TODO speciesBeingTreated is list of plant species taken from ???
  set speciesBeingTreated(s: SpeciesTreatedRecord[]) {
    for (const elem of s) {
        this._speciesBeingTreated.push(elem);
    }
  }

  get speciesBeingTreated(): SpeciesTreatedRecord[] {
      return this._speciesBeingTreated;
  }

  // // TODO speciesNotBeingTreated is list of plant species that have been observed within the treatment area but are not being addressed by the current treatment record
  set speciesNotBeingTreated(s: InvasivePlantSpecies[]) {
      for (const elem of s) {
        this._speciesNotBeingTreated.push(elem);
      }
  }

  get speciesNotBeingTreated(): InvasivePlantSpecies[] {
      return this._speciesNotBeingTreated;
  }

  moveNotTreatedToBeingTreated(s: InvasivePlantSpecies) {
    this._speciesBeingTreated.push({species: s, percentage: 0});
    if (this._speciesNotBeingTreated.includes(s)) {
      const index = this._speciesNotBeingTreated.findIndex((element) => element === s);
      this._speciesNotBeingTreated.splice(index, 1);
    }
  }

  moveBeingTreatedToNotTreated(s: SpeciesTreatedRecord) {
    this._speciesNotBeingTreated.push(s.species);
    const index = this._speciesBeingTreated.findIndex((element) => element === s);
    this._speciesBeingTreated.splice(index, 1);
  }
}
