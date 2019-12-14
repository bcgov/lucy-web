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
export interface GeoLocation {
    latitude: number;
    longitude: number;
}

/**
 * @description Utility to performing mapping function
 */
export class GeoMapUtility {

    static e = 0.081819218048345;
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
    static webMercatorToLongitudeLatitude(x: number, y: number): GeoLocation {
        const longitude = GeoMapUtility.radianToDegree(x / a);
        const latitude = 90 - 2 * GeoMapUtility.radianToDegree(Math.atan(Math.exp(-y / a)));
        return {latitude, longitude};
    }

    static distance(loc1: GeoLocation, loc2: GeoLocation, isInKM: boolean = false): number {
        let lon1 = loc1.longitude;
        let lat1 = loc1.latitude;
        let lon2 = loc2.longitude;
        let lat2 = loc2.latitude;
        const deg2rad = 0.017453292519943295; // === Math.PI / 180
        const cos = Math.cos;
        lat1 *= deg2rad;
        lon1 *= deg2rad;
        lat2 *= deg2rad;
        lon2 *= deg2rad;
        const diam = 12742 * 1000; // Diameter of the earth in km (2 * 6371)
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const x = (
          (1 - cos(dLat)) +
          (1 - cos(dLon)) * cos(lat1) * cos(lat2)
        ) / 2;
        const d = diam * Math.asin(Math.sqrt(x));
        if (isInKM) {
            return d / 1000;
        }
        return d;
    }

    static longitudeLatitudeCoordinateToAlbers(
        latitude: number,
        longitude: number
      ): PointTuple {
        const e2 = 2 * (1 / 298.257) - Math.pow(1 / 298.257, 2);
        // const k = this.k0;
        // const ep2 = e2 / (1 - e2);
        const offsetX = 1000000;
        const offsetY = 0;
        const angle1 = this.degreeToRadian(50);
        const angle2 = this.degreeToRadian(58.5);
        const angle3 = this.degreeToRadian(45);
        const angle4 = -126;
        const angle1Squared = Math.pow(Math.sin(angle1), 2);
        const angle2Squared = Math.pow(Math.sin(angle2), 2);
        const latY = this.degreeToRadian(latitude);
        const m1 = Math.cos(angle1) / Math.pow(1 - e2 * angle1Squared, 0.5);
        const m2 = Math.cos(angle2) / Math.pow(1 - e2 * angle2Squared, 0.5);
        const q1 =
        (1 - e2) *
        (Math.sin(angle1) / (1 - e2 * Math.pow(Math.sin(angle1), 2)) -
            (1 / (2 * this.e)) *
            Math.log(
            (1 - this.e * Math.sin(angle1)) / (1 + this.e * Math.sin(angle1))
            ));
        const q2 =
        (1 - e2) *
        (Math.sin(angle2) / (1 - e2 * Math.pow(Math.sin(angle2), 2)) -
            (1 / (2 * this.e)) *
            Math.log(
            (1 - this.e * Math.sin(angle2)) / (1 + this.e * Math.sin(angle2))
            ));
        const q0 =
        (1 - e2) *
        (Math.sin(angle3) / (1 - e2 * Math.pow(Math.sin(angle3), 2)) -
            (1 / (2 * this.e)) *
            Math.log(
            (1 - this.e * Math.sin(angle3)) / (1 + this.e * Math.sin(angle3))
            ));
        const n = (Math.pow(m1, 2) - Math.pow(m2, 2)) / (q2 - q1);
        const c = Math.pow(m1, 2) + n * q1;
        const p0 = (a * Math.pow(c - n * q0, 0.5)) / n;
        const q =
        (1 - e2) *
        (Math.sin(latY) / (1 - e2 * Math.pow(Math.sin(latY), 2)) -
            (1 / (2 * this.e)) *
            Math.log(
            (1 - this.e * Math.sin(latY)) / (1 + this.e * Math.sin(latY))
            ));
        const p = (a * Math.pow(c - n * q, 0.5)) / n;
        const theta = this.degreeToRadian(n * (longitude - angle4));
        const albersX = p * Math.sin(theta) + offsetX;
        const albersY = p0 - p * Math.cos(theta) + offsetY;
        return {
        x: albersX,
        y: albersY
        };
      }
}

// ------------------------------
