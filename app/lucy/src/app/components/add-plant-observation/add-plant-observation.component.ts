import { Component, OnInit, Input, AfterViewChecked, NgZone } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';

import 'node_modules/leaflet/';
import { FormMode, ObservationInvasivePlantSpecies, Observation } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { AlertService } from 'src/app/services/alert.service';
import { ObservationService } from 'src/app/services/observation.service';
declare let L;

@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css']
})

export class AddPlantObservationComponent implements OnInit, AfterViewChecked {

  /**
   * TODO: REMOVE - Its For testing
   */
  get testBtnName(): string {
    return this.readonly ? `Switch To Edit Mode` : `Switch To View Mode`;
  }
   /* ***** */

  private _visibleClasses = [];

  get visibleClasses(): string[] {
    return this._visibleClasses;
  }
  set visibleClasses(classNames: string[]) {
    this._visibleClasses = classNames;
  }
  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  // Get
  get mode(): FormMode {
    return this._mode;
  }
  // Set
  @Input() set mode(mode: FormMode) {
    console.log(`Form mode is ${mode}`);
    this._mode = mode;
  }
  ////////////////////

  get readonly(): boolean {
    return this.mode === FormMode.View;
  }

  ///// Invasive plant objects
  private _object: Observation;
  // Get
  get observationObject(): Observation {
    this.initializeObjectIfDoesntExist();
    return this._object;
  }
  // Set
  @Input() set observationObject(object: Observation) {
    this._object = object;
  }
  ////////////////////

  constructor(private zone: NgZone, private validation: ValidationService, private alert: AlertService, private observationService: ObservationService) { }

  ngOnInit() {
    setTimeout(() => {
      this.zone.run(() => {
        // this.mode = FormMode.Edit;
        this.mode = FormMode.Create;
      });
    }, 1000);
  }

  ngAfterViewChecked(): void {
  }

  initializeObjectIfDoesntExist() {
    if (!this._object) {
       this._object = {
        observation_Id: -1,
        lat: undefined,
        long: undefined,
        date: `2019-05-30`,
        invasivePlantSpecies: []
      };
      console.log(`initialized observation`);
    }
  }

  invasivePlantSpeciesChanged(event: ObservationInvasivePlantSpecies[]) {
    this.observationObject.invasivePlantSpecies = event;
    console.dir(this.observationObject);
  }

  basicInfoChanged(event: Observation) {
    this.observationObject.lat = event.lat;
    this.observationObject.long = event.long;
    this.observationObject.observation_Id = event.observation_Id;
    console.dir(this.observationObject);
  }

  public onIntersection({ target, visible }: { target: Element; visible: boolean }): void {
    const visibleClasses = [];
    this.visibleClasses.push(target.className);
    this.visibleClasses.forEach(element => {
      if (element !== target.className) {
        visibleClasses.push(element);
      } else if (element === target.className && visible) {
        visibleClasses.push(element);
      }
    });
    this.visibleClasses = visibleClasses;
  }

  async submitAction() {
    const validationMessage = this.validation.isValidObservationMessage(this.observationObject);
    if (validationMessage === null) {
      console.log(` ***** can submit *****`);
      const success = await this.observationService.submitObservation(this.observationObject);
      if (success) {
        this.alert.show(`Success`, `Submitted`, null);
      } else {
        this.alert.show(`Error`, `Submission failed`, null);
      }
    } else {
      this.alert.show(`Incomplete data`, validationMessage, null);
    }
  }

   /**
   * TODO: REMOVE - Its For testing
   */
  testBtnClicked() {
    if (this.mode === FormMode.View) {
      this.mode = FormMode.Edit;
    } else {
      this.mode = FormMode.View;
    }
  }
   /* ***** */
}
