import { Component, OnInit, Input, AfterViewChecked, NgZone, EventEmitter } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { SideNavComponent } from 'src/app/components/add-plant-observation/side-nav/side-nav.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormMode, Observation } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { AlertService, AlertModalButton } from 'src/app/services/alert.service';
import { ObservationService } from 'src/app/services/observation.service';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes } from 'src/app/constants';
import { LoadingService } from 'src/app/services/loading.service';
import { DummyService } from 'src/app/services/dummy.service';

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

  get submitedMessage(): string {
    if (this.creating) {
      return `Entries Added`;
    } else if (this.editing) {
      return `Edits Submitted`;
    }
    return ``;
  }

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  /////////////////

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

  ///// States Baed on Routes
  private get viewing() {
    const current = this.router.current;
    return (current === AppRoutes.ViewObservation);
  }

  private get creating() {
    const current = this.router.current;
    return (current === AppRoutes.AddObservation);
  }

  private get editing() {
    const current = this.router.current;
    return (current === AppRoutes.EditObservation);
  }
  ////////////////////

  // get invasiveSpecies(): SpeciesObservations[] {
  //   if (!this.observationObject || !this.observationObject.speciesObservations) { return []; }
  //   return this.observationObject.speciesObservations;
  // }

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

  constructor(
    private zone: NgZone,
    private validation: ValidationService,
    private alert: AlertService,
    private observationService: ObservationService,
    private router: RouterService,
    private loadingService: LoadingService,
    private dummy: DummyService) {
    this.lottieConfig = {
      path: 'https://assets4.lottiefiles.com/datafiles/jEgAWaDrrm6qdJx/data.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewChecked(): void {

  }

  private initialize() {
    if (this.viewing) {
      const id = this.idInParams();
      if (!id) { this.showErrorPage(); }
      this.mode = FormMode.View;
      this.fetchObservation(this.idInParams());

    } else if (this.editing) {
      const id = this.idInParams();
      if (!id) { this.showErrorPage(); }
      this.mode = FormMode.Edit;
      this.fetchObservation(this.idInParams());

    } else if (this.creating) {
      this.initializeObjectIfDoesntExist();
      this.mode = FormMode.Create;

    } else {
      this.showErrorPage();
    }
  }

  private showErrorPage() {
    console.log('Throw error');
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
      this._object = this.observationService.getEmptyObservation();
      console.log(`initialized observation`);
    }
  }

  //// Lottie
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

  ///////

  /**
   * Triggered with changed from
   * app-add-plant-observation-invasive-plant-species-cell Component.
   * Stores fields from event that are present in the component.
   * @param event Observation
   */
  invasivePlantSpeciesChanged(event: Observation) {
    /* DO NOT set object in this class to = event */
    this.observationObject.species = event.species;
    this.observationObject.jurisdiction = event.jurisdiction;
    this.observationObject.density = event.density;
    this.observationObject.distribution = event.distribution;
    this.observationObject.observationType = event.observationType;
    this.observationObject.observationGeometry = event.observationGeometry;
    this.observationObject.specificUseCode = event.specificUseCode;
    this.observationObject.soilTexture = event.soilTexture;
    this.observationObject.width = event.width;
    this.observationObject.length = event.length;
    this.observationObject.accessDescription = event.accessDescription;
  }

  /**
   * Triggered with changed from
   * app-add-plant-observation-basic-information Component.
   * Stores fields from event that are present in the component.
   * @param event Observation
   */
  basicInfoChanged(event: Observation) {
    /* DO NOT set object in this class to = event */
    this.observationObject.lat = event.lat;
    this.observationObject.long = event.long;
    this.observationObject.observation_id = event.observation_id;
    this.observationObject.observerFirstName = event.observerFirstName;
    this.observationObject.observerLastName = event.observerLastName;
    this.observationObject.speciesAgency = event.speciesAgency;
  }

  advancedDataChanged(event: Observation) {
    console.log(`TODO: CALL BACK NOT HANDLED`);
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
      this.editObservation();
    } else {
      this.createObservation();
    }
  }

  async editObservation() {
    if (!this.editing) {
      return;
    }
    const validationMessage = this.validation.isValidObservationMessage(this.observationObject);
    if (validationMessage === null) {
      const changes = await this.observationService.diffObservation(this.observationObject);
      console.log(changes);
      if (changes && changes.changed) {
        const confirmed = await this.alert.showConfirmation(`The following fields will be changed`, changes.diffMessage);
        if (!confirmed) {
          return;
        }
      } else {
        this.alert.show(`No Edits found`, `There are no edits to submit`);
        return;
      }
      this.loadingService.add();
      const success = await this.observationService.editObservation(this.observationObject);
      this.loadingService.remove();
      if (success) {
        this.submitted = true;
      } else {
        this.alert.show(`Error`, `Edit Submission failed`, null);
      }
    } else {
      this.alert.show(`Incomplete data`, validationMessage, null);
    }
  }

  async createObservation() {
    if (!this.creating) {
      return;
    }
    const validationMessage = this.validation.isValidObservationMessage(this.observationObject);
    if (validationMessage === null) {
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

  async generateObservationForTesting() {
    this.loadingService.add();
    const obj = await this.dummy.createDummyObservation([]);
    this.observationObject = obj;
    this.loadingService.remove();
  }
}
