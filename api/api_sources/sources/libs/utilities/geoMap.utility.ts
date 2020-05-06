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
/**
 * @description Earth radius in meter
 */
const EarthRadius = 6378137;
const DegreeToRadian = 0.017453292519943295; // === Math.PI / 180
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

export interface GeoBox {
    topLeft: GeoLocation;
    topRight: GeoLocation;
    bottomLeft: GeoLocation;
    bottomRight: GeoLocation;
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
        const x = EarthRadius * GeoMapUtility.degreeToRadian(longitude);
        const y = EarthRadius * Math.log(Math.tan(GeoMapUtility.degreeToRadian((45.0 + (latitude / 2.0)))));
        return {x, y};
    }

    /**
     * @description Convert WebMercator coordinate to longitude / latitude
     * @param number longitude
     * @param number latitude
     */
    static webMercatorToLongitudeLatitude(x: number, y: number): GeoLocation {
        const longitude = GeoMapUtility.radianToDegree(x / EarthRadius);
        const latitude = 90 - 2 * GeoMapUtility.radianToDegree(Math.atan(Math.exp(-y / EarthRadius)));
        return {latitude, longitude};
    }

    /**
     * @description Calculate distance between two location, return in meter if isInKm flag is true then return in km
     * @param GeoLocation loc1
     * @param GeoLocation loc2
     * @param boolean isInKM
     */
    static distance(loc1: GeoLocation, loc2: GeoLocation, isInKM: boolean = false): number {
        let lon1 = loc1.longitude;
        let lat1 = loc1.latitude;
        let lon2 = loc2.longitude;
        let lat2 = loc2.latitude;
        const deg2rad = DegreeToRadian; // === Math.PI / 180
        const cos = Math.cos;
        lat1 *= deg2rad;
        lon1 *= deg2rad;
        lat2 *= deg2rad;
        lon2 *= deg2rad;
        const diam = 2 * EarthRadius; // Diameter of the earth in km (2 * 6371)
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

    /**
     * @description Return New location with offset distances
     * @param GeoLocation loc
     * @param number distanceX
     * @param bumber distanceY
     */
    static offset(loc: GeoLocation, distanceX: number, distanceY: number): GeoLocation {
        const c = 1.0 / DegreeToRadian;
        const newLat = loc.latitude + (distanceY / EarthRadius) * c;
        const newLon = loc.longitude + ((distanceX / EarthRadius) * c) / Math.cos(loc.latitude  * DegreeToRadian);
        return {
            latitude: newLat,
            longitude: newLon
        };
    }

    /**
     * @description Returns a bounding box of given location
     * @param GeoLocation loc
     * @param number boxWidth
     * @param number boxHeight
     */
    static calculateBox(loc: GeoLocation, boxWidth: number, boxHeight: number): GeoBox {
        const offsetX = boxWidth / 2.0;
        const offsetY = boxHeight / 2.0;
        const topRight: GeoLocation = GeoMapUtility.offset(loc, offsetX, offsetY);
        const bottomRight: GeoLocation = GeoMapUtility.offset(loc, offsetX, -offsetY);
        const topLeft: GeoLocation = GeoMapUtility.offset(loc, -offsetX, offsetY);
        const bottomLeft: GeoLocation = GeoMapUtility.offset(loc, -offsetX, -offsetY);
        return { topLeft, topRight, bottomLeft, bottomRight};
    }

    /**
     * @description Returns a bounding square of given location
     * @param GeoLocation loc
     * @param number diagonal
     */
    static calculateSquare(loc: GeoLocation, diagonal: number): GeoBox {
        const offset = diagonal / Math.sqrt(2);
        return GeoMapUtility.calculateBox(loc, offset, offset);
    }
}

// ------------------------------
