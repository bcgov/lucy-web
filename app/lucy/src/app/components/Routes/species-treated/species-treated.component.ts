
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

  percentageFieldVerification = {
    required: true,
    positiveNumber: true,
    maximumValue: 100,
  };

    ///// Form Mode
    private _mode: FormMode = FormMode.View;
    get mode(): FormMode {
      return this._mode;
    }
    @Input() set mode(mode: FormMode) {
      this._mode = mode;
      if (this.mode === FormMode.View) {
        this.inViewMode = true;
      } else { this.inViewMode = false; }
    }

  @Output() speciesTreatedChanged = new EventEmitter<SpeciesObservedTreated[]>();

  constructor(private loadingService: LoadingService,
              private observationService: ObservationService,
              private modalService: NgbModal) { }


  ngOnInit() {
  }

  async ngOnChanges(change: SimpleChanges) {
    if (change.responseBody.currentValue === change.responseBody.previousValue) {
      return;
    }
    if (change.responseBody.currentValue.latitude !== undefined && change.responseBody.currentValue.longitude !== undefined) {
      const lat = change.responseBody.currentValue.latitude;
      const long = change.responseBody.currentValue.longitude;
      await this.fetchObservationsForLocation(lat, long)
      .then(() => {
        for (const o of this.observations) {
          const treatedIndex = this.indexOfSpeciesInSpeciesBeingTreated(o.species);
          const notTreatedIndex = this.indexOfSpeciesInSpeciesNotBeingTreated(o.species);
          // check to make sure that species aren't being duplicated in species lists
          if (treatedIndex === -1 && notTreatedIndex === -1) {
            this._speciesNotBeingTreated.push({observationObject: o, observation: o.observation_id, treatmentAreaCoverage: 0});
          }
        }
      });
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

    const el = document.getElementById(s.observationObject.species.commonName);
    el.className = 'card speciesNotTreatedCard container animated animation-config bounceOutUp';

    // check for duplicates in speciesBeingTreated
    index = this.indexOfSpeciesInSpeciesBeingTreated(s.observationObject.species);
    if ( index >= 0) {
      this.speciesBeingTreated.splice(index, 1);
    }

    this._speciesBeingTreated.push(s);

    el.className = 'card speciesNotTreatedCard container animated animation-config bounceInUp';

    // this.exitNBT = true;
    // this.enterBT = true;
    // this.exitBT = false;
    // this.enterNBT = false;

    this.notifyChangeEvent();
  }

  moveBeingTreatedToNotTreated(s: SpeciesObservedTreated) {
    // remove s object from speciesBeingTreated
    let index = this.speciesBeingTreated.indexOf(s);
    this.speciesBeingTreated.splice(index, 1);

    $(s.observationObject.species.commonName).removeClass('bounceInUp');
    $(s.observationObject.species.commonName).addClass('bounceOutDown');

    // check for duplicates in speciesNotBeingTreated
    index = this.speciesNotBeingTreated.indexOf(s);
    if (index >= 0) {
      this.speciesNotBeingTreated.splice(index, 1);
    }

    s.treatmentAreaCoverage = 0;
    this._speciesNotBeingTreated.push(s);

    $(s.observationObject.species.commonName).removeClass('bounceOutDown');
    $(s.observationObject.species.commonName).addClass('bounceInDown');


    // this.exitBT = true;
    // this.enterNBT = true;
    // this.exitNBT = false;
    // this.enterBT = false;

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
    const speciesInArray = (element) => element.observationObject.species.species_id === sp.species_id;
    return this.speciesBeingTreated.findIndex(speciesInArray);
  }

  indexOfSpeciesInSpeciesNotBeingTreated(sp: InvasivePlantSpecies): number {
    const speciesInArray = (element) => element.observationObject.species.species_id === sp.species_id;
    return this.speciesNotBeingTreated.findIndex(speciesInArray);
  }
}
