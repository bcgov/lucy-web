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

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit, AfterViewChecked {
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
  get submitBtnName(): string {
    let prefix: string;
    switch (this.mode) {
      case FormMode.Create: {
        prefix = `Submit`;
        break;
      }
      case FormMode.Edit: {
        prefix = `Submit Edits`;
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
      return `${prefix}`;
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
    const current = this.router.current;
    return (
      current === AppRoutes.ViewMechanicalTreatment ||
      current === AppRoutes.ViewObservation
    );
  }

  private get creating() {
    const current = this.router.current;
    return (
      current === AppRoutes.AddMechanicalTreatment ||
      current === AppRoutes.AddObservation
    );
  }

  private get editing() {
    const current = this.router.current;
    return (
      current === AppRoutes.EditMechanicalTreatment ||
      current === AppRoutes.EditObservation
    );
  }

  private config: any = {};

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
    private api: ApiService
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

  async initialize() {
    this.isLoading = true;
    this.accessType = await this.userService.getAccess();
    this.config = await this.formService.getMechanicalTreatmentUIConfig();
    // const x = await this.formService.generateMechanicalTreatmentTest(this.config);
    this.isLoading = false;
  }

  fieldChanged(field: any, event: any) {
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

  async submitAction() {
    const ep = this.config.api.replace('api', '');
    const endpoint = `${AppConstants.API_baseURL}${ep}`;
    if (!this.canSubmit) {
      this.alert.show('Missing fields', 'Please fill all required fields');
    } else {
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
}
