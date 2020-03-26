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
 * File: geoJSON.service.ts
 * Project: lucy
 * File Created: Thursday, 26th March 2020 12:33:55 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Thursday, 26th March 2020 12:35:01 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import { Injectable } from '@angular/core';
import 'node_modules/leaflet/';

@Injectable({
    providedIn: 'root'
})

export class GeoJSONService {

  /**
   * Creates and returns a GeoJSON file with a FeatureCollection
   * including all features provided as input
   * @param features list of Leaflet feature objects
   */
  createFeatureCollectionGeoJSON(features: any[]): string {
    const geoJSONSnippets = [];
    for (const feature of features) {
      geoJSONSnippets.push(feature.toGeoJSON());
    }

    const geoJSONFeatureCollection = { };
    geoJSONFeatureCollection['type'] = 'FeatureCollection';
    geoJSONFeatureCollection['features'] = geoJSONSnippets;
    return JSON.stringify(geoJSONFeatureCollection);
  }
}
