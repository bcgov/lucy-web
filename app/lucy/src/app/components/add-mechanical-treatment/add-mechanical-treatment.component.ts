import { Component, OnInit, Input, AfterViewChecked, NgZone, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormMode, Observation } from 'src/app/models';
import { ErrorService, ErrorType } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { ValidationService } from 'src/app/services/validation.service';
import { AlertService } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DummyService } from 'src/app/services/dummy.service';
import { UserAccessType } from 'src/app/models/Role';
import { AppRoutes } from 'src/app/constants';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import { MechanicalTreatmentService } from 'src/app/services/mechanical-treatment.service';

@Component({
  selector: 'app-add-mechanical-treatment',
  templateUrl: './add-mechanical-treatment.component.html',
  styleUrls: ['./add-mechanical-treatment.component.css']
})
export class AddMechanicalTreatmentComponent implements OnInit, AfterViewChecked {

  private componentName = `Mechanical Treatment`;

  /**
   * Reference to sections in form used for side-nav
   */
  @ViewChild('advanced') advancedSection: ElementRef;
  @ViewChild('basic') basicSection: ElementRef;

  /**
   * User access type
   */
  public accessType: UserAccessType = UserAccessType.DataViewer;

  /**
   * Show/Hide Add edit button
   * This value will only change
   * when is called ngOnInit().
   * if you wish to manually refresh,
   * call this.setAccessType().
   */
  public get isDataEditor(): boolean {
    return this.roles.canCreateObservation(this.accessType);
  }


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
    let prefix: string;
    switch (this.mode) {
      case FormMode.Create: {
        prefix = `Submit`;
        break;
      }
      case FormMode.Edit: {
        prefix = `Submit Edits to`;
        break;
      }
      case FormMode.View: {
        if (this.inReviewMode) {
          prefix = `Confirm`;
        }
        break;
      }
      default:
        return `How are you here?`;
    }
    if (prefix) {
      return `${prefix} ${this.componentName}`;
    } else {
      return ``;
    }
  }
  /* ***** */

  /**
   * Page title for different states
   */
  get pageTitle(): string {
    let prefix: string;
    switch (this.mode) {
      case FormMode.Create: {
        prefix = `Add`;
        break;
      }
      case FormMode.Edit: {
        prefix = `Edit`;
        break;
      }
      case FormMode.View: {
        if (this.inReviewMode) {
          prefix = `Confirm`;
        }
        prefix = `View`;
        break;
      }
      default:
        return `How are you here?`;
    }
    if (prefix) {
      return `${prefix} ${this.componentName}`;
    } else {
      return ``;
    }
  }
  /* ***** */

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
    return (current === AppRoutes.ViewMechanicalTreatment);
  }

  private get creating() {
    const current = this.router.current;
    return (current === AppRoutes.AddMechanicalTreatment);
  }

  private get editing() {
    const current = this.router.current;
    return (current === AppRoutes.EditMechanicalTreatment);
  }
  ////////////////////

  // get invasiveSpecies(): SpeciesObservations[] {
  //   if (!this.observationObject || !this.observationObject.speciesObservations) { return []; }
  //   return this.observationObject.speciesObservations;
  // }

  ///// Invasive plant objects
  private _object: MechanicalTreatment;
  // Get
  get object(): MechanicalTreatment {
    return this._object;
  }
  // Set
  @Input() set object(object: MechanicalTreatment) {
    this._object = object;
  }
  ////////////////////

  constructor (
    private mechanicalTreatmentService: MechanicalTreatmentService,
    private errorService: ErrorService,
    private userService: UserService,
    private roles: RolesService,
    private validation: ValidationService,
    private alert: AlertService,
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

  /**
   * Setting User's access type
   */
  private async setAccessType() {
    this.loadingService.add();
    this.accessType = await this.userService.getAccess();
    this.loadingService.remove();
  }

  private async initialize() {
    await this.setAccessType();
    if (this.viewing) {
      const id = this.idInParams();
      if (!id) {
        this.errorService.show(ErrorType.NotFound);
      }
      this.mode = FormMode.View;
      this.fetchMechanicalTreatment(this.idInParams());

    } else if (this.editing) {
      if (!this.isDataEditor) {
        this.errorService.show(ErrorType.AccessDenied);
      }
      const id = this.idInParams();
      if (!id) {
        this.errorService.show(ErrorType.NotFound);
      }
      this.mode = FormMode.Edit;
      this.fetchMechanicalTreatment(this.idInParams());

    } else if (this.creating) {
      if (!this.isDataEditor) {
        this.errorService.show(ErrorType.AccessDenied);
      }
      this.initializeObjectIfDoesntExist();
      this.mode = FormMode.Create;
    } else {
      this.errorService.show(ErrorType.NotFound);
    }
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

  async fetchMechanicalTreatment(id: number) {
    // this.loadingService.add();
    // const object = await this.observationService.getWithId(id);
    // this.observationObject = object;
    // this.loadingService.remove();
  }

  initializeObjectIfDoesntExist() {
    if (!this._object) {
      this._object = this.mechanicalTreatmentService.getEmptyObject();
      console.log(`initialized Mechanical treatment`);
    }
  }

  /////////// Lottie ///////////
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

  /////////// End Lottie ///////////

  treatmentDetailsChanged(object: MechanicalTreatment) {

  }

  basicInfoChanged(object: MechanicalTreatment) {

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
  }

  async createObservation() {
    if (!this.creating) {
      return;
    }
    const validationMessage = this.validation.isValidMechanicalTreatmentMessage(this.object);
    if (validationMessage === null) {
      if (!this.inReviewMode) {
        this.changeToReviewMode();
        return;
      }
      this.loadingService.add();
      const success = await this.mechanicalTreatmentService.submit(this.object);
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
