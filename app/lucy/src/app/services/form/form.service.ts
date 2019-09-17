import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';
import { DropdownObject, DropdownService } from '../dropdown.service';


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
      key: string,
      layout: {
        header: string,
        description: string,
        classes: string[];
      },
      meta: {},
      type: number,
      verification: {},
      required: true
    }[];
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private api: ApiService, private dropdownService: DropdownService) {
  }

  public async getMechanicalTreatmentUIConfig(): Promise<any> {
    const serverConfig = await this.getMechanicalTreatmentConfig();
    return await this.createUIConfig(serverConfig);
  }

  /**
   * Fetch and return configuration json for Mechanical treatment page
   */
  private async getMechanicalTreatmentConfig(): Promise<FormConfig> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_Form_MechanicalTreatment, undefined);
    if (response.success) {
      const modelName = response.response[`modelName`];
      if (modelName) {
        return response.response;
      } else {
        console.log(`Got a response, but something is off - modelName is missing`);
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
   * generate and return Form Configuration file
   */
  private async createUIConfig(serverConfig: any): Promise<any> {
    const sections = serverConfig.layout.sections;
    const fields = serverConfig.fields;
    const configObject: any = {
      title: serverConfig.layout.title,
      sections: [],
    };
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
          // set column size:
          if (group.fields.length >= 3 && i % 3 === 0 && !newField.isTextAreaField) {
            // if group has more than 3 elements, make sure we dont have more than 3 elements per row
            // This sets the fixed column size for every 3rd row so the remainng columns will fill the row
            newField.cssClasses = newField.cssClasses + ' col col-md-4';
          } else if (newField.isTextAreaField) {
            // Comment fields should take the whole row
            newField.cssClasses = newField.cssClasses + ' col-12';
          }
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

  /**
   * Generate and return field configuration
   * This function sets the field type
   */
  private async configField(key: string, fields: any[]): Promise<any> {
    for (const field of fields) {
      if (field['key'] === key) {
        const fieldOfInterest: any = this.processFieldConfig(field);
        fieldOfInterest.value = undefined;
        // Handle location differently
        fieldOfInterest.isLocationLatitudeField = (field.key.toLowerCase() === 'lat' || field.key.toLowerCase() === 'latitude');
        fieldOfInterest.isLocationLongitudeField = (field.key.toLowerCase() === 'long' || field.key.toLowerCase() === 'longitude');
        // If its not a location field, proceed
        if (!fieldOfInterest.isLocationLatitudeField && !fieldOfInterest.isLocationLongitudeField) {
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
                fieldOfInterest.isDateField = true;
              } else if (fieldOfInterest.verification.size && fieldOfInterest.verification.size > 100) {
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
          fieldOfInterest.dropdown = await this.dropdownfor(field.codeTable);
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
      codeTable = field.refSchema.schemaName;
      // codeTable = codeTable.charAt(0).toLowerCase() + codeTable.slice(1);
    }
    let cssClasses = ``;
    const classes = field.layout.classes;
    for (const item of classes) {
      cssClasses = cssClasses + ` `;
    }
    return {
      key: field.key,
      header: field.layout.header,
      description: field.layout.description,
      required: field.required,
      type: field.type,
      verification: field.verification,
      meta: field.meta,
      cssClasses: cssClasses,
      codeTable: codeTable,
      condition: ''
    };
  }

  /**
   * Return array of dropdown objects for code table specified.
   * @param code table name
   */
  private async dropdownfor(code: string): Promise<DropdownObject[]> {
    switch (code) {
      case 'SpeciesAgencyCodes':
        return await this.dropdownService.getAgencies();
      default:
        return await this.dropdownService.getInvasivePlantSpecies();
    }
  }
}
