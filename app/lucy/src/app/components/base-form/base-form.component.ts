import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
} from '@angular/core';
import { FormMode } from 'src/app/models';
import { ErrorService, ErrorType } from 'src/app/services/error.service';
import { UserService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { AlertService } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { UserAccessType } from 'src/app/models/Role';
import { AppRoutes, AppConstants } from 'src/app/constants';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';
import { FormService} from 'src/app/services/form/form.service';
import * as moment from 'moment';
import { ApiService, APIRequestMethod } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

export enum FormType {
  Observation,
  MechanicalTreeatment
}
@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit, AfterViewChecked {
  // _formType: FormType;
  // get formType(): FormType | undefined {
  //   return this._formType;
  // }
  // set formType(type: FormType) {
  //   this._formType = type;
  // }
  public componentName = ` `;
  private responseBody = {};

  // Lottie Animation
  isLoading = false;
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  private formLoadingIcon = 'https://assets7.lottiefiles.com/datafiles/AX0rqrGV5ahKpWr/data.json';
  /////////////////

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
    return this.roles.canCreate(this.accessType);
  }

  // State flags
  private submitted = false;
  private inReviewMode = false;
  private showdiffViewer = false;
  get readonly(): boolean {
    return this.mode === FormMode.View;
  }
  /////////////////

  /**
     Message displayed after submission
  */
  get submitedMessage(): string {
    if (this.creating) {
      return `Entries Added`;
    } else if (this.editing) {
      return `Edits Submitted`;
    }
    return ``;
  }

  /**
   * submit button title for different states
   */
  get submitButtonPrefix(): string {
    let prefix: string;
    if (this.creating && !this.inReviewMode) {
      return 'Submit'
    }
    if (this.creating && this.inReviewMode) {
      return 'Create';
    }
    if (this.editing && this.inReviewMode) {
      return 'Commit';
    }
    return ``;
  }
  /* ***** */

  // Add prefix based on state
  get pageTitlePrefix(): string {
    let prefix: string;
    if (this.creating && this.inReviewMode) {
      return 'Review';
    }
    if (this.creating && !this.inReviewMode) {
      return 'Add New'
    }
    return ``;
  }
  /* ***** */

  ///// Form Mode
  private _mode: FormMode = FormMode.Create;
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
    return this.router.isViewRoute;
  }

  private get creating() {
    return this.router.isCreateRoute;
  }

  private get editing() {
    return this.router.isEditRoute;
  }

  private _config: any = {};

  private get config(): any {
    return this._config;
  }

  private set config(object: any) {
    this._config = object;
  }

  get canSubmit(): boolean {
    if (!this.config || !this.responseBody) {
      return false;
    }
    let requiredFieldsExist = true;
    for (const key of this.config.requiredFieldKeys) {
      if (!this.responseBody[key]) {
        console.log(`${key} is missing`);
        requiredFieldsExist = false;
      }
    }
    return requiredFieldsExist;
  }

  constructor(
    // private mechanicalTreatmentService: MechanicalTreatmentService,
    private errorService: ErrorService,
    private userService: UserService,
    private roles: RolesService,
    private alert: AlertService,
    private router: RouterService,
    private dropdownService: DropdownService,
    private formService: FormService,
    private api: ApiService,
    private loadingService: LoadingService,
  ) {
    this.lottieConfig = {
      path: this.formLoadingIcon,
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewChecked(): void { }

  private async initialize() {
    this.isLoading = true;
    this.setFormMode();
    this.accessType = await this.userService.getAccess();
    this.config = await this.formService.getFormConfigForCurrentRoute();
    this.isLoading = false;
  }

  /**
   *  Set view / create / edit mode based on route
   * */ 
  private setFormMode() {
    if (this.router.isCreateRoute) {
      this.mode = FormMode.Create
    } else if (this.router.isViewRoute) {
      this.mode = FormMode.View
    } else if (this.router.isEditRoute) {
      this.mode = FormMode.Edit
    }
  }

  /**
   * handle field change
   * @param field 
   * @param event 
   */
  private fieldChanged(field: any, event: any) {
    if (field.isLocationField) {
      // location field
      this.responseBody[field.latitude.key] = +event.latitude.value;
      this.responseBody[field.longitude.key] = +event.longitude.value;
    } else if (field.isDropdown) {
      // dropdown field
      for (const key in event.object) {
        if (key.toLowerCase().indexOf('id') !== -1) {
          this.responseBody[field.key] = event.object[key];
          break;
        }
      }
    } else if (field.isDateField) {
      // date field
      if (event) {
        const formatted = moment(event).format('YYYY-MM-DD');
        this.responseBody[field.key] = formatted;
      }
    } else {
      // Store key / value for regular field
      this.responseBody[field.key] = event;
    }
  }

  /**
   * Form submission
   */
  private async submitAction() {
    console.dir(this.responseBody);
    const endpoint = `${AppConstants.API_baseURL}${this.config.api}`;
    if (!this.canSubmit) {
      this.alert.show('Missing fields', 'Please fill all required fields');
    } else {
      if (!this.inReviewMode) {
        this.changeToReviewMode();
        return;
      }
      this.isLoading = true;
      const result = await this.api.request(APIRequestMethod.POST, endpoint, this.responseBody);
      console.log(result);
      if (result.success) {
        this.router.navigateTo(AppRoutes.Inventory);
      } else {
        this.isLoading = false;
        this.alert.show('error', 'There was an error');
      }
    }
  }

  changeToReviewMode() {
    // if NOT in create mode (route), don't continue
    if (!this.creating) {
      return;
    }
    this.inReviewMode = true;
    this.mode = FormMode.View;
    // If in edit mode, show diff viewer component
    if (this.editing) {
      this.showdiffViewer = true;
    }
  }

  exitReviewMode() {
    this.inReviewMode = false;
    this.setFormMode();
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

  // private async selectedMechanicalTreatmentFormType() {
  //   this.formType = FormType.MechanicalTreeatment;
  //   this.isLoading = true;
  //   console.log('Getting mechanical treatment');
  //   this.config = await this.formService.getMechanicalTreatmentUIConfig();
  //   console.log('done');
  //   this.isLoading = false;
  //   const x = await this.formService.generateMechanicalTreatmentTest(this.config);
  // }

  // private async selectedObservationFormType() {
  //   this.formType = FormType.MechanicalTreeatment;
  //   this.isLoading = true;
  //   console.log('Getting observation');
  //   this.config = await this.formService.getObservationUIConfig();
  //   console.log('done');
  //   this.isLoading = false;
  // }

  async generateForTesting() {
    this.loadingService.add();
    if (this.router.current === AppRoutes.AddMechanicalTreatment) {
      this.config = await this.formService.generateMechanicalTreatmentTest(this.config);
    } else if (this.router.current === AppRoutes.AddObservation) {
      this.config = await this.formService.generateObservationTest(this.config);
    } else {
      this.alert.show('Form not supported yet',`Test generatgion for this form type is not implemented yet`);
    }
    this.loadingService.remove();
  }
  
}
