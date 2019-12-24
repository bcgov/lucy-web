
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

  speciesBeingTreated: SpeciesObservedTreated[];
  speciesNotBeingTreated: Observation[];
  species: InvasivePlantSpecies[];

  // addQuickObservationModal: AddQuickObservationModalComponent = new AddQuickObservationModalComponent(this.modalService, this.codeTables, this.dropdowns);

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


  async ngOnInit() {
    if (this.mode === FormMode.Create) {
      this.speciesBeingTreated = [];
      this.speciesNotBeingTreated = [];
    } else if (this.mode === FormMode.Edit) {
      this.speciesBeingTreated = this.responseBody.speciesObservations;
      this.loadingService.add();
      await this.fetchObservationsForLocation(this.responseBody.lat, this.responseBody.long);
      this.loadingService.remove();
    } else { // form is in view mode
      this.speciesBeingTreated = this.responseBody.speciesObservations;
    }
  }

  async ngOnChanges(change: SimpleChanges) {
    // ignore duplicate/unnecessary fired change events
    if (change.responseBody.currentValue === change.responseBody.previousValue) {
      return;
    }
    if (this.mode === FormMode.View) {
      return;
    }

    if (change.responseBody.currentValue.latitude !== undefined && change.responseBody.currentValue.longitude !== undefined) {
        const lat = change.responseBody.currentValue.latitude;
        const long = change.responseBody.currentValue.longitude;
        this.loadingService.add();
        await this.fetchObservationsForLocation(lat, long);
        this.loadingService.remove();
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
    const observations = await this.observationService.getByLocation(lat, long);
    for (const o of observations) {
      if ((this.indexOfObservationInSpeciesNotBeingTreated(o) === -1) && (this.indexOfSpeciesInSpeciesBeingTreated(o) === -1)) {
        this.speciesNotBeingTreated.push(o);
      }
    }
  }

  private notifyChangeEvent() {
    if (this.speciesBeingTreated && !this.inViewMode) {
      this.speciesTreatedChanged.emit(this.speciesBeingTreated);
    }
  }

  moveNotTreatedToBeingTreated(s: Observation) {
    // remove s object from speciesNotBeingTreated
    let index = this.speciesNotBeingTreated.indexOf(s);
    this.speciesNotBeingTreated.splice(index, 1);

    const el = document.getElementById(s.species.commonName);
    el.className = 'card speciesNotTreatedCard container animated animation-config bounceOutUp';

    // check for duplicates in speciesBeingTreated
    index = this.indexOfSpeciesInSpeciesBeingTreated(s);
    if ( index >= 0) {
      this.speciesBeingTreated.splice(index, 1);
    }

    this.speciesBeingTreated.push({observation: s, treatmentAreaCoverage: 0, chemicalTreatmentId: undefined, observation_chemical_treatment_id: undefined});

    el.className = 'card speciesNotTreatedCard container animated animation-config bounceInUp';

    this.notifyChangeEvent();
  }

  moveBeingTreatedToNotTreated(s: SpeciesObservedTreated) {
    // remove s object from speciesBeingTreated
    let index = this.speciesBeingTreated.indexOf(s);
    this.speciesBeingTreated.splice(index, 1);

    // $(s.observation.species.commonName).removeClass('bounceInUp');
    // $(s.observation.species.commonName).addClass('bounceOutDown');

    // check for duplicates in speciesNotBeingTreated
    index = this.speciesNotBeingTreated.indexOf(s.observation);
    if (index >= 0) {
      this.speciesNotBeingTreated.splice(index, 1);
    }

    s.treatmentAreaCoverage = 0;
    this.speciesNotBeingTreated.push(s.observation);

    // $(s.observation.species.commonName).removeClass('bounceOutDown');
    // $(s.observation.species.commonName).addClass('bounceInDown');

    this.notifyChangeEvent();
  }

  updatedAreaCoverage(event: any, s: SpeciesObservedTreated) {
    const index = this.speciesBeingTreated.findIndex((element) => element === s);
    this.speciesBeingTreated[index].treatmentAreaCoverage = event;
    this.notifyChangeEvent();
  }

  open() {
    // this.modalService.open(this.addObsModal);
    this.modalService.open(`Feature in progress`);
  }

  indexOfSpeciesInSpeciesBeingTreated(o: Observation): number {
    const observationMatcher = (element) => element.observation.observation_id === o.observation_id;
    return this.speciesBeingTreated.findIndex(observationMatcher);
  }

  indexOfObservationInSpeciesNotBeingTreated(o: Observation): number {
    const observationMatcher = (element) => element.observation_id === o.observation_id;
    return this.speciesNotBeingTreated.findIndex(observationMatcher);
  }
}
