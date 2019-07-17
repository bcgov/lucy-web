import { Component, OnInit, Input, AfterViewChecked, NgZone } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { SideNavComponent } from 'src/app/components/add-plant-observation/side-nav/side-nav.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
// import 'node_modules/leaflet/';
import { FormMode, SpeciesObservations, Observation } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { AlertService } from 'src/app/services/alert.service';
import { ObservationService } from 'src/app/services/observation.service';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes } from 'src/app/constants';
// declare let L;


@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css'],
})

@NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]})


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

  get invasiveSpecies(): SpeciesObservations[] {
    if (!this.observationObject || !this.observationObject.speciesObservations) { return []; }
    return this.observationObject.speciesObservations;
  }

  ///// Invasive plant objects
  private _object: Observation;
  // Get
  get observationObject(): Observation {
    return this._object;
  }
  // Set
  @Input() set observationObject(object: Observation) {
    this._object = object;
  }
  ////////////////////

  constructor(private zone: NgZone, private validation: ValidationService, private alert: AlertService, private observationService: ObservationService, private router: RouterService) { }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewChecked(): void {
  }

  private initialize() {

    if (this.viewing()) {
      const id = this.idInParams();
      if (!id) { this.showErrorPage(); }
      this.mode = FormMode.View;
      this.fetchObservation(this.idInParams());

    } else if (this.editing()) {
      const id = this.idInParams();
      if (!id) { this.showErrorPage(); }
      this.mode = FormMode.Edit;

    } else if (this.creating()) {
      this.initializeObjectIfDoesntExist();
      this.mode = FormMode.Create;
    } else {
      this.showErrorPage();
    }
  }

  private showErrorPage() {
    console.log('Throw error');
  }

  private viewing() {
    const current = this.router.current;
    return (current === AppRoutes.ViewObservation);
  }

  private creating() {
    const current = this.router.current;
    return (current === AppRoutes.AddObservation);
  }

  private editing() {
    const current = this.router.current;
    return (current === AppRoutes.EditObservation);
  }

  idInParams(): number | undefined {
    const current = this.router.current;
    if (current === AppRoutes.ViewObservation || current === AppRoutes.EditObservation) {
      const id = this.router.routeId;
      if (id) {
        return id;
      }
    }
    return undefined;
  }

  async fetchObservation(id: number) {
    console.log(`Fetching`);
    const object = await this.observationService.getWithId(id);
    console.log(this.observationObject);
    this.observationObject = object;
    console.log(this.observationObject);
  }

  initializeObjectIfDoesntExist() {
    if (!this._object) {
       this._object = {
        observation_id: -1,
        lat: undefined,
        long: undefined,
        observerFirstName: undefined,
        observerLastName: undefined,
        observerOrganization: undefined,
        date: `2019-05-30`,
        speciesObservations: []
      };
      console.log(`initialized observation`);
    }
  }

  invasivePlantSpeciesChanged(event: SpeciesObservations[]) {
    this.observationObject.speciesObservations = event;
  }

  basicInfoChanged(event: Observation) {
    this.observationObject.lat = event.lat;
    this.observationObject.long = event.long;
    this.observationObject.observation_id = event.observation_id;
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
