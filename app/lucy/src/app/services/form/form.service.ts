import { Injectable } from "@angular/core";
import { ApiService, APIRequestMethod } from "../api.service";
import { AppConstants, AppRoutes } from "src/app/constants";
import { DropdownObject, DropdownService } from "../dropdown.service";
import { DummyService } from "../dummy.service";
import { RouterService } from "../router.service";
import { ErrorService, ErrorType } from "../error.service";
import { MechanicalTreatmentService } from "../mechanical-treatment.service";
import { ObservationService } from "../observation.service";
import * as moment from "moment";
import { DiffResult } from "../diff.service";

export interface FormConfigField {
  key: string;
  header: string;
  description: string;
  required: boolean;
  type: string;
  verification: any;
  meta: any;
  cssClasses: string;
  codeTable: string;
  condition: string;
}

export interface FormConfig {
  idKey: string;
  schemaName: string;
  modelName: string;
  description: string;
  meta: {
    resource: boolean;
    api: string;
  };
  layout: {
    title: string;
    sections: {
      title: string;
      groups: {
        title: string;
        fields: string[];
        style: {};
      }[];
    }[];
  };
  fields: {
    key: string;
    layout: {
      header: string;
      description: string;
      classes: string[];
    };
    meta: {};
    type: number;
    verification: {};
    required: true;
  }[];
}

@Injectable({
  providedIn: `root`
})
export class FormService {
  constructor(
    private api: ApiService,
    private dropdownService: DropdownService,
    private dummyService: DummyService,
    private router: RouterService,
    private errorService: ErrorService,
    private observationService: ObservationService,
    private mechanicalTreatmentService: MechanicalTreatmentService
  ) {}

  public async getMechanicalTreatmentUIConfig(): Promise<any> {
    const serverConfig = await this.getMechanicalTreatmentServerConfig();
    return await this.createUIConfig(serverConfig);
  }

  public async getObservationUIConfig(): Promise<any> {
    const serverConfig = await this.getObservationServerConfig();
    return await this.createUIConfig(serverConfig);
  }

  /**
   * Fetch and return configuration json for Mechanical treatment page
   */
  private async getMechanicalTreatmentServerConfig(): Promise<FormConfig> {
    const response = await this.api.request(
      APIRequestMethod.GET,
      AppConstants.API_Form_MechanicalTreatment,
      undefined
    );
    if (response.success) {
      const modelName = response.response[`modelName`];
      if (modelName) {
        return response.response;
      } else {
        console.log(
          `Got a response, but something is off - modelName is missing`
        );
        console.dir(response);
        return undefined;
      }
    } else {
      console.log(`observation creation failed`);
      console.dir(response);
      return undefined;
    }
  }

  /**
   * Fetch and return configuration json for Observation page
   */
  private async getObservationServerConfig(): Promise<FormConfig> {
    const response = await this.api.request(
      APIRequestMethod.GET,
      AppConstants.API_Form_Observation,
      undefined
    );
    if (response.success) {
      const modelName = response.response[`modelName`];
      if (modelName) {
        return response.response;
      } else {
        console.log(
          `Got a response, but something is off - modelName is missing`
        );
        console.dir(response);
        return undefined;
      }
    } else {
      console.log(`observation creation failed`);
      console.dir(response);
      return undefined;
    }
  }

  /**
   * Switch current form to edit mode
   */
  public editCurrent() {
    const current = this.router.current;
    switch (current) {
      case AppRoutes.ViewMechanicalTreatment: {
        return this.router.navigateTo(
          AppRoutes.EditMechanicalTreatment,
          this.router.routeId
        );
      }
      case AppRoutes.ViewObservation: {
        return this.router.navigateTo(
          AppRoutes.EditObservation,
          this.router.routeId
        );
      }
      default: {
        console.log(`Case not handled`);
      }
    }
  }

  public async getFormConfigForCurrentRoute(): Promise<any> {
    switch (this.router.current) {
      case AppRoutes.ViewObservation: {
        const id = this.router.routeId;
        const configFile = await this.getObservationUIConfig();
        const observation = await this.observationService.getWithId(id);
        if (configFile && observation) {
          return this.merge(configFile, observation);
        } else {
          return undefined;
        }
        break;
      }
      case AppRoutes.EditObservation: {
        const id = this.router.routeId;
        const configFile = await this.getObservationUIConfig();
        const observation = await this.observationService.getWithId(id);
        if (configFile && observation) {
          return this.merge(configFile, observation);
        } else {
          return undefined;
        }
        break;
      }
      case AppRoutes.AddObservation: {
        const configFile = await this.getObservationUIConfig();
        return configFile;
        break;
      }
      case AppRoutes.ViewMechanicalTreatment: {
        const id = this.router.routeId;
        const configFile = await this.getMechanicalTreatmentUIConfig();
        const treatment = await this.mechanicalTreatmentService.getWithId(id);
        if (configFile && treatment) {
          return this.merge(configFile, treatment);
        } else {
          return undefined;
        }
        break;
      }
      case AppRoutes.EditMechanicalTreatment: {
        const id = this.router.routeId;
        const configFile = await this.getObservationUIConfig();
        const treatment = await this.mechanicalTreatmentService.getWithId(id);
        if (configFile && treatment) {
          return this.merge(configFile, treatment);
        } else {
          return undefined;
        }
        break;
      }
      case AppRoutes.AddMechanicalTreatment: {
        const configFile = await this.getMechanicalTreatmentUIConfig();
        return configFile;
        break;
      }
      default: {
        console.log(
          `**t his form route in not handled here |form.service -> getFormConfigForCurrentRoute()|**`
        );
        this.errorService.show(ErrorType.NotFound);
        return undefined;
        break;
      }
    }
  }

  /**
   * generate and return Form Configuration file
   */
  private async createUIConfig(serverConfig: any): Promise<any> {
    const sections = serverConfig.layout.sections;
    const fields = serverConfig.fields;
    const configObject: any = {
      api: serverConfig.meta.api,
      title: serverConfig.layout.title.default,
      sections: [],
      requiredFieldKeys: []
    };
    const requiredFieldKeys: string[] = [];
    let fieldCount = 0;
    // if you think this is O N^3, you're wrong. it O N^4!
    // But this generated structure makes if easy for the view to display
    for (const section of sections) {
      const groups = section.groups;
      const subSections: any[] = [];
      for (const group of groups) {
        const subSectionFields: any[] = [];
        let cachedLatOrLongField: any;
        for (let i = 0; i < group.fields.length; i++) {
          const field = group.fields[i];
          // Add type flags to field (to help with html generation)
          const newField = await this.configField(field, fields);
          // newField.tabindex = fieldCount;
          fieldCount++;
          if (!newField) {
            continue;
          }
          if (newField.required) {
            requiredFieldKeys.push(newField.key);
          }
          // set column size:
          if (
            group.fields.length >= 3 &&
            (i % 3 === 0 || (i + 1) % 3 === 0) &&
            !newField.isTextAreaField
          ) {
            // if group has more than 3 elements, make sure we dont have more than 3 elements per row
            // This sets the fixed column size for every 3rd row so the remainng columns will fill the row
            newField.cssClasses = newField.cssClasses + ' col col-md-4';
          } else if (newField.isTextAreaField) {
            // Comment fields should take the whole row
            newField.cssClasses = newField.cssClasses + ' col-12';
          }
          if (
            newField.isLocationLatitudeField ||
            newField.isLocationLongitudeField
          ) {
            // if its a latitude or logitude field, and we havent cached such field before, cache it
            // if its already chached, generate special location field to add to subsection
            if (cachedLatOrLongField) {
              const cachedFieldIsLatitude =
                cachedLatOrLongField.isLocationLatitudeField === true;
              const locationField = {
                key: `location`,
                isLocationField: true,
                latitude: cachedFieldIsLatitude
                  ? cachedLatOrLongField
                  : newField,
                longitude: cachedFieldIsLatitude
                  ? newField
                  : cachedLatOrLongField
              };
              subSectionFields.push(locationField);
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
          fields: subSectionFields
        });
      }
      configObject.sections.push({
        title: section.title,
        subSections: subSections
      });
    }
    configObject.requiredFieldKeys = requiredFieldKeys;
    // console.dir(configObject);
    return configObject;
  }

  /**
   * Generate and return field configuration
   * This function sets the field type
   */
  private async configField(key: string, fields: any[]): Promise<any> {
    for (const field of fields) {
      if (field['key'] === key) {
        // convert server config field
        const fieldOfInterest: any = this.processFieldConfig(field);
        // initialize value field
        fieldOfInterest.value = undefined;

        // Set field type flag

        // Handle location differently
        fieldOfInterest.isLocationLatitudeField = this.isLatitude(field.key);
        fieldOfInterest.isLocationLongitudeField = this.isLongitude(field.key);

        // If its not a location field, proceed
        if (
          !fieldOfInterest.isLocationLatitudeField &&
          !fieldOfInterest.isLocationLongitudeField
        ) {
          // Set field type flag
          switch (field.type) {
            case 'object': {
              // Object is code table
              fieldOfInterest.isDropdown = true;
              break;
            }
            case 'boolean': {
              // Booleans is checkbox
              fieldOfInterest.isCheckbox = true;
              break;
            }
            case 'number': {
              // Number is input field
              fieldOfInterest.isInputField = true;
              break;
            }
            case 'string': {
              // String can be a simple input field, comment field, or date
              if (fieldOfInterest.verification.isDate) {
                // Date is Date FIeld
                fieldOfInterest.isDateField = true;
              } else if (
                fieldOfInterest.verification.size &&
                fieldOfInterest.verification.size > 100
              ) {
                // Comment is textAreaField (still input field)
                fieldOfInterest.isTextAreaField = true;
              } else {
                fieldOfInterest.isInputField = true;
              }
              break;
            }
            default: {
              break;
            }
          }
        } else {
          // if its a location field, set other field type flags to false.
          fieldOfInterest.isDropdown = false;
          fieldOfInterest.isCheckbox = false;
          fieldOfInterest.isInputField = false;
        }
        // if its a dropdown, grab its code table
        if (fieldOfInterest.isDropdown) {
          fieldOfInterest.dropdown = await this.dropdownfor(
            fieldOfInterest.codeTable
          );
        }
        return fieldOfInterest;
      }
    }
    return null;
  }

  /**
   * Convert a server generated field object to one that
   * can be interpreted by base Form.
   * @param field any
   */
  private processFieldConfig(field: any): FormConfigField {
    let isCodeTable = false;
    let codeTable = '';
    if (field.type === 'object') {
      isCodeTable = true;
      codeTable = field.refSchema.modelName;
      // codeTable = codeTable.charAt(0).toLowerCase() + codeTable.slice(1);
    }
    let cssClasses = ``;
    const classes = field.layout.classes;
    for (const item of classes) {
      cssClasses = cssClasses + ` `;
    }

    // BEGIN Tweak verifical object received.
    let verification = field.verification;
    if (!verification) {
      verification = {};
    }

    if (field.required) {
      verification.required = true;
    }

    if (this.isLongitude(field.key)) {
      verification.isLongitude = true;
    }

    if (this.isLatitude(field.key)) {
      verification.isLatitude = true;
    }

    if (
      field.type.toLowerCase() === 'number' &&
      (!verification.isLatitude && !verification.isLongitude)
    ) {
      verification.positiveNumber = true;
    }

    ///// END Tweak verifical object received
    return {
      key: field.key,
      header: field.layout.header.default,
      description: field.layout.description,
      required: field.required,
      type: field.type,
      verification: verification,
      meta: field.meta,
      cssClasses: cssClasses,
      codeTable: codeTable,
      condition: ''
    };
  }

  private isLatitude(headerOrKey: string): boolean {
    return (
      headerOrKey.toLocaleLowerCase() === `lat` ||
      headerOrKey.toLocaleLowerCase() === `latitude`
    );
  }

  private isLongitude(headerOrKey: string): boolean {
    return (
      headerOrKey.toLocaleLowerCase() === `long` ||
      headerOrKey.toLocaleLowerCase() === `longitude` ||
      headerOrKey.toLocaleLowerCase() === `lon`
    );
  }

  /**
   * Return array of dropdown objects for code table specified.
   * @param code table name
   */
  private async dropdownfor(code: string): Promise<DropdownObject[]> {
    if (!code) {
      return [];
    }
    switch (code.toLowerCase()) {
      case "speciesagencycode":
        return await this.dropdownService.getAgencies();
      case "jurisdictioncode":
        return await this.dropdownService.getJuristictions();
      case "species":
        return await this.dropdownService.getInvasivePlantSpecies();
      case "speciesdistributioncode":
        return await this.dropdownService.getDistributions();
      case "observationtypecode":
        return await this.dropdownService.getObservationType();
      case "soiltexturecode":
        return await this.dropdownService.getSoilTextureCodes();
      case "observationgeometrycode":
        return await this.dropdownService.getGeometry();
      case "specificusecode":
        return await this.dropdownService.getSpecificUseCodes();
      case "slopecode":
        return await this.dropdownService.getGroundSlopes();
      case "aspectcode":
        return await this.dropdownService.getGroundAspects();
      case "proposedactioncode":
        return await this.dropdownService.getProposedActions();
      case "mechanicalmethodcode":
        return await this.dropdownService.getMechanicalTreatmentMethods();
      case "mechanicaldisposalmethodcode":
        return await this.dropdownService.getMechanicalDisposalMethods();
      case "mechanicalsoildisturbancecode":
        return await this.dropdownService.getMechanicalSoilDisturbances();
      case "mechanicalrootremovalcode":
        return await this.dropdownService.getMechanicalRootRemovals();
      case "mechanicaltreatmentissuecode":
        return await this.dropdownService.getMechanicalIssues();
      case "treatmentprovidercontractor":
        return await this.dropdownService.getMechanicalTreatmentProviders();
      case "observation":
        return await this.dropdownService.getObservations();
      case "speciesdensitycode":
        return await this.dropdownService.getDensities();
      default:
        console.log(`Code Table is not handled ${code}`);
        return [];
    }
  }

  private async getDropdownObjectWithId(
    codeTableName: string,
    selectedObject: any
  ): Promise<DropdownObject> {
    const dropdowns = await this.dropdownfor(codeTableName);
    let selectedID: number;
    for (const key in selectedObject) {
      if (key.toLowerCase().indexOf(`id`) !== -1) {
        selectedID = selectedObject[key];
        break;
      }
    }
    if (selectedID === undefined) {
      return undefined;
    }
    for (const item of dropdowns) {
      const dropdown = item.object;
      for (const key in dropdown) {
        if (
          key.toLowerCase().indexOf(`id`) !== -1 &&
          dropdown[key] === selectedID
        ) {
          return item;
        }
      }
    }
    return undefined;
  }

  /**
   * Merge a config object with an object that contains the values
   * Example: merge Observation config with observation object to
   * add the values from the observation object to the fields in the config
   * @param config Object (UIConfig not server)
   * @param object Object that contains values
   * @return UIConfig object with values for fields
   */
  private async merge(config: any, object: any): Promise<any> {
    const configuration = config;

    // set id & date
    for (const key in object) {
      if(object.hasOwnProperty(key)) {
        if (key.toLowerCase().indexOf(`id`) !== -1) {
          configuration[`objectId`] = object[key];
        } else if (key.toLowerCase().indexOf(`date`) !== -1) {
          configuration[`objectDate`] = moment(
            moment(object[key], `YYYY-MM-DD`).toDate()
          ).format(`dddd MMM DD YYYY`);
        }
        if (
          configuration[`objectId`] !== undefined &&
          configuration[`objectDate`] !== undefined
        ) {
          break;
        }
      }
    }

    /*
      Yes, big O of n^3 is really bad
      (its actually way, way worse if you look deeper)
      but we're still coming up with the form builder
      so things are too complicated for us to figure this out right now.
    */
    // TODO: Refactor
    for (const section of configuration.sections) {
      for (const subSection of section.subSections) {
        for (const field of subSection.fields) {
          if (field.isLocationField) {
            field.latitude.value = this.formatLatLongForDisplay(object[field.latitude.key]);
            field.longitude.value = this.formatLatLongForDisplay(object[field.longitude.key]);
          } else {
            if (object[field.key]) {
              const key = object[field.key];
              if (typeof key === 'object' && key !== null) {
                const codeTableName = field.codeTable;
                field.value = await this.getDropdownObjectWithId(
                  codeTableName,
                  object[field.key]
                );
              } else {
                field.value = object[field.key];
              }
            } else {
              console.log(
                `**** config key ${field.key} does not exist in object`
              );
            }
          }
        }
      }
    }
    return configuration;
  }

  private formatLatLongForDisplay(value: number): string {
    // If its undefined or not a number, return empty string
    if (value === undefined || !Number(value)) {
      return '';
    }
    // If it doesnt have a decimap point, add 5 zeros
    if (String(value).indexOf('.') === -1) {
      return `${String(value)}.00000`;
    }
    // Split by decimal point
    const separated = String(value).split('.');
    let decimals = separated[1];
    // If it has multiple decimal points, return empty string
    if (separated.length > 2) {
      return '';
    }
    // If there are less than 5 chars after decimal
    if (separated[1].length < 5) {
      // add trailing zeros
      while (decimals.length < 5) {
        decimals = `${decimals}0`;
      }
      return `${separated[0]}.${decimals}`;
    }

    // at this point it should be fine as is
    return String(value);

  }

  /**
   * Generate json body from UIConfig
   * @param config UIConfig
   */
  public generateBodyForMergedConfig(config: any): JSON {
    const body = {};
    for (const section of config.sections) {
      for (const subSection of section.subSections) {
        for (const field of subSection.fields) {
          // if its a dropdown
          if (field.isDropdown) {
            // Find the id of the value
            for (const key in field.value.object) {
              if (key.toLowerCase().indexOf('id') !== -1) {
                body[field.key] = field.value.object[key];
                break;
              }
            }
          } else if (field.isLocationField) {
            // If its a location field
            body[field.latitude.key] = field.latitude.value;
            body[field.longitude.key] = field.longitude.value;
          } else if (field.isDateField) {
            // if its a date (needs to be formatted)
            body[field.key] = moment(field.value).format('YYYY-MM-DD');
          } else {
            // for all other types just grab the value
            body[field.key] = field.value;
          }
        }
      }
    }
    return JSON.parse(JSON.stringify(body));
  }

  /**
   * Return all fields in condig
   * @param uiConfig object
   * @returns fields Array
   */
  private getFieldsInConfig(uiConfig: any): any[] {
    const fields: any[] = [];
    for (const section of uiConfig.sections) {
      for (const subSection of section.subSections) {
        for (const field of subSection.fields) {
          if (field.isLocationField) {
            fields.push(field.longitude);
            fields.push(field.latitude);
          } else {
            fields.push(field);
          }
        }
      }
    }
    return fields;
  }

  //////////////////////////////////// DIFF ////////////////////////////////////

  async diffObject(newBody: JSON, config: any): Promise<DiffResult> {
    // Setup
    const currentId = this.router.routeId;
    const endpoint = config.api;
    // 1) Fetch the latest original object
    const original = await this.getObjectWithId(endpoint, currentId);
    // 2) fetch the config
    const serverConfig = await this.getConfig(endpoint);
    // 3) generate ui config
    const uiConfig = await this.createUIConfig(serverConfig);
    // 4) if any of the first 3 steps failed, return undefined
    if (!original || !serverConfig || !uiConfig) {
      console.log(`something went wrong in setup`);
      return undefined;
    }
    // 5) merge original object with config & return undefined if failed
    const mergedUIConfig = await this.merge(uiConfig, original);
    if (!mergedUIConfig) {
      console.log(`something went wrong in merging`);
      return undefined;
    }
    // 6) get json body for merged ui condig
    const originalJSONBody = this.generateBodyForMergedConfig(mergedUIConfig);
    // 7) diff with body in params
    const diffResult = this.diff(originalJSONBody, newBody);
    if (!diffResult) {
      console.log(`Couldnt diff`);
      return undefined;
    }
    // 8) generate response
    // Convert keys from camel case:
    const keys =  Object.keys(diffResult).map(x => {
      const fromCamel = x.replace( /([A-Z])/g, ` $1` );
      return fromCamel.charAt(0).toUpperCase() + fromCamel.slice(1);
    });
    const changedKeys = keys.join(`, `);
    const changed = changedKeys.length > 1;
    return {
      changed: changed,
      newObject: newBody,
      originalObject: originalJSONBody,
      diffMessage: changedKeys,
      changes: diffResult
    };
  }

  private async getObjectWithId(endpoint: string, id: number): Promise<any> {
    const endpointWithId = `${AppConstants.API_baseURL}${endpoint}/${id}`;
    const response = await this.api.request(APIRequestMethod.GET, endpointWithId, null);
    if (response.success) {
      return response.response;
    } else {
      return undefined;
    }
  }

  private async getConfig(endpoint: string) {
    const configEndpoint = `${AppConstants.API_baseURL}${endpoint}/config`;
    const response = await this.api.request(
      APIRequestMethod.GET,
      configEndpoint,
      undefined
    );
    if (response.success) {
      const modelName = response.response[`modelName`];
      if (modelName) {
        return response.response;
      } else {
        console.log(
          `Got a response, but something is off - modelName is missing`
        );
        console.dir(response);
        return undefined;
      }
    } else {
      console.log(`getConfig failed`);
      console.dir(response);
      return undefined;
    }
  }
  /**
   * Compare 2 JSON object and
   * return Object containing differences
   * between the two.
   * * Note: Keys should be in the same order
   * @param obj1 JSON object
   * @param obj2 JSON object
   */
  private diff(obj1: JSON, obj2: JSON): any {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            result[key] = obj2[key];
        }
        if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = this.diff(obj1[key], obj2[key]);
            if (value !== undefined) {
                result[key] = value;
            }
        }
    });
    return result;
  }

  //////////////////////////////////// END DIFF ////////////////////////////////////

  //////////////////////////////////// SUBMISSION ////////////////////////////////////
  /**
   * Converts body fields to the types specified in the config.
   * Use this before sumbitting body to server.
   * @param body json
   * @param uiConfig object
   */
  public cleanBodyForSubmission(body: JSON, uiConfig: any): JSON {
    const cleanBody = {};
    const configFilds = this.getFieldsInConfig(uiConfig);
    for (const field of configFilds) {
      switch (field.type.toLowerCase()) {
        case 'string':
            cleanBody[field.key] = String(body[field.key]);
            break;
        case 'number':
            cleanBody[field.key] = Number(body[field.key]);
            break;
        default:
            cleanBody[field.key] = body[field.key];
            break;
      }
    }
    return JSON.parse(JSON.stringify(cleanBody));
  }

  public async submit(body: JSON, uiConfig: any): Promise<boolean> {
    const cleanBody = this.cleanBodyForSubmission(body, uiConfig);
    console.dir(cleanBody);
    if (this.router.isEditRoute) {
      const endpoint = `${AppConstants.API_baseURL}${uiConfig.api}/${this.router.routeId}`;
      const result = await this.api.request(APIRequestMethod.PUT, endpoint, cleanBody);
      // console.log(result);
      if (result.success) {
        return true;
      } else {
        return false;
      }
    } else if (this.router.isCreateRoute) {
      const endpoint = `${AppConstants.API_baseURL}${uiConfig.api}`;
      const result = await this.api.request(APIRequestMethod.POST, endpoint, cleanBody);
      // console.log(result);
      if (result.success) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log('Not a route that can submit');
      return false;
    }
  }
  //////////////////////////////////// END SUBMISSION ////////////////////////////////////

  //////////////////////////////////// TESTS ////////////////////////////////////
  public async generateMechanicalTreatmentTest(config: any): Promise<any> {
    const dummy = await this.dummyService.createDummyMechanicalTreatment();
    return await this.merge(config, dummy);
  }

  public async generateObservationTest(config: any): Promise<any> {
    const dummy = await this.dummyService.createDummyObservation([]);
    return await this.merge(config, dummy);
  }
  //////////////////////////////////// END TESTS ////////////////////////////////////
}
