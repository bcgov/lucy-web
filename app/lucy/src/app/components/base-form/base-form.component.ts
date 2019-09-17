import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  NgZone,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormMode } from "src/app/models";
import { ErrorService, ErrorType } from "src/app/services/error.service";
import { UserService } from "src/app/services/user.service";
import { RolesService } from "src/app/services/roles.service";
import { ValidationService } from "src/app/services/validation.service";
import { AlertService } from "src/app/services/alert.service";
import { RouterService } from "src/app/services/router.service";
import { LoadingService } from "src/app/services/loading.service";
import { DummyService } from "src/app/services/dummy.service";
import { UserAccessType } from 'src/app/models/Role';
import { AppRoutes } from 'src/app/constants';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';
import { FormService, FormConfigField } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit, AfterViewChecked {
  public componentName = ` `;
  private responseBody = {};

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
  private _mode: FormMode = FormMode.Edit;
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

  constructor(
    // private mechanicalTreatmentService: MechanicalTreatmentService,
    private errorService: ErrorService,
    private userService: UserService,
    private roles: RolesService,
    private validation: ValidationService,
    private alert: AlertService,
    private router: RouterService,
    private loadingService: LoadingService,
    private dummy: DummyService,
    private dropdownService: DropdownService,
    private formService: FormService
  ) {
    this.lottieConfig = {
      path:
        "https://assets4.lottiefiles.com/datafiles/jEgAWaDrrm6qdJx/data.json",
      renderer: "canvas",
      autoplay: true,
      loop: false
    };
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewChecked(): void { }

  /**
   * Setting User's access type
   */
  private async setAccessType() {
    this.loadingService.add();
    this.accessType = await this.userService.getAccess();
    this.loadingService.remove();
  }

  async initialize() {
    await this.setAccessType();
    this.config = await this.createUIConfig();
  }

  fieldChanged(field, event) {
    if (field.isLocationField) {
      // If its a location field
      this.responseBody[field.latitude.key] = event.latitude.value;
      this.responseBody[field.latitude.key] = event.longitude.value;
    } else if (field.isDropdown) {
      // If its a dropdown field
      console.log(event.object);
      for (const key in event.object) {
        if (key.toLowerCase().indexOf('id') !== -1) {
          this.responseBody[field.key] = event.object[key];
        }
      }
    } else {
      // Store key / value for regular field
      this.responseBody[field.key] = event;
    }

    console.log(this.responseBody);
  }

  private async createUIConfig(): Promise<any> {
    // const serverMessage = this.getTestFormConfig();
    const serverMessage = await this.formService.getMechanicalTreatmentConfig();
    const sections = serverMessage.layout.sections;
    const fields = serverMessage.fields;
    const configObject: any = {
      title: serverMessage.layout.title,
      sections: [],
    };
    for (const section of sections) {
      const groups = section.groups;
      const subSections: any[] = [];
      for (const group of groups) {
        const subSectionFields: any[] = [];
        let cachedLatOrLongField: any;
        for (const field of group.fields) {
          // Add type flags to field (to help with html generation)
          const newField = await this.configField(field, fields);
          if (newField.isLocationLatitudeField || newField.isLocationLongitudeField) {
            // if its a latitude or logitude field, and we havent cached such field before, cache it
            // if its already chached, generate special location field to add to subsection
            if (cachedLatOrLongField) {
              const cachedFieldIsLatitude = cachedLatOrLongField.isLocationLatitudeField === true;
              const locationField = {
                key: `location`,
                isLocationField: true,
                latitude: cachedFieldIsLatitude ? cachedLatOrLongField : newField,
                longitude: cachedFieldIsLatitude ? newField : cachedLatOrLongField
              };
              subSectionFields.push(locationField);
              console.log(`created locaction field`);
              console.log(locationField);
            } else {
              cachedLatOrLongField = newField;
            }
          } else {

            subSectionFields.push(newField);
          }

        }
        subSections.push({
          title: group.title,
          boxed: false,
          fields: subSectionFields,
        });
      }
      configObject.sections.push({
        title: section.title,
        subSections: subSections
      });
    }
    console.dir(configObject);
    return configObject;
  }

  private async configField(key: string, fields: any[]): Promise<any> {
    for (const field of fields) {
      if (field['key'] === key) {
        const response: any = this.processFieldConfig(field);
        response.value = undefined;
        // Handle location differently
        response.isLocationLatitudeField = (field.key.toLowerCase() === 'lat' || field.key.toLowerCase() === 'latitude');
        response.isLocationLongitudeField = (field.key.toLowerCase() === 'long' || field.key.toLowerCase() === 'longitude');
        // If its not a location field, proceed
        if (!response.isLocationLatitudeField && !response.isLocationLongitudeField) {
          response.isDropdown = field.type === 'object';
          response.isCheckbox = field.type === 'boolean';
          response.isInputField = field.type === 'string' || field.type === 'number';
        } else {
          // if its a location field, set other field type flags to false.
          response.isDropdown = false;
          response.isCheckbox = false;
          response.isInputField = false;
        }
        if (response.isDropdown) {
          response.dropdown = await this.dropdownfor(field.codeTable);
        }
        return response;
      }
    }
    return null;
  }

  processFieldConfig(field: any): FormConfigField {
    let isCodeTable = false;
    let codeTable = '';
    if (field.type === 'object') {
      isCodeTable = true;
      codeTable = field.refSchema.schemaName;
      // codeTable = codeTable.charAt(0).toLowerCase() + codeTable.slice(1);
    }
    return {
      key: field.key,
      header: field.layout.header,
      description: field.layout.description,
      required: field.required,
      type: field.type,
      verification: field.verification,
      meta: field.meta,
      cssClasses: field.layout.classes,
      codeTable: codeTable,
      condition: ''
    };
  }

  private async dropdownfor(code: string): Promise<DropdownObject[]> {
    switch (code) {
      case 'SpeciesAgencyCodes':
        return await this.dropdownService.getAgencies();
      default:
        return await this.dropdownService.getInvasivePlantSpecies();
    }
  }

  private getTestUIConfig(): any {
    const config: any = {
      title: "Create Observation",
      sections: [
        {
          title: "Basic Observation Data",
          subSections: [
            {
              title: "Location",
              boxed: false,
              fields: [
                {
                  header: "Latitude",
                  key: "lat",
                  required: true,
                  type: "number",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-4",
                  condition: ""
                },
                {
                  header: "Longitude",
                  key: "long",
                  required: true,
                  type: "number",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-4",
                  condition: ""
                }
              ]
            },
            {
              title: "Observer Information",
              boxed: false,
              fields: [
                {
                  header: "First Name",
                  key: "observerFirstName",
                  required: true,
                  type: "string",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-4",
                  condition: ""
                },
                {
                  header: "Last Name",
                  key: "observerLastName",
                  required: true,
                  type: "string",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-4",
                  condition: ""
                },
                {
                  header: "Completed on Behalf of",
                  key: "speciesAgency",
                  required: true,
                  type: "code",
                  codeTable: "speciesAgencyCodes",
                  regex: "",
                  class: "col-12 col-md-4",
                  condition: ""
                }
              ]
            }
          ]
        },
        {
          title: "Advanced Data Elements",
          subSections: [
            {
              title: "Indicators",
              boxed: true,
              fields: [
                {
                  header: "Sample Taken",
                  key: "sampleTakenIndicator",
                  required: true,
                  type: "boolean",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-6",
                  condition: ""
                },
                {
                  header: "Well Indicator",
                  key: "wellIndicator",
                  required: true,
                  type: "boolean",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-6",
                  condition: ""
                },
                {
                  header: "Sample Identifier",
                  key: "sampleIdentifier",
                  required: true,
                  type: "string",
                  regex: "",
                  codeTable: "",
                  class: "col-12 col-md-6",
                  condition: "sampleTakenIndicator === true"
                }
              ]
            }
          ]
        }
      ]
    };
    return config;
  }

  private getTestFormConfig() {
    const config: any = {
      title: "Create Observation",
      sections: [
        {
          title: "Basic Observation Data",
          groups: [
            {
              title: "Location",
              fields: ["lat", "long"]
            },
            {
              title: "Observer Information",
              fields: ["observerFirstName", "observerLastName", "speciesAgency"]
            }
          ]
        },
        {
          title: "Advanced Data Elements",
          groups: [
            {
              title: "Indicators",
              fields: [
                "sampleTakenIndicator",
                "wellIndicator",
                "sampleIdentifier"
              ]
            }
          ]
        }
      ],
      fields: [
        {
          key: "lat",
          header: "Latitude",
          required: true,
          type: "number",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "long",
          header: "Longitude",
          required: true,
          type: "number",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "observerFirstName",
          header: "First Name",
          required: true,
          type: "string",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "observerLastName",
          header: "Last Name",
          required: true,
          type: "string",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "speciesAgency",
          header: "Completed on Behalf of",
          required: true,
          type: "code",
          codeTable: "speciesAgencyCodes",
          regex: "",
          condition: ""
        },
        {
          key: "sampleTakenIndicator",
          header: "Sample Taken",
          required: true,
          type: "boolean",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "wellIndicator",
          header: "Well Indicator",
          required: true,
          type: "boolean",
          regex: "",
          codeTable: "",
          condition: ""
        },
        {
          key: "sampleIdentifier",
          header: "Sample Identifier",
          required: true,
          type: "string",
          regex: "",
          codeTable: "",
          condition: "sampleTakenIndicator"
        }
      ]
    };

    return config;
  }
}
