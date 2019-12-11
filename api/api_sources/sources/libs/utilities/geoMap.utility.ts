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
 * File: wfs.utility.ts
 * Project: lucy
 * File Created: Wednesday, 11th December 2019 11:01:42 am
 * Author: Pushan
 * -----
 * Last Modified: Wednesday, 11th December 2019 11:02:37 am
 * Modified By: Pushan
 * -----
 */
/**
 * WFS/WMS utility service
 */
/**
 * Imports
 */

 /**
  * Constants
  */
// Web Mercator scaling const
const a = 6378137;
/**
 * Types
 */
/**
 * @description Tuple to store any point coordinate
 */
export interface PointTuple {
    x: number;
    y: number;
}

/**
 * @description Spatial Location tuple
 */
export interface LocationTuple {
    latitude: number;
    longitude: number;
}

/**
 * @description Utility to performing mapping function
 */
export class GeoMapUtility {
    /**
     * @description Convert Degree to radian
     * @param number deg
     */
    static degreeToRadian(deg: number): number {
        return (deg * Math.PI) / 180.0;
    }

    /**
     * @description Convert radian to degree
     * @param number rad
     */
    static radianToDegree(rad: number): number {
        return (rad * 180.0) / Math.PI;
    }

    /**
     * @description Convert longitude / latitude to WebMercator coordinate
     * @param number longitude
     * @param number latitude
     */
    static longitudeLatitudeToWebMercator(longitude: number, latitude: number): PointTuple {
        const x = a * GeoMapUtility.degreeToRadian(longitude);
        const y = a * Math.log(Math.tan(GeoMapUtility.degreeToRadian((45.0 + (latitude / 2.0)))));
        return {x, y};
    }

    /**
     * @description Convert WebMercator coordinate to longitude / latitude
     * @param number longitude
     * @param number latitude
     */
    static webMercatorToLongitudeLatitude(x: number, y: number): LocationTuple {
        const longitude = GeoMapUtility.radianToDegree(x / a);
        const latitude = 90 - 2 * GeoMapUtility.radianToDegree(Math.atan(Math.exp(-y / a)));
        return {latitude, longitude};
    }
}

// ------------------------------
