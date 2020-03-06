
import { Component, OnInit, SimpleChanges, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ObservationService } from 'src/app/services/observation.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InvasivePlantSpecies, Observation } from 'src/app/models/observation';
import { SpeciesObservedTreated } from 'src/app/models/ChemicalTreatment';
import { FormMode } from 'src/app/models';
import { trigger, transition, animate } from '@angular/animations';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-species-treated',
  templateUrl: './species-treated.component.html',
  styleUrls: ['./species-treated.component.css'],
  animations: [
    trigger('notTreated', [
      transition(':leave',
        animate('1s')
      ),
      transition(':enter',
        animate('1s 1s')
      )
    ]),
    trigger('treated', [
      transition(':leave',
        animate('1s')
      ),
      transition(':enter',
        animate('1s 1s')
      )
    ])
  ]
})
export class SpeciesTreatedComponent implements OnInit, OnChanges {

  // @ViewChild(AddQuickObservationModalComponent) addObsModal: AddQuickObservationModalComponent;

  // Base form response body
  private _responseBody: any = {};
  get responseBody(): any {
    return this._responseBody;
  }
  @Input() set responseBody(responseBody: any) {
    this._responseBody = responseBody;
  }
  // Base form config
  private _config: any = {};
  get config(): any {
    return this._config;
  }
  @Input() set config(config: any) {
    this._config = config;
  }

  speciesBeingTreated: SpeciesObservedTreated[];
  speciesNotBeingTreated: Observation[];
  species: InvasivePlantSpecies[];
  treatment: any;

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

  showFocus(index: number) {
    const totalSpecies = this.speciesBeingTreated.length - 1;
    return (totalSpecies === index);
  }

  constructor(
    private loadingService: LoadingService,
    private observationService: ObservationService,
    private formService: FormService,
  ) { }


  async ngOnInit() {
    if (this.mode === FormMode.View) {
      this.speciesBeingTreated = this.responseBody.speciesObservations;
      return;
    }
    
    if (this.mode === FormMode.Create) {
      this.speciesBeingTreated = this.responseBody.speciesObservations || [];
      this.speciesNotBeingTreated = [];
    } else if (this.mode === FormMode.Edit) {
      this.loadingService.add();
      this.treatment = await this.formService.getObjectWithId(this.config.api, this.config.objectId);
      this.responseBody = this.treatment;
      this.speciesBeingTreated = this.responseBody.speciesObservations;
      this.speciesNotBeingTreated = [];

      await this.fetchObservationsForLocation();
      this.loadingService.remove();

      // hacky way of passing responseBody contents to base-form
      // otherwise fields have to be touched by user before base-form recognizes
      // that values exist
      this.notifyChangeEvent();
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

    if (change.responseBody.currentValue.spaceGeom !== undefined) {
        await this.fetchObservationsForLocation();
    }

    if (change.responseBody.currentValue.mode !== undefined) {
      if (change.responseBody.currentValue.mode === FormMode.View) {
        this.inViewMode = true;
      } else {
        this.inViewMode = false;
      }
    }
  }

  private async fetchObservationsForLocation() {
    const observations = await this.observationService.getAll();
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

    let card = document.getElementById(s.species.commonName);
    card.style.animation = 'bounceOutUp';
    card.style.animationDuration = '1s';

    // check for duplicates in speciesBeingTreated
    index = this.indexOfSpeciesInSpeciesBeingTreated(s);
          if ( index >= 0) {
      this.speciesBeingTreated.splice(index, 1);
    }

    this.speciesBeingTreated.push({observation: s, treatmentAreaCoverage: 0, chemicalTreatmentId: undefined, observation_chemical_treatment_id: undefined});
    card = document.getElementById(s.species.commonName);
    card.style.animation = 'bounceInDown';
    card.style.animationDuration = '1s';
    card.style.animationDelay = '1s';

    this.notifyChangeEvent();
  }

  moveBeingTreatedToNotTreated(s: SpeciesObservedTreated) {
    // remove s object from speciesBeingTreated
    let index = this.speciesBeingTreated.indexOf(s);
    this.speciesBeingTreated.splice(index, 1);

    // check for duplicates in speciesNotBeingTreated
    index = this.speciesNotBeingTreated.indexOf(s.observation);
    if (index >= 0) {
      this.speciesNotBeingTreated.splice(index, 1);
    }

    s.treatmentAreaCoverage = 0;
    this.speciesNotBeingTreated.push(s.observation);

    this.notifyChangeEvent();
  }

  updatedAreaCoverage(event: any, s: SpeciesObservedTreated) {
    const index = this.speciesBeingTreated.findIndex((element) => element === s);
    this.speciesBeingTreated[index].treatmentAreaCoverage = event;
    this.notifyChangeEvent();
  }

  openModal() {
    this.addQuickObs = true;
    $(`#addQuickObservationModal`).modal('show');
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
