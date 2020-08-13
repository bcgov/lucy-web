/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  Renderer2,
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
import { AppConstants } from 'src/app/constants/app-constants';
import { HerbicideTankMix } from 'src/app/models/ChemicalTreatment';
import { DropdownObject } from 'src/app/services/dropdown.service';

export enum FormType {
  Observation,
  MechanicalTreeatment,
  ChemicalTreatment
}

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit, AfterViewChecked {
  headerInitialAnimationClass = 'header-container fadeInDown';
  sideMenuInitialAnimationClass = '';
  formBodyInitialAnimationClass = '';

  headerOnReviewAnimationClass = 'header-container-review pulse';
  sideMenuOnReviewAnimationClass = 'pulse';
  formBodyOnReviewAnimationClass = 'pulse';



  public componentName = ` `;

  /**
   * Boolean to indicate whether app is running in 
   * production environment
   */
  public isProd: boolean = false;

  /**
   * Boolean to indicate whether app is running in 
   * test environment
   */
  public isTest: boolean = false;

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
  // private formLoadingIcon = 'https://assets7.lottiefiles.com/datafiles/AX0rqrGV5ahKpWr/data.json';
  private formLoadingIcon = '../../../assets/AX0rqrGV5ahKpWr_data.json';
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
  get submittedMessage(): string {
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

  ///// States Based on Routes
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

  classNames(field: any): string {
    const classes = field.classNames;
    if (!classes) return '';
    if (this.mode === FormMode.Create) {
      return classes.create + ` ` + field.classNames.common;
    } else if (this.mode === FormMode.Edit) {
      return classes.edit + ` ` + field.classNames.common;
    } else {
      return classes.view + ` ` + field.classNames.common;
    }
  }

  /**
   * Check if the spaceGeom is valid or not
   */
  isSpaceGeomValid(spaceGeomData: any): boolean {
    if (!spaceGeomData
      || !spaceGeomData.latitude
      || !spaceGeomData.longitude
      || (spaceGeomData.geometry !== 0 && !spaceGeomData.geometry)
      || !spaceGeomData.inputGeometry
    ) {
      return false;
    }

    const geometryData = spaceGeomData.inputGeometry.attributes;
    if (!geometryData) { return false; }

    const area = geometryData.area;

    // if input geometry type is waypoints, there won't be radius, width, or length
    if (spaceGeomData.geometry === 4 || spaceGeomData.geometry === 5) {
      if (spaceGeomData.inputGeometry.attributes && spaceGeomData.inputGeometry.geoJSON) {
        return true;
      }
    }

    const { radius, width, length } = area;

    if (radius) { return true; }
    if (width && length) { return true; }

    return false;
  }

  /**
   * Check if tankmixes is valid or not
   */
  isTankMixesValid(tankMixes: HerbicideTankMix[]): boolean {
    if (!tankMixes || tankMixes.length === 0) return false;
    const invalidTankMixes = tankMixes.filter(tankMix => !tankMix.amountUsed || !tankMix.applicationRate);
    return (invalidTankMixes.length === 0);
  }

  /**
   * Check if species observations is valid or not
   */
  isSpeciesObservationsValid(speciesObservations: any): boolean {
    if (!speciesObservations || speciesObservations.length === 0) { 
      return false; 
    }

    const invalidSpeciesObservations = speciesObservations.filter(species => !species.treatmentAreaCoverage);
    return (invalidSpeciesObservations.length === 0);
  }

  /**
   * Check if the required fields exist
   */
  get canSubmit(): boolean {
    if (!this.config || !this.responseBody) return false;

    for (const key of this.config.requiredFieldKeys) {
      const value = this.responseBody[key];

      if (this.config.relationKeys.includes(key)) {
        const fieldType = this.config.relationsConfigs[key].type;
        if (fieldType === 'array' && (!value || value.length === 0)) return false;
      } else {
        if (!value) return false
        else if (key === 'spaceGeom' && !this.isSpaceGeomValid(value)) return false;
        else if (key === 'tankMixes' && !this.isTankMixesValid(value)) return false;
        else if (key === 'speciesObservations' && !this.isSpeciesObservationsValid(value)) return false;
      }
    }

    return true;
  }

   /**
   * Returns an array of strings containing headers
   * of missing fields
   * @returns string array of headers
   */
  get missingFields(): string[] {
    const requiredMissingFieldKeys: string[] = [];
    for (const key of this.config.requiredFieldKeys) {
      const value = this.responseBody[key];

      if (this.config.relationKeys.includes(key)) {
        const fieldType = this.config.relationsConfigs[key].type;
        if (fieldType === 'array' && (!value || value.length === 0)) requiredMissingFieldKeys.push(key);
      } else {
        if (!value) requiredMissingFieldKeys.push(key);
        else if (key === 'spaceGeom' && !this.isSpaceGeomValid(value)) requiredMissingFieldKeys.push(key);
        else if (key === 'tankMixes' && !this.isTankMixesValid(value)) requiredMissingFieldKeys.push(key);
        else if (key === 'speciesObservations' && !this.isSpeciesObservationsValid(value)) requiredMissingFieldKeys.push(key);
      }
    }

    const missingFieldHeaders: string[] = [];
    let locationIncluded = false;
    for (const key of requiredMissingFieldKeys) {
      if (this.config.fieldHeaders[key] !== undefined) {
        // Group Lat long under "location" tag
        if (key === 'spaceGeom' && !locationIncluded) {
          missingFieldHeaders.push(`Location`);
          locationIncluded = true;
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

  get sectionsForSideMenu(): string[] {
    const result = [];
    for (const section of this.config.sections) {
      result.push(this.toMenuSectionId(section.title['default']));
    }
    for (const relationSectionKey of this.config.relationKeys) {
      if (this.shouldShowRelationship(relationSectionKey)) {
        result.push(this.toMenuSectionId(this.config.relationsConfigs[relationSectionKey].header.default));
      }
    }
    return result;
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
    this.isProd = AppConstants.CONFIG.env === `prod` ? true : false;
    this.isTest = AppConstants.CONFIG.env === `test` ? true : false;
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
    if (field.isSpaceGeom) {
      this.responseBody['spaceGeom'] = event.spaceGeom.value;
    } else if (field.isLocationField && (event.latitude.value === `` || event.longitude.value === ``)) {
      // console.log('setting lat long in body to undefined')
      this.responseBody[field.latitude.key] = undefined;
      this.responseBody[field.longitude.key] = undefined;
    } else if (event === `` && this.responseBody[field.key] !== undefined) {
      this.responseBody[field.key] = undefined;
    } else if (field.isLocationField) {
      // handle valid input cases
      // location field - needs lat long extraction
      this.responseBody[field.latitude.key] = event.latitude.value;
      this.responseBody[field.longitude.key] = event.longitude.value;
    } else if (field.isDropdown) {
      // dropdown field - needs id extraction
      
      if (field.multiple) {
        const selectedOptions = event as DropdownObject[];
        const selectedIds: number[] = [];
        selectedOptions.forEach(item => {
          for (const key in item.object) {
            // find id field
            if (key.toLowerCase().indexOf('id') !== -1) {
              selectedIds.push(item.object[key]);
              break;
            }
          }
        });
        this.responseBody[field.key] = selectedIds;
      } else {
        for (const key in event.object) {
          // find id field
          if (key.toLowerCase().indexOf('id') !== -1) {
            this.responseBody[field.key] = event.object[key];
            break;
          }
        }
      }
    } else if (field.isDateField) {
      // date field - needs formatting
      if (event) {
        const formatted = moment(event).format('YYYY-MM-DD');
        this.responseBody[field.key] = formatted;
      }
    } else if (field.isDateAndTimeField) {
      const formatted = moment(event).format('YYYY-MM-DD HH:mm');
      this.responseBody[field.key] = formatted;
    } else {
      // regular field - store key / value
      this.responseBody[field.key] = event;
    }
    /*
      This reassignment will trigger the set function of responseBody
      which will send the new body to the computed fields.
      Otherwise the opject reference is passed and computed field cant be trigerred on change.
    */
    const temp = { ...this.responseBody };
    this.responseBody = { ...temp};
  }

  /**
   * handle changes in species treated custom subsection
   * @param event changed list of speciesObservation records
   */
  speciesTreatedChanged(event: any) {
    this.responseBody['speciesObservations'] = [];
    event.forEach(element => {
      this.responseBody['speciesObservations'].push({'observation': element.observation, 'treatmentAreaCoverage': +element.treatmentAreaCoverage});
    });
  }

  /**
   * handle changes in herbicide tank mixes custom subsection
   * @param event changed list of herbicideTankMix records
   */
  tankMixesChanged(event: any) {
    // if 1 or more tank mixes have changed
    if (typeof(event) === `object`) {
      this.responseBody['tankMixes'] = event;
    }
    // if mix delivery rate has changed
    else if (typeof(event) === `number` || `string`) {
      this.responseBody['mixDeliveryRate'] = event;
    }
  }

  /**
   * Form submission
   */
  async submitAction() {
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
      if (this.config.api === `/treatment/chemical`) {
        for (const speciesObservation of this.responseBody['speciesObservations']) {
          speciesObservation.observation = speciesObservation.observation.observation_id;
        }

        for (const tankMix of this.responseBody['tankMixes']) {
          tankMix.herbicide = tankMix.herbicide.herbicide_id;
        }
      }

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
    const highlightClasses = ['shake'];
    this.scrollToElement(this.camelize(missingFieldHeader), 'center');
    this.addClassesToElement(this.camelize(missingFieldHeader), highlightClasses, 2000);
  }

  /**
   * Convert string to camel case
   * Do not remove: (used in the html of this component as well)
   * @param string tp camelize
   */
  camelize(string: string): string {
    if (!string) {
      return '';
    }
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  async generateForTesting() {
    this.isLoading = true;
    const fake = await this.dummy.generateTest(this.config);
    this.config = fake.config;
    this.responseBody = fake.json;
    await this.wait(500);
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

  shouldShowRelationship(forKey: string): boolean {
    const isEmbedded =  this.config.relationsConfigs[forKey]['meta'] !== undefined &&
                        this.config.relationsConfigs[forKey]['meta']['embedded'] !== undefined &&
                        this.config.relationsConfigs[forKey]['meta']['embedded'] === true;
    return ( this.config.relationsConfigs && this.config.relationsConfigs[forKey] && this.config.relationsConfigs[forKey].objects && !isEmbedded);
  }

  // convert section title to a camelcased id
  toMenuSectionId(title: string): string {
    return `${this.camelize(title)}-menuSection`;
  }

  // Convert from menu section id back to title
  fromMenuSectionId(id: string): string {
    const clean = id.replace('-menuSection', '').replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Handle menu item click
  async menuItemClicked(id: string) {
    const highlightClasses = ['pulse', 'highlighted-section'];
    await this.scrollToElement(id, 'start');
    this.addClassesToElement(id, highlightClasses, 1000);
  }

  /**
   * Scroll to the specified elelemnt and return promise after element is visible.
   * @param elementId id - string
   * @param block 'center', 'start', 'end'
   */
  async scrollToElement(elementId: string, block: string): Promise<boolean> {
    if (elementId === `mixDeliveryRate(Calibrated)`) {
      elementId = `mixDeliveryRate`;
    }
    return new Promise<boolean>((res, rej) => {
      const el = this.elementRef.nativeElement.querySelector(`#${elementId}`);
      const element = document.getElementById(elementId);
      if (el && element) {
        el.scrollIntoView({ block: block, behavior: 'smooth' });
        const intersectionObserver = new IntersectionObserver((entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            intersectionObserver.disconnect();
            setTimeout(() => {
              res(true);
            }, 100);
          }
        });
        intersectionObserver.observe(element);
      } else {
        res(false);
      }
    });
  }

  /**
   * Add Css classes to an element and remove them after the specified time.
   * @param elementId id - string
   * @param classes css classes - string[]
   * @param removeAfterMilliSeconds milliseconds -  number
   */
  addClassesToElement(elementId: string, classes: string[], removeAfterMilliSeconds: number) {
    const el = this.elementRef.nativeElement.querySelector(`#${elementId}`);
      if (el) {
          for (const cssClass of classes) {
            this.renderer.addClass(el, cssClass);
          }
          setTimeout(() => {
            for (const cssClass of classes) {
              this.renderer.removeClass(el, cssClass);
            }
          }, removeAfterMilliSeconds);
      }
  }

  private async beginLoading() {
    this.isLoading = true;
  }

  private async endLoading() {
    this.isLoading = false;
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  private wait(ms: number): Promise<any> {
    return new Promise( resolve => {
      setTimeout(resolve, ms);
    } );
  }
}
