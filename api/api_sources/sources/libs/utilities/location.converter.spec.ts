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
 * File: location.converter.spec.ts
 * Project: lucy
 * File Created: Monday, 4th May 2020 02:45:01 am
 * Author: Raj Manivannan  (you@you.you)
 */
/**
 * Test for Location Converter Utility
 */
/**
 * Imports
 */

import { expect } from 'chai';
import { GeoLocation } from './geoMap.utility';
import { UTMCoordinate, LocationConverter } from './location.converter';

const insideOutsideTestData = require('./resources/insideOutsideTest.json');
const hexTestData = require('./resources/bcHexTest.json');

describe('Test for Location Converter Utility', () => {

    it('should convert lat/long coordinates into UTM', () => {
        const latitude = 49.905577;
        const longitude = -119.472548;

        const expectedEastings = 322462.246733;
        const expectedNorthings = 5531063.683699;
        const expectedZone = 11;

        const result = LocationConverter.convertLatLongCoordinateToUTM(latitude, longitude) as UTMCoordinate;

        expect(result.eastings.toFixed()).to.be.equal(expectedEastings.toFixed());
        expect(result.northings.toFixed()).to.be.equal(expectedNorthings.toFixed());
        expect(result.zone).to.be.equal(expectedZone);
    });

    it('should indicate if a coordinate is inside BC or not', () => {
        const data: any[] = JSON.parse(JSON.stringify(insideOutsideTestData));

        const expectedValidDataCount = data.filter(item => item.inside).length;
        const expectedInvalidDataCount = data.filter(item => !item.inside).length;

        let validDataCount = 0;
        let invalidDataCount = 0;

        for (const location of data) {
            const isValid = LocationConverter.isInsideBC(location.latitude, location.longitude);
            if (isValid) {
                validDataCount++;
            } else {
                invalidDataCount++;
            }
        }

        expect(validDataCount).to.be.equal(expectedValidDataCount);
        expect(invalidDataCount).to.be.equal(expectedInvalidDataCount);
    });

    it('should convert UTM values into lat/long', () => {
        const eastings = 322462.246733;
        const northings = 5531063.683699;
        const zone = 11;
        const roundFactor = 3;

        const expectedLongitude = -119.472548;
        const expectedLatitude = 49.905577;

        const result = LocationConverter.convertUTMToLatLongCoordinate(eastings, northings, zone) as GeoLocation;

        expect(result.latitude.toFixed(roundFactor)).to.be.equal(expectedLatitude.toFixed(roundFactor));
        expect(result.longitude.toFixed(roundFactor)).to.be.equal(expectedLongitude.toFixed(roundFactor));
    });

    it('should convert lat/long values into albers', () => {
        const longitude = -119.472548;
        const latitude = 49.905577;

        const expectedAlbersX = 1468294.70085;
        const expectedAlbersY = 564887.24757;
        const roundFactor = 3;

        const result = LocationConverter.latLongCoordinateToAlbers(latitude, longitude);

        expect(result.x.toFixed(roundFactor)).to.be.equal(expectedAlbersX.toFixed(roundFactor));
        expect(result.y.toFixed(roundFactor)).to.be.equal(expectedAlbersY.toFixed(roundFactor));
    });

    it('should convert albers values into lat/long', () => {
        const albersX = 1468294.70085;
        const albersY = 564887.24757;

        const expectedLongitude = -119.472548;
        const expectedLatitude = 49.905577;
        const roundFactor = 3;

        const result = LocationConverter.albersToLatLongCoordinate(albersX, albersY);

        expect(result.latitude.toFixed(roundFactor)).to.be.equal(expectedLatitude.toFixed(roundFactor));
        expect(result.longitude.toFixed(roundFactor)).to.be.equal(expectedLongitude.toFixed(roundFactor));
    });

    it('should get hexID based on lat/long', () => {
        const data: any[] = JSON.parse(JSON.stringify(hexTestData));

        const expectedValidDataCount = 0;
        const expectedInvalidDataCount = 6;

        let validDataCount = 0;
        let invalidDataCount = 0;

        for (const item of data) {
            const result = LocationConverter.getHexId(item.latitude, item.longitude);

            if (item.CC === result.cc
                && item.UR === result.ur
                && item.CR === result.cr
                && item.LR === result.lr
                && item.LL === result.ll
                && item.CL === result.cl
                && item.UL === result.ul
            ) {
                validDataCount++;
            } else {
                invalidDataCount++;
            }
        }

        expect(validDataCount).to.be.equal(expectedValidDataCount);
        expect(invalidDataCount).to.be.equal(expectedInvalidDataCount);
    });

});
