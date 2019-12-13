
import { Component, OnInit, SimpleChanges, OnChanges, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ObservationService } from 'src/app/services/observation.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CodeTableService } from 'src/app/services/code-table.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { InvasivePlantSpecies, Observation } from 'src/app/models/observation';
import { SpeciesObservedTreated } from 'src/app/models/ChemicalTreatment';
import { FormControl, Validators } from '@angular/forms';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { FormMode } from 'src/app/models';
import { AddQuickObservationModalComponent } from '../../Utilities/add-quick-observation-modal/add-quick-observation-modal.component';

@Component({
  selector: 'app-species-treated',
  templateUrl: './species-treated.component.html',
  styleUrls: ['./species-treated.component.css']
})
export class SpeciesTreatedComponent implements OnInit, OnChanges {

  @ViewChild(AddQuickObservationModalComponent) addObsModal: AddQuickObservationModalComponent;

  // Base form response body
  private _responseBody: any = {};
  get responseBody(): any {
    return this._responseBody;
  }
  @Input() set responseBody(responseBody: any) {
    this._responseBody = responseBody;
  }

  _speciesBeingTreated: SpeciesObservedTreated[] = [];
  _speciesNotBeingTreated: SpeciesObservedTreated[] = [];
  species: InvasivePlantSpecies[];

  // addQuickObservationModal: AddQuickObservationModalComponent = new AddQuickObservationModalComponent(this.modalService, this.codeTables, this.dropdowns);

  observations: Observation[] = [];
  inViewMode = false;
  addQuickObs = false;
  object: any;

  percentageFieldVerification = {
    required: true,
    positiveNumber: true,
    maximumValue: 100,
  };

  @Output() speciesTreatedChanged = new EventEmitter<SpeciesObservedTreated[]>();

  constructor(private loadingService: LoadingService,
              private observationService: ObservationService,
              private modalService: NgbModal,
              private codeTables: CodeTableService,
              private dropdowns: DropdownService) { }


  ngOnInit() {
  }

  async ngOnChanges(change: SimpleChanges) {
    if (change.responseBody.currentValue.latitude !== undefined && change.responseBody.currentValue.longitude !== undefined) {
      const latChanged = change.responseBody.currentValue.latitude !== change.responseBody.previousValue.latitude;
      const longChanged = change.responseBody.currentValue.longitude !== change.responseBody.previousValue.longitude;
      if (latChanged || longChanged) {
        console.dir(change);
        const lat = change.responseBody.currentValue.latitude;
        const long = change.responseBody.currentValue.longitude;
        await this.fetchObservationsForLocation(lat, long);
        for (const o of this.observations) {
          this._speciesNotBeingTreated.push({observationObject: o, observation: o.observation_id, treatmentAreaCoverage: 0});
        }
      }
    }

    if (change.responseBody.currentValue.mode !== undefined) {
      if (change.responseBody.currentValue.mode === FormMode.View) {
        this.inViewMode = true;
      } else {
        this.inViewMode = false;
      }
    }
  }

  private async fetchObservationsForLocation(lat: number, long: number) {
    this.loadingService.add();
    const observations = await this.observationService.getByLocation(lat, long);
    this.observations = observations;
    this.loadingService.remove();
  }

  private notifyChangeEvent() {
    if (this.speciesBeingTreated && !this.inViewMode) {
      this.speciesTreatedChanged.emit(this.speciesBeingTreated);
    }
  }

  set speciesBeingTreated(s: SpeciesObservedTreated[]) {
    this.speciesBeingTreated = [];
    for (const elem of s) {
        this._speciesBeingTreated.push(elem);
    }
  }

  get speciesBeingTreated(): SpeciesObservedTreated[] {
      return this._speciesBeingTreated;
  }

  set speciesNotBeingTreated(s: SpeciesObservedTreated[]) {
      this.speciesNotBeingTreated = [];
      for (const elem of s) {
        this.speciesNotBeingTreated.push(elem);
      }
  }

  get speciesNotBeingTreated(): SpeciesObservedTreated[] {
      return this._speciesNotBeingTreated;
  }

  moveNotTreatedToBeingTreated(s: SpeciesObservedTreated) {
    // remove s object from speciesNotBeingTreated
    let index = this.speciesNotBeingTreated.indexOf(s);
    this.speciesNotBeingTreated.splice(index, 1);

    // check for duplicates in speciesBeingTreated
    index = this.indexOfSpeciesInSpeciesBeingTreated(s.observationObject.species);
    if ( index >= 0) {
      this.speciesBeingTreated.splice(index, 1);
    }

    this._speciesBeingTreated.push(s);


    this.notifyChangeEvent();
  }

  moveBeingTreatedToNotTreated(s: SpeciesObservedTreated) {
    // remove s object from speciesBeingTreated
    let index = this.speciesBeingTreated.indexOf(s);
    this.speciesBeingTreated.splice(index, 1);

    // check for duplicates in speciesNotBeingTreated
    index = this.speciesNotBeingTreated.indexOf(s);
    if (index >= 0) {
      this.speciesNotBeingTreated.splice(index, 1);
    }

    s.treatmentAreaCoverage = 0;
    this._speciesNotBeingTreated.push(s);

    this.notifyChangeEvent();
  }

  updatedAreaCoverage(event: any, s: SpeciesObservedTreated) {
    const index = this._speciesBeingTreated.findIndex((element) => element === s);
    this._speciesBeingTreated[index].treatmentAreaCoverage = event;
    this.notifyChangeEvent();
  }

  open() {
    // this.modalService.open(this.addObsModal);
    this.modalService.open(`Feature in progress`);
  }

  indexOfSpeciesInSpeciesBeingTreated(sp: InvasivePlantSpecies): number {
    this.speciesBeingTreated.forEach((item, index) => {
      if (item.observationObject.species === sp) {
        return index;
      }
    });
    return -1;
  }

  indexOfSpeciesInSpeciesNotBeingTreated(sp: InvasivePlantSpecies): number {
    this.speciesNotBeingTreated.forEach((item, index) => {
      if (item.observationObject.species === sp) {
        return index;
      }
    });
    return -1;
  }
}
