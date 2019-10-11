import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  Renderer,
  Renderer2,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { FormMode } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { AlertService } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { UserAccessType } from 'src/app/models/Role';
import { AppRoutes } from 'src/app/constants';
import { FormService, FormSubmissionResult, UIConfigObject} from 'src/app/services/form/form.service';
import * as moment from 'moment';
import { LoadingService } from 'src/app/services/loading.service';
import { DiffResult } from 'src/app/services/diff.service';
import { ElementRef } from '@angular/core';
import { ToastService, ToastIconType } from 'src/app/services/toast/toast.service';
import { DummyService } from 'src/app/services/dummy.service';

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

  private _responseBody = {};
  get responseBody(): any {
    // return JSON.parse(JSON.stringify(this._responseBody));
    return this._responseBody;
  }
  set responseBody(object: any) {
    this._responseBody = object;
  }

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
    if (this.creating && !this.inReviewMode) {
      return 'Submit';
    }
    if (this.creating && this.inReviewMode) {
      return 'Create';
    }
    if (this.editing && this.inReviewMode) {
      return 'Commit';
    }
    if (this.editing && !this.inReviewMode) {
      return 'Review';
    }
    return ``;
  }
  /* ***** */

  // Add prefix based on state
  get pageTitlePrefix(): string {
    if (this.creating && this.inReviewMode) {
      return 'Review';
    }
    if (this.creating && !this.inReviewMode) {
      return 'Add New';
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

  // Config
  private _config: UIConfigObject;
  private get config(): UIConfigObject {
    return this._config;
  }
  private set config(object: UIConfigObject) {
    this._config = { ...object};
  }

  // Diff object
  private _diffObject: DiffResult;
  get diffObject(): DiffResult {
    return this._diffObject;
  }
  set diffObject(object: DiffResult) {
    this._diffObject = object;
  }

  /**
   * Check if the required fields exist
   */
  get canSubmit(): boolean {
    if (!this.config || !this.responseBody) {
      return false;
    }
    let requiredFieldsExist = true;
    for (const key of this.config.requiredFieldKeys) {
      if (!this.responseBody[key]) {
        requiredFieldsExist = false;
      }
    }
    return requiredFieldsExist;
  }

   /**
   * Returns an array of strings containing headers
   * of missing fields 
   * @returns string array of headers
   */
  get missingFields(): string[] {
    const requiredMissingFieldKeys: string[] = [];
    for (const key of this.config.requiredFieldKeys) {
      if (!this.responseBody[key]) {
        requiredMissingFieldKeys.push(key);
      }
    }
    // let requiredMissingFieldHeaders: string[]= [];
    const missingFieldHeaders: string[] = [];
    let locationIncluded = false;
    for (const key of requiredMissingFieldKeys) {
      if (this.config.fieldHeaders[key] !== undefined) {
        // Group Lat long under "location" tag
        if (key === 'lat' || key === 'long' || key === 'latitude' || key === 'longitude') {
          if (!locationIncluded) {
            missingFieldHeaders.push(`Location`);
            locationIncluded = true;
          }
        } else {
          // All other fields
          missingFieldHeaders.push(this.config.fieldHeaders[key]);
        }
      }
    }
    return missingFieldHeaders;
  }

  // Flag used to show missing fields section
  triedToSubmit = false;
  get showMissingFieldsDialog(): boolean {
    return (this.triedToSubmit && this.missingFields.length > 0);
  }

  constructor(
    private dummy: DummyService,
    private userService: UserService,
    private roles: RolesService,
    private alert: AlertService,
    private router: RouterService,
    private formService: FormService,
    private loadingService: LoadingService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private toast: ToastService
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
    const config = await this.formService.getFormConfigForCurrentRoute();
    if (config) {
      this.config = config;
    } else {
      this.alert.show('Configuration error', 'This feature is currently unavailable');
      console.log(`Bad config`);
      this.router.navigateTo(AppRoutes.AddEntry);
      return;
    }
    if (this.router.isEditRoute || this.router.isViewRoute) {
      // We are setting the body for view mode as well because:
      // Computed fields rely on body to display their value.
      this.responseBody = this.formService.generateBodyForMergedConfig(this.config);
    }
    this.isLoading = false;
  }

  /**
   *  Set view / create / edit mode based on route
   *
   */
  private setFormMode() {
    if (this.router.isCreateRoute) {
      this.mode = FormMode.Create;
    } else if (this.router.isViewRoute) {
      this.mode = FormMode.View;
    } else if (this.router.isEditRoute) {
      this.mode = FormMode.Edit;
    }
  }

  /**
   * handle field change
   * @param field chnged field object
   * @param event change event emitted
   */
  fieldChanged(field: any, event: any) {
    // if input was invalid, field component emits ``
    // handle INVALID input cases
    if (field.isLocationField && (event.latitude.value === `` || event.longitude.value === ``)) {
      // console.log('setting lat long in body to undefined')
      this.responseBody[field.latitude.key] = undefined;
      this.responseBody[field.longitude.key] = undefined;
    } else if (event === `` && this.responseBody[field.key] !== undefined) {
      // console.log(`setting ${field.key} to undefined`)
      // console.dir(event);
      this.responseBody[field.key] = undefined;
    }
    // handle valid input cases
     else if (field.isLocationField) {
      // location field - needs lat long extraction
      this.responseBody[field.latitude.key] = event.latitude.value;
      this.responseBody[field.longitude.key] = event.longitude.value;
    } else if (field.isDropdown) {
      // dropdown field - needs id extraction
      for (const key in event.object) {
        // find id field
        if (key.toLowerCase().indexOf('id') !== -1) {
          this.responseBody[field.key] = event.object[key];
          break;
        }
      }
    } else if (field.isDateField) {
      // date field - needs formatting
      if (event) {
        const formatted = moment(event).format('YYYY-MM-DD');
        this.responseBody[field.key] = formatted;
      }
    } else {
      // regular field - store key / value
      this.responseBody[field.key] = event;
    }

    if (this.hasDependents(field)) {
      this.getDependents(field).forEach((fieldKey: object) => {
        this.notify(fieldKey['key'], field, event);
      });
    /*
      This reassignment will trigger the set function of responseBody
      which will send the new body to the computed fields.
      Otherwise the opject reference is passed and computed field cant be trigerred on change.
    */
    const temp = { ...this.responseBody };
    this.responseBody = { ...temp};
  }
}

  /**
   * Form submission
   */
  async submitAction() {
    // const endpoint = `${AppConstants.API_baseURL}${this.config.api}`;
    if (!this.canSubmit) {
      this.triedToSubmit = true;
      this.toast.show('Some required fields are missing', ToastIconType.fail);
      return;
    } else {
      if (!this.inReviewMode) {
        this.enterReviewMode();
        return;
      }
      this.loadingService.add();
      // const submissionResult = await this.formService.submit(JSON.parse(JSON.stringify({key: 'hello'})), this.config);
      const submissionResult = await this.formService.submit(JSON.parse(JSON.stringify(this.responseBody)), this.config);
      this.loadingService.remove();
      if (submissionResult.success) {
        this.toast.show(`Your record has been commited to the database.`, ToastIconType.success);
        this.formService.viewCurrentWithId(submissionResult.id);
      } else {
        this.handleSubmissionError(submissionResult);
      }
    }
  }

  notify(targetField: any, changedField: any, event: any) {
    if (event) {
      const valueOfChangedField = this.responseBody[changedField.key];
      const targetFieldKeys = [];
      for (const key of Object.keys(targetField)) {
        targetFieldKeys.push(key);
      }
      const targetFieldKey = targetFieldKeys[0]; // there will only ever be 1 entry in targetField dictionary

      // tslint:disable-next-line: forin
      for (const key in targetField[targetFieldKey]) {
        if (valueOfChangedField in targetField[targetFieldKey][key]) {
          const fieldHeaderKey = this.snakeCaseToCamelCase(targetFieldKey);
          const propertyToUpdate = targetField[targetFieldKey][key].property;
          switch(propertyToUpdate) {
            case 'fieldHeader':       this.updateFieldHeader(targetField, fieldHeaderKey, targetFieldKey, key);
                                      break;
            case 'visibility':        this.updateFieldVisibility();
                                      break;
            case 'computationMethod': this.updateComputationMethod();
                                      break;
            default:                  console.log('Unrecognized dependency property');
          }
          break;
        }
      }



    }
  }

  // TODO refactor - remove triple-nested for loop
  updateFieldHeader(targetField: any, fieldHeaderKey: string, targetFieldKey: any, key: string) {
    const valueToUpdate = targetField[targetFieldKey][key].update;
    for (const sec of Object.keys(this.config.sections)) {
      for (const subsec of Object.keys(this.config.sections[sec].subSections)) {
        for ( const f of Object.keys( this.config.sections[sec].subSections[subsec].fields)) {
          if (fieldHeaderKey === this.config.sections[sec].subSections[subsec].fields[f].key) {
            this.config.sections[sec].subSections[subsec].fields[f].header = valueToUpdate;
            this.config.fieldHeaders[fieldHeaderKey] = valueToUpdate;
            break;
          }
        }
      }
    }
  }

  updateFieldVisibility() {

  }

  updateComputationMethod() {
    
  }

  edit() {
    if (!this.viewing) {
      return;
    }
    this.formService.editCurrent();
  }

  enterReviewMode() {
    // if NOT in create mode (route) or edit mode, don't continue
    if (!this.creating && !this.editing) {
      return;
    }
    this.inReviewMode = true;
    this.mode = FormMode.View;
    // If in edit mode, show diff viewer component
    if (this.editing) {
      this.showdiffViewer = true;
      this.createDiffMessage();
    }
  }

  exitReviewMode() {
    this.inReviewMode = false;
    this.showdiffViewer = false;
    this.setFormMode();
  }

  hasDependents(field: any): boolean {
    if (field.meta && field.meta.dependencies) {
      return true;
    } else { return false; }
  }

  getDependents(field: any): any[] {
    const dependents = [];
    console.log(field.meta.dependencies);
    if (field.meta && field.meta.dependencies) {
      // tslint:disable-next-line: forin
      for (const key in field.meta.dependencies) {
        const value = field.meta.dependencies[key];
        dependents.push({key: value});
      }
    }
    return dependents;
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

  missingFieldSelected(missingFieldHeader: string) {
    const highlightClass = 'shake';
    const el = this.elementRef.nativeElement.querySelector(`#${this.camelize(missingFieldHeader)}`);
      if (el) {
          el.scrollIntoView({ block: 'center',  behavior: 'smooth' });
          this.renderer.addClass(el, highlightClass);
          setTimeout(() => {
          this.renderer.removeClass(el, highlightClass);
          }, 2000);
      } else {
          console.log(`${this.camelize(missingFieldHeader)} not found`);
          console.log(this.elementRef.nativeElement);
      }
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  snakeCaseToCamelCase(input: string): string {
    return input.split('_').reduce((res, word, i) => i === 0 ? word.toLowerCase() : `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`, '');
  }

  async generateForTesting() {
    this.isLoading = true;
    const fake = await this.dummy.generateTest(this.config);
    this.config = fake.config;
    this.responseBody = fake.json;
    this.isLoading = false;
  }

  async createDiffMessage() {
    this.loadingService.add();
    this.diffObject = await this.formService.diffObject(JSON.parse(JSON.stringify(this.responseBody)), this.config);
    this.loadingService.remove();
  }

  /////////// Submission error handling ///////////

  /**
   * Handle Server error
   */
  private handleSubmissionError(submissionResult: FormSubmissionResult) {
    if (submissionResult.success) {
      return;
    }

    if (!submissionResult.error || !submissionResult.error.code) {
      this.alert.show('Submission failed', 'There was an unknown error\nPlease check your connection');
      console.dir(submissionResult);
    }

    switch (submissionResult.error.code) {
      case 422:
        // if we have all the fields that the server is throwing errors for
        if (this.missingServerResponseFieldsFromConfig(submissionResult).length < 1) {
          this.alert.show(`Submission failed ${submissionResult.error.code}`, `Reason: ${submissionResult.error.message}\nPlease review the indicated fields.`);
          // Remove error fields from response body, exit review mode and show missing fields
          this.removeFieldsInServerSubmissionErrorFromResponseBody(submissionResult);
        } else {
          // if server is indicating fields that we don't have
          this.alert.show(`Submission failed ${submissionResult.error.code}`, `There is a configuration error.\nPlease contact app administrator.`);
          console.log('Form config does not have the missing fields indicated in server error\nthe following is missing:');
          console.dir(this.missingServerResponseFieldsFromConfig(submissionResult));
        }
        break;
      case 401:
        this.alert.show(`Submission failed ${submissionResult.error.code}`, `You do not have the required permission`);
        break;
      case 404:
          this.alert.show(`Submission failed ${submissionResult.error.code}`, `Reason: ${submissionResult.error.message}`);
          break;
      default:
          this.alert.show(`Submission failed`, 'There was an unknown error');
    }
  }

  /**
   * - Remove fields in server error from response body,
   * - Change form to edit/create mode
   * - Show missing fields section
   * @param submissionResult FormSubmissionResult
   */
  private removeFieldsInServerSubmissionErrorFromResponseBody(submissionResult: FormSubmissionResult) {
    for (const error of submissionResult.error.errors) {
      if (this.config.fieldHeaders[error.param]) {
        this.responseBody[error.param] = undefined;
      }
    }
    this.triedToSubmit = true;
    this.exitReviewMode();
  }

  /**
   * Check if the fields in server error exist in ui config
   * @param submissionResult FormSubmissionResult
   * @returns string array of mismatch keys
   */
  private missingServerResponseFieldsFromConfig(submissionResult: FormSubmissionResult): string[] {
    const result: string[] = [];
    for (const error of submissionResult.error.errors) {
      if (!this.config.fieldHeaders[error.param]) {
        result.push(error.param);
      }
    }
    return result;
  }

  /////////// END Submission error handling ///////////
}
