import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod, APIRequestResult } from '../api.service';
import { AppConstants, AppRoutes } from 'src/app/constants';
import { DropdownObject, DropdownService } from '../dropdown.service';
import { DummyService } from '../dummy.service';
import { RouterService } from '../router.service';
import { ErrorService, ErrorType } from '../error.service';
import * as moment from 'moment';
import { DiffResult } from '../diff.service';
import { TableModel, TableColumn, TableRowModel } from 'src/app/components/base-form/table/table.component';
import { CodeTableService } from '../code-table.service';

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
  codeTableMeta: {};
  displayKey: string;
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
  computedFields: {

  };
  relations: {

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
    required: boolean;
  }[];
}

export interface UIConfigObject {
  api: string;
  idKey: string;
  title: string;
  sections: UIConfigSection[];
  relationsConfigs: any;
  relationKeys: string[];
  requiredFieldKeys: string[];
  dropdownFieldKeys: string[];
  fieldHeaders: {};
}

export interface UIConfigSection {
  title: string;
  subSections: UIConfigSubSection[];
}

export interface UIConfigSubSection {
  title: string;
  boxed: boolean;
  fields: any[];
}

export interface FormSubmissionResult {
  success: boolean;
  id?: number;
  error?: {
    errors: any[];
    code: number;
    message: string;
  };
}

@Injectable({
  providedIn: `root`
})
/**
 * To add support for a new config file:
 * 1) Add new route names in -> app/constants/app-routes.enum.ts
 * 2) Add support for new routes in -> app/app-routing.module.ts
 * 3) Add API endpoint for config in -> app/constants/app-constants.ts
 * 4) Create function in this class under Fetch Server Config section to
 * fetch server config from endpoint specified in STEP-3)
 * 5) create function in this class under Fetch UI Config section to
 * fetch server config from STEP-4) and convert to a Ui configuration
 * 6) Add to function in this class -> getFormConfigForCurrentRoute() to
 * add cases for the new routes added in STEP-1)
 * 7) Add to function in this class -> editCurrent() to
 * add case for new view route to be able to switch to edit mode.
 * 8) * Optional: If new Code tables were introduced: Add support in:
 *  - codeTable service
 *  - dropdown service
 *  - dropdownfor() function in this class.
 */
export class FormService {
  constructor(
    private api: ApiService,
    private dropdownService: DropdownService,
    private codeTableService: CodeTableService,
    private router: RouterService,
    private errorService: ErrorService,
  ) { }

  //////////////////////////////////// Fetch UI Config ////////////////////////////////////
  /**
   * returns UI configuration for Mechanical Treatments
   */
  public async getMechanicalTreatmentUIConfig(): Promise<any> {
    const serverConfig = await this.getMechanicalTreatmentServerConfig();
    return await this.createUIConfig(serverConfig);
  }

  /**
   * returns UI configuration for Observations
   */
  public async getObservationUIConfig(): Promise<any> {
    const serverConfig = await this.getObservationServerConfig();
    return await this.createUIConfig(serverConfig);
  }

  /**
   * returns UI configuration for Chemical Treatments
   */
  public async getChemicalTreatmentUIConfig(): Promise<any> {
    const serverConfig = await this.getChemicalTreatmentServerConfig();
    return await this.createUIConfig(serverConfig);
  }

  /**
   * returns UI configuration based on current route
   */
  public async getFormConfigForCurrentRoute(): Promise<any> {
    if (
      this.router.current === AppRoutes.ViewObservation ||
      this.router.current === AppRoutes.EditObservation
    ) {
      //// Observation View And Edit routes ////
      const configFile = await this.getObservationUIConfig();
      const observation = await this.getObjectWithId(
        configFile.api,
        this.router.routeId
      );
      return await this.getUIConfigFrom(configFile, observation);
    } else if (this.router.current === AppRoutes.AddObservation) {
      //// Observation Create route ////
      const configFile = await this.getObservationUIConfig();
      return configFile;
    } else if (
      this.router.current === AppRoutes.ViewMechanicalTreatment ||
      this.router.current === AppRoutes.EditMechanicalTreatment
    ) {
      //// Mechanical Treatment View and Edit routes ////
      const configFile = await this.getMechanicalTreatmentUIConfig();
      const treatment = await this.getObjectWithId(
        configFile.api,
        this.router.routeId
      );
      return await this.getUIConfigFrom(configFile, treatment);
    } else if (this.router.current === AppRoutes.AddMechanicalTreatment) {
      //// Mechanical Treatment Create route ////
      const configFile = await this.getMechanicalTreatmentUIConfig();
      return configFile;
    } else if (
      this.router.current === AppRoutes.ViewChemicalTreatment ||
      this.router.current === AppRoutes.EditChemicalTreatment
    ) {
      //// Chemical Treatment View and Edit routes ////
      const configFile = await this.getChemicalTreatmentUIConfig();
      const treatment = await this.getObjectWithId(
        configFile.api,
        this.router.routeId
      );
      return await this.getUIConfigFrom(configFile, treatment);
    } else if (this.router.current === AppRoutes.AddChemicalTreatment) {
      console.log('here');
      console.log(this.router.current);
      //// Chemical Treatment Create route ////
      const configFile = await this.getChemicalTreatmentUIConfig();
      return configFile;
    } else {
      console.log(this.router.current);
      console.log(
        `** his form route in not handled here |form.service -> getFormConfigForCurrentRoute()|**`
      );
      this.errorService.show(ErrorType.NotFound);
      return undefined;
    }
  }

  private async getUIConfigFrom(
    config: any,
    objectWithValues: any
  ): Promise<any> {
    if (!config || !objectWithValues) {
      return undefined;
    }
    return await this.merge(config, objectWithValues);
  }

  //////////////////////////////////// END Fetch UI Config ////////////////////////////////////

  //////////////////////////////////// Fetch Server Config ////////////////////////////////////
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
      console.dir(response);
      return undefined;
    }
  }

  private async getChemicalTreatmentServerConfig(): Promise<FormConfig> {
    const response = await this.api.request(
      APIRequestMethod.GET,
      AppConstants.API_Form_ChemicalTreatment,
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
      console.dir(response);
      return undefined;
    }
  }

  //////////////////////////////////// END Fetch Server Config ////////////////////////////////////

  //////////////////////////////////// Generate UI Config ////////////////////////////////////

  /**
   * generate and return Form Configuration file
   */
  private async createUIConfig(serverConfig: any): Promise<any> {
    if (!serverConfig) {
      return undefined;
    }
    const sections = serverConfig.layout.sections;
    const fields = serverConfig.fields;
    const computedFields = serverConfig.computedFields;
    let requiredFieldKeys: string[] = [];
    let dropdownFieldKeys: string[] = [];
    let fieldHeaders: {} = {};
    const configObject: UIConfigObject = {
      api: serverConfig.meta.api,
      idKey: serverConfig.idKey,
      title: serverConfig.layout.title.default,
      sections: [],
      requiredFieldKeys: [],
      dropdownFieldKeys: [],
      relationsConfigs: {},
      relationKeys: [],
      fieldHeaders: []
    };

    // This structure makes if easy for the view to be generated
    for (const section of sections) {
      const groups = section.groups;
      const subSections: any[] = [];
      // Loop thorugh groups in server config lay out
      for (const group of groups) {
        // Process group
        const groupInfo = await this.procesConfigGroup(group.fields, fields, computedFields, requiredFieldKeys, dropdownFieldKeys, fieldHeaders);
        requiredFieldKeys = groupInfo.requiredFieldKeys;
        dropdownFieldKeys = groupInfo.dropdownFieldKeys;
        fieldHeaders = groupInfo.fieldHeaders;
        // Add Group/Subsection
        subSections.push({
          title: group.title,
          boxed: false,
          fields: groupInfo.fields
        });
      }
      // Add Section
      configObject.sections.push({
        title: section.title,
        subSections: subSections
      });
    }

    // Check if there are any fields in server config fields that havent been added to a section/group
    ////////// Orphan fields //////////
    const orphanFields: any[] = [];
    const orphanGroupFieldKeys: string[] = [];
    for (const field of fields) {
      if (!fieldHeaders[field.key]) {
        orphanFields.push(field);
        orphanGroupFieldKeys.push(field.key);
      }
    }
    if (orphanFields.length > 0) {
      const orphanGroupInfo = await this.procesConfigGroup(orphanGroupFieldKeys, orphanFields, computedFields, requiredFieldKeys, dropdownFieldKeys, fieldHeaders);
      requiredFieldKeys = orphanGroupInfo.requiredFieldKeys;
      dropdownFieldKeys = orphanGroupInfo.dropdownFieldKeys;
      fieldHeaders = orphanGroupInfo.fieldHeaders;
      const orphanSubSections: any[] = [{
        title: '',
        boxed: false,
        fields: orphanGroupInfo.fields
      }];

      configObject.sections.push({
        title: '',
        subSections: orphanSubSections
      });
    }
    ////////// End of Orphan fields //////////

    // Add the arrays to the config
    configObject.requiredFieldKeys = requiredFieldKeys;
    configObject.dropdownFieldKeys = dropdownFieldKeys;
    configObject.fieldHeaders = fieldHeaders;
    if (serverConfig.relations) {
      configObject.relationKeys = this.getRelationKeysInConfig(
        serverConfig.relations
      );
      configObject.relationsConfigs = serverConfig.relations;
    }
    return configObject;
  }

  private async procesConfigGroup(
    groupFields: string[],
    fields: any[],
    computedFields: any[],
    _requiredFieldKeys: string[],
    _dropdownFieldKeys: string[],
    _fieldHeaders: {}
  ): Promise<{
    fields: any[];
    requiredFieldKeys: string[];
    dropdownFieldKeys: string[];
    fieldHeaders: {};
  }> {
    const requiredFieldKeys: string[] = _requiredFieldKeys;
    const dropdownFieldKeys: string[] = _dropdownFieldKeys;
    const fieldHeaders: {} = _fieldHeaders;
    // Initialize fields for group
    const subSectionFields: any[] = [];
    // Lat long fields will be merged into a location field. so first one found needs to be cached
    let cachedLatOrLongField: any;
    // Now loop through field keys specified in group layout
    for (let i = 0; i < groupFields.length; i++) {
      // Get key for field
      const fieldKey = groupFields[i];
      // Add type flags to field (to help with html generation) & convert data structure
      let newField = await this.findFieldAndCreateConfigField(fieldKey, fields);
      // If field key wasnt found in fields
      if (!newField) {
        // Could be a computed field
        newField = await this.configComputedField(fieldKey, computedFields);
        if (!newField) {
          // If it wasnt, just skip it
          continue;
        }
      }
      // Store required fields in a separate array
      if (newField.required) {
        requiredFieldKeys.push(newField.key);
      }
      // Store dropdown fields in a separate array
      if (newField.isDropdown) {
        dropdownFieldKeys.push(newField.key);
      }
      // Store field headers in a separate array
      fieldHeaders[newField.key] = newField.header;

      // Add Bootstrap column size
      newField.cssClasses = this.addColumnClass(
        newField.cssClasses,
        i,
        groupFields.length,
        newField.isTextAreaField
      );

      ////// Special case for lat or long fields //////
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
            latitude: cachedFieldIsLatitude ? cachedLatOrLongField : newField,
            longitude: cachedFieldIsLatitude ? newField : cachedLatOrLongField
          };
          // Add Location field
          subSectionFields.push(locationField);
        } else {
          cachedLatOrLongField = newField;
        }
        ////// END Special case for lat or long field //////
      } else {
        // Add field to group fields
        subSectionFields.push(newField);
      }
    }
    return {
      fields: subSectionFields,
      requiredFieldKeys: requiredFieldKeys,
      dropdownFieldKeys: dropdownFieldKeys,
      fieldHeaders: fieldHeaders
    };
  }

  private addColumnClass(
    cssClasses: string,
    fieldIndex: number,
    numberOfFields: number,
    isTextAreaField: boolean
  ): string {
    let result = cssClasses;
    // If column is specified (from config) dont add
    if (cssClasses.indexOf('col') === -1) {
      // set column size:
      if (
        numberOfFields >= 3 &&
        (fieldIndex % 3 === 0 || (fieldIndex + 1) % 3 === 0) &&
        !isTextAreaField
      ) {
        // if group has more than 3 elements, make sure we dont have more than 3 elements per row
        // This sets the fixed column size for every 3rd row so the remainng columns will fill the row
        result = result + ' col col-md-4';
      } else if (isTextAreaField) {
        // Comment fields should take the whole row
        result = result + ' col-12';
      }
    }
    return result;
  }

  private getRelationKeysInConfig(relations: any): string[] {
    const result: string[] = [];
    for (const key in relations) {
      if (relations[key] !== undefined) {
        result.push(key);
      }
    }
    return result;
  }

  private async configComputedField(
    key: string,
    computedFields: any
  ): Promise<any> {
    // if key is not in computed fields, return undefined
    if (!computedFields[key]) {
      return undefined;
    }
    const computedField = computedFields[key];
    // set css classes // TODO: Server doesnt send this yet
    let cssClasses = ``;
    if (computedField.layout && computedField.layout.classes) {
      const classes = computedField.layout.classes;
      for (const item of classes) {
        cssClasses = cssClasses + ` `;
      }
    }
    // END set css classes
    return {
      key: key,
      header: computedField.header.default,
      description: computedField.description, // TODO: Server doesnt send this yet
      required: false,
      type: 'computed',
      verification: undefined,
      meta: computedField.meta, // TODO: Server doesnt send this yet
      cssClasses: cssClasses, // TODO: Server doesnt send this yet
      codeTable: '',
      condition: '',
      computationRules: computedField.computationRules,
      isComputedField: true
    };
  }

  /**
   * Generate and return field configuration
   * This function sets the field type
   */
  private async findFieldAndCreateConfigField(
    key: string,
    fields: any[]
  ): Promise<any> {
    for (const field of fields) {
      if (field['key'] === key) {
        // convert server config field
        const fieldOfInterest: any = this.createFormConfigField(field);
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
            fieldOfInterest.codeTable,
            fieldOfInterest.displayKey,
            fieldOfInterest.codeTableMeta
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
  private createFormConfigField(field: any): FormConfigField {
    let codeTable = ``;
    let codeTableDisplayKey = ``;
    let codeTableMeta = [];
    if (field.type === `object`) {
      codeTable = field.refSchema.modelName;
      if (
        field.refSchema.displayLayout &&
        field.refSchema.displayLayout.fields
      ) {
        // const lastField = field.refSchema.displayLayout.fields.slice(-1)[0];
        const lastField = field.refSchema.displayLayout.fields[0];
        codeTableDisplayKey = lastField.key;
        codeTableMeta = field.refSchema.meta;
      }
    }
    let cssClasses = ``;
    const classes = field.layout.classes;
    for (const item of classes) {
      cssClasses = item + ` `;
    }

    // BEGIN Tweak verification object received.
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
      field.type.toLowerCase() === `number` &&
      (!verification.isLatitude && !verification.isLongitude)
    ) {
      verification.positiveNumber = true;
    }

    ///// END Tweak verification object received
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
      codeTableMeta: codeTableMeta,
      displayKey: codeTableDisplayKey,
      condition: ''
    };
  }

  /**
   * check if field could be latitude field
   * @param headerOrKey name
   */
  private isLatitude(headerOrKey: string): boolean {
    return (
      headerOrKey.toLocaleLowerCase() === `lat` ||
      headerOrKey.toLocaleLowerCase() === `latitude`
    );
  }

  /**
   * check if field could be longitude field
   * @param headerOrKey name
   */
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
  private async dropdownfor(
    code: string,
    displayKey: string,
    meta: any
  ): Promise<DropdownObject[]> {
    if (!code) {
      console.log(`${code} not found`);
      return [];
    }
    let codeTable = await this.codeTableService.getCodeTable(code);
    // If it wasnt found in code table,
    // try using api in meta field to fetch content
    if ((!codeTable || codeTable.length < 1) && meta.api) {
      const apiResult = await this.api.request(APIRequestMethod.GET, `${AppConstants.API_baseURL}${meta.api}`, null);
      if (apiResult.success) {
        codeTable = apiResult.response;
      }
    }
    return this.dropdownService.createDropdownObjectsFrom(
      codeTable,
      displayKey
    );
  }

  /**
   * Generate a DropdownObject for
   * the specified codetable type and
   * currently selected code table object
   * @param codeTableName code table type
   * @param selectedObject code table object (single object; could be any code table object)
   */
  private async getDropdownObjectWithId(
    codeTableName: string,
    displayedKey: string,
    selectedObject: any,
    codeTableMeta: any,
  ): Promise<DropdownObject> {
    const dropdowns = await this.dropdownfor(codeTableName, displayedKey, codeTableMeta);
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
      if (object.hasOwnProperty(key)) {
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
    // Sections/ subsections/ fields
    for (const section of configuration.sections) {
      for (const subSection of section.subSections) {
        for (const field of subSection.fields) {
          if (field.isLocationField) {
            field.latitude.value = this.formatLatLongForDisplay(
              object[field.latitude.key]
            );
            field.longitude.value = this.formatLatLongForDisplay(
              object[field.longitude.key]
            );
          } else {
            if (object[field.key] !== undefined) {
              const key = object[field.key];
              if (typeof key === 'object' && key !== null) {
                field.value = await this.getDropdownObjectWithId(
                  field.codeTable,
                  field.displayKey,
                  object[field.key],
                  field.codeTableMeta
                );
              } else {
                field.value = object[field.key];
              }
            } else {
              // UNCOMMENT for debugging/ when adding new form support. it helps
              // console.log(
              //   `**** config key ${field.key} does not exist in object`
              // );
            }
          }
        }
      }
    }
    for (const relationKey of configuration.relationKeys) {
      if (object[relationKey]) {
        configuration.relationsConfigs[relationKey].objects =
          object[relationKey];
        configuration.relationsConfigs[
          relationKey
        ].table = this.createUIConfigForTableRelation(
          configuration.relationsConfigs[relationKey]
        );
      }
    }
    return configuration;
  }

  /**
   * Used by merge: Create UI config based on
   * objects and they way they are meant to be displayed
   * @param onject Relation object
   */
  private createUIConfigForTableRelation(relationConfig: any): TableModel {
    const relationFields = [];
    if (
      !relationConfig.refSchema ||
      !relationConfig.refSchema.idKey ||
      !relationConfig.refSchema.meta
    ) {
      console.log(
        `relationConfig does not define an id key or reference schema or meta`
      );
      return undefined;
    }
    const idKey = relationConfig.refSchema.idKey;
    const isResource = relationConfig.refSchema.meta.resource;
    let api = '';
    if (isResource) {
      api = relationConfig.refSchema.meta.api;
    }
    const tableDataConfig = relationConfig.refSchema.displayLayout.fields;
    // Create an array of rows that contain keys and values for those keys derived from object
    for (const object of relationConfig.objects) {
      const tableRowConfig: any = {};
      if (isResource) {
        tableRowConfig.objectId = object[idKey];
        tableRowConfig.api = String(api);
        for (const columnKey of this.getTableColumnKeys(tableDataConfig)) {
          if (Array.isArray(columnKey)) {
            for (let _i = 0; _i < columnKey.length; _i++) {
              const key = columnKey[_i];
              if (_i === 0) {
                tableRowConfig[columnKey[0]] = object[key];
              } else {
                tableRowConfig[columnKey[0]] =
                  tableRowConfig[columnKey[0]][key];
              }
            }
          } else {
            tableRowConfig[columnKey] = object[columnKey];
          }
        }
      }
      relationFields.push(tableRowConfig);
    }
    const tableModel: TableModel = this.generateTableModel(
      tableDataConfig,
      relationFields
    );
    return tableModel;
  }

  private generateTableModel(
    tableDataConfig: any[],
    values: any[]
  ): TableModel {
    const columns: TableColumn[] = [];
    const displayedColums: string[] = [];
    const tableRows: TableRowModel[] = [];
    for (const element of tableDataConfig) {
      const displayedHeader = element.header.default;
      columns.push({
        key: this.convertDotSeparatedStringToArray(element.key)[0],
        display: displayedHeader
      });
      displayedColums.push(
        this.convertDotSeparatedStringToArray(element.key)[0]
      );
    }

    for (const fields of values) {
      tableRows.push({
        fields: fields,
        url: ''
      });
    }

    return {
      displayedColums: displayedColums,
      columns: columns,
      rows: tableRows
    };
  }

  /**
   * Convert keys recieved from server to array of strings
   */
  private getTableColumnKeys(tableDataConfig: any[]): string[][] {
    const keys: string[][] = [];
    for (const element of tableDataConfig) {
      const currentKey = element.key;
      keys.push(this.convertDotSeparatedStringToArray(currentKey));
    }
    return keys;
  }

  /**
   * Convert a dot separated string into array og string
   * @param string dot separated (or not)
   */
  private convertDotSeparatedStringToArray(string: string): string[] {
    const result: string[] = [];
    if (String(string).indexOf('.') === -1) {
      result.push(string);
    } else {
      const separated = String(string).split('.');
      for (const subElement of separated) {
        result.push(subElement);
      }
    }
    return result;
  }

  /**
   * Convert to string and add trailing zeros as needed.
   * @param value Lat or Long
   */
  private formatLatLongForDisplay(value: number): string {
    // If its undefined or not a number, return empty string
    if (value === undefined || !Number(value)) {
      return '';
    }
    // If it doesnt have a decimap point, add 5 zeros
    if (String(value).indexOf('.') === -1) {
      return `${value}.00000`;
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
    return `${value}`;
  }

  //////////////////////////////////// END Generate UI Config ////////////////////////////////////

  //////////////////////////////////// UI Config Utilities ////////////////////////////////////
  /**
   * Generate json body from UIConfig
   * @param config UIConfig
   * @returns JSON body
   */
  public generateBodyForMergedConfig(config: any): JSON {
    const body = {};
    for (const section of config.sections) {
      for (const subSection of section.subSections) {
        for (const field of subSection.fields) {
          // if its a dropdown
          if (field.isDropdown && field.value) {
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

  //////////////////////////////////// END UI Config Utilities ////////////////////////////////////

  //////////////////////////////////// DIFF ////////////////////////////////////

  /**
   * Compare changes in newBody with the latest version of the object in backend
   * @param newBody new body to be submitted
   * @param config Configuration object for the object
   */
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
    const keys = Object.keys(diffResult).map(x => {
      const fromCamel = x.replace(/([A-Z])/g, ` $1`);
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

  /**
   * Get object related for config (example:  an Observation)
   * @param endpoint API endpoint
   * @param id Id of the object
   */
  private async getObjectWithId(endpoint: string, id: number): Promise<any> {
    const endpointWithId = `${AppConstants.API_baseURL}${endpoint}/${id}`;
    const response = await this.api.request(
      APIRequestMethod.GET,
      endpointWithId,
      null
    );
    if (response.success) {
      return response.response;
    } else {
      return undefined;
    }
  }

  /**
   * Get config for object endpoint
   * @param endpoint API endpoint (without /config at the end)
   */
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
    Object.keys(obj1 || {})
      .concat(Object.keys(obj2 || {}))
      .forEach(key => {
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
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

  /**
   * Submit body for the condig.
   * Method is determined based on current route
   * @param body JSON
   * @param uiConfig UIConfig
   */
  public async submit(
    body: JSON,
    uiConfig: any
  ): Promise<FormSubmissionResult> {
    const cleanBody = this.cleanBodyForSubmission(body, uiConfig);
    let endpoint = '';
    let method = APIRequestMethod.POST;
    if (this.router.isEditRoute) {
      endpoint = `${AppConstants.API_baseURL}${uiConfig.api}/${this.router.routeId}`;
      method = APIRequestMethod.PUT;
    } else if (this.router.isCreateRoute) {
      endpoint = `${AppConstants.API_baseURL}${uiConfig.api}`;
      method = APIRequestMethod.POST;
    } else {
      console.log('Not a route that can submit');
      return {
        success: false
      };
    }

    const result = await this.api.request(method, endpoint, cleanBody);
    return this.prosessSubmissionResult(result, uiConfig.idKey);
  }

  /**
   * Check form submission result.
   * if its successfull, return server id of object
   * @param result APIRequestResult
   * @param idKey id key for the object
   */
  private prosessSubmissionResult(
    result: APIRequestResult,
    idKey: string
  ): FormSubmissionResult {
    if (result.success && result.response[idKey]) {
      return {
        success: result.success,
        id: result.response[idKey]
      };
    } else {
      return {
        success: false,
        error: {
          errors: result.response.error.error.errors,
          code: result.response.error.status,
          message: result.response.error.error.message
        }
      };
    }
  }
  //////////////////////////////////// END SUBMISSION ////////////////////////////////////

  /////////////////////////////////// Route helpers ////////////////////////////////////
  public viewCurrentWithId(id: number) {
    const current = this.router.current;
    if (
      current === AppRoutes.EditMechanicalTreatment ||
      current === AppRoutes.AddMechanicalTreatment
    ) {
      this.router.navigateTo(AppRoutes.ViewMechanicalTreatment, id);
    } else if (
      current === AppRoutes.EditObservation ||
      current === AppRoutes.AddObservation
    ) {
      this.router.navigateTo(AppRoutes.ViewObservation, id);
    } else if (
      current === AppRoutes.EditChemicalTreatment ||
      current === AppRoutes.AddChemicalTreatment
    ) {
      this.router.navigateTo(AppRoutes.ViewChemicalTreatment, id);
    }
  }
  /**
   * Switch current form route to edit mode
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
      case AppRoutes.ViewChemicalTreatment: {
        return this.router.navigateTo(
          AppRoutes.EditChemicalTreatment,
          this.router.routeId
        );
      }
      default: {
        console.log(`Case not handled`);
      }
    }
  }
  /////////////////////////////////// End Route helpers ////////////////////////////////////
}
