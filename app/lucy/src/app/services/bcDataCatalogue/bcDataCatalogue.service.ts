/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: bcDataCatalogue.service.ts
 * Project: lucy
 * File Created: Tuesday, 21st April 2020 4:36:21 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Tuesday, 21st April 2020 4:36:52 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */


import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class BcDataCatalogueService {

  cachedMunicipalitiesDataLayer: any;
  cachedRegionalDistrictsDataLayer: any;

  constructor(private api: ApiService) { }

  /**
   * Get the nearest well to the lat/long specified.
   * @param latitude latitude of location
   * @param longitude longitude of location
   */
  public async findClosestWell(latitude: number, longitude: number): Promise<any | null> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_BCGW_wellProximity(latitude, longitude), null);
    if (response.success) {
      return response.response;
    } else {
      return null;
    }
  }

  public async getDataLayer(): Promise<any | null> {
    return null;
  }

  public async getMunicipalitiesDataLayer(): Promise<any | null> {
    if (this.cachedMunicipalitiesDataLayer) {
      return this.cachedMunicipalitiesDataLayer;
    }
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_bcDataCatalogue_getMunicipalities(), null);
    if (response.success) {
      this.cachedMunicipalitiesDataLayer = response.response
      return response.response;
    } else {
      return null;
    }
  }

  public async getRegionalDistrictsDataLayer(): Promise<any | null> {
    if (this.cachedRegionalDistrictsDataLayer) {
      return this.cachedRegionalDistrictsDataLayer
    }
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_bcDataCatalogue_getRegionalDistricts(), null);
    if (response.success) {
      this.cachedRegionalDistrictsDataLayer = response.response
      return response.response;
    } else {
      return null;
    }
  }

  public async getWellsDataLayer(bbox: any): Promise<any | null> {
    const bboxString = `${bbox._southWest.lng},${bbox._southWest.lat},${bbox._northEast.lng},${bbox._northEast.lat}`;
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_bcDataCatalogue_getWells(bboxString), null);
    if (response.success) {
      return response.response;
    } else {
      return null;
    }
  }
}
