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
 * File: wfs.utility.spec.ts
 * Project: lucy
 * File Created: Wednesday, 11th December 2019 11:02:01 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Wednesday, 11th December 2019 11:26:28 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
/**
 * Test for GeoMap Utility
 */
/**
 * Imports
 */
import { expect } from 'chai';
import { GeoMapUtility, PointTuple, GeoLocation } from './geoMap.utility';

describe('Test for Geo Map Utility', () => {

    it('should convert deg to rad and vice versa', () => {
        const deg = 45.0;
        const rad = GeoMapUtility.degreeToRadian(deg);
        const back = GeoMapUtility.radianToDegree(rad);
        expect(back).to.be.equal(deg);
    });

    it('should convert rad to degree and vice versa', () => {
        const rad = 1.5;
        const deg = GeoMapUtility.radianToDegree(rad);
        const back = GeoMapUtility.degreeToRadian(deg);
        expect(back).to.be.equal(rad);
    });

    it('should convert to web mercator', () => {
        const lat = 49.7500;
        const lon = -121.0000;
        const r: PointTuple = GeoMapUtility.longitudeLatitudeToWebMercator(lon, lat);
        expect(Math.round(r.x * 100) / 100).to.be.equal(-13469658.39);
        expect(Math.round(r.y * 1000) / 1000).to.be.equal(6403092.288);
    });

    it('should convert to lat / lon', () => {
        const x = -13469658.39;
        const y = 6403092.288;
        const r: GeoLocation = GeoMapUtility.webMercatorToLongitudeLatitude(x, y);
        expect(Math.round(r.longitude * 10000) / 10000).to.be.equal(-121.0000);
        expect(Math.round(r.latitude * 1000) / 1000).to.be.equal(49.7500);
    });

    it('should calculate distance between two geo location', () => {
        const loc1: GeoLocation = {
            latitude: 48.424578999999994,
            longitude: -123.36466990000001
        };
        const loc2: GeoLocation = {
            latitude: 48.450602,
            longitude: -123.344242
        };
        const d = GeoMapUtility.distance(loc1, loc2, true);
        expect(Math.round(d * 100) / 100).to.be.equal(3.27);
    });

    it('should return new location with given offset distance', () => {
        const loc: GeoLocation = {
            latitude: 51.00000000,
            longitude: 0.00000000
        };
        const dx = 100.000000;
        const dy = 100.000000;
        // Calculate new location
        const newLoc = GeoMapUtility.offset(loc, dx, dy);
        // Now calculate distance
        const d = GeoMapUtility.distance(loc, newLoc, false);
        // Compare
        expect(  Math.ceil(d * d) ).to.be.equal(Math.ceil((dx * dx + dy * dy)));
    });
});
