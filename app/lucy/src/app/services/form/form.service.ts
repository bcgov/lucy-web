import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';


export interface FormConfigField {
  key: string;
      header: string;
      description: string;
      required: boolean;
      type: string;
      verification: any;
      meta: any;
      cssClasses: string[];
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

  constructor(private api: ApiService) {
  }

  async getMechanicalTreatmentConfig(): Promise<FormConfig> {
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
}
