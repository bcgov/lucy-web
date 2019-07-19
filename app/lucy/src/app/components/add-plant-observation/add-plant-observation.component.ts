import { Component, OnInit, Input, AfterViewChecked, NgZone, EventEmitter } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { SideNavComponent } from 'src/app/components/add-plant-observation/side-nav/side-nav.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
// import 'node_modules/leaflet/';
import { FormMode, SpeciesObservations, Observation } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { AlertService, AlertModalButton } from 'src/app/services/alert.service';
import { ObservationService } from 'src/app/services/observation.service';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes } from 'src/app/constants';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css'],
})

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddPlantObservationComponent implements OnInit, AfterViewChecked {

  // State flags
  private submitted = false;
  private inReviewMode = false;
  get readonly(): boolean {
    return this.mode === FormMode.View;
  }
  /////////////////

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  /////////////////

  /**
   * TODO: REMOVE - Its For testing
   */
  get testBtnName(): string {
    switch (this.mode) {
      case FormMode.Create: {
        return `Switch To View Mode`;
        break;
      }
      case FormMode.Edit: {
        return `Switch To View Mode`;
        break;
      }
      case FormMode.View: {
        if (this.creating()) {
          return `Switch To Create Mode`;
        } else {
          return `Switch To Edit Mode`;
        }
        break;
      }
      default:
        return `How are you here?`;
    }
  }
   /* ***** */

   /**
   * submit button title for different states
   */
  get submitBtnName(): string {
    switch (this.mode) {
      case FormMode.Create: {
        return `Submit Observation`;
        break;
      }
      case FormMode.Edit: {
        return `Submit Edits To Observation`;
        break;
      }
      case FormMode.View: {
        if (this.inReviewMode) {
          return `Confirm Observation`;
        }
        return ``;
        break;
      }
      default:
        return `How are you here?`;
    }
  }
   /* ***** */

    /**
   * Page title for different states
   */
  get pageTitle(): string {
    switch (this.mode) {
      case FormMode.Create: {
        return `Add Observation`;
        break;
      }
      case FormMode.Edit: {
        return `Edit Observation`;
        break;
      }
      case FormMode.View: {
        if (this.inReviewMode) {
          return `Confirm Entries`;
        }
        return `View Observation`;
        break;
      }
      default:
        return `How are you here?`;
    }
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

  constructor(private zone: NgZone, private validation: ValidationService, private alert: AlertService, private observationService: ObservationService, private router: RouterService, private loadingService: LoadingService) {
    this.lottieConfig = {
      path: 'https://assets4.lottiefiles.com/datafiles/jEgAWaDrrm6qdJx/data.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

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
    this.loadingService.add();
    const object = await this.observationService.getWithId(id);
    this.observationObject = object;
    this.loadingService.remove();
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
        date: undefined,
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
    if (this.mode === FormMode.Edit) {
      this.alert.show(`Not Yet`, `Edit feature is not yet implemented`, null);
      return;
    }
    const validationMessage = this.validation.isValidObservationMessage(this.observationObject);
    if (validationMessage === null) {
      console.log(` ***** can submit *****`);
      if (!this.inReviewMode) {
        this.changeToReviewMode();
        return;
      }
      this.loadingService.add();
      const success = await this.observationService.submitObservation(this.observationObject);
      this.loadingService.remove();
      if (success) {
        this.submitted = true;
      } else {
        this.alert.show(`Error`, `Submission failed`, null);
      }
    } else {
      this.alert.show(`Incomplete data`, validationMessage, null);
    }
  }

  viewInventory() {
    this.router.navigateTo(AppRoutes.Inventory);
  }

  changeToReviewMode() {
    if (!this.creating) {
      return;
    }
    this.inReviewMode = true;
    this.mode = FormMode.View;
  }

  exitReviewMode() {
    if (!this.creating) {
      return;
    }
    this.inReviewMode = false;
    this.mode = FormMode.Create;
  }
}
