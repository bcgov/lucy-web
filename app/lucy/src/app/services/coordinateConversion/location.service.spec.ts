/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { TestBed } from '@angular/core/testing';
import * as hexTest from './hexTest.json';


import { ConverterService } from './location.service';

describe('ConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  // it('should be created', () => {
  //   const service: ConverterService = TestBed.get(ConverterService);
  //   expect(service).toBeTruthy();
  // });

  // it('should produce correct hex id - 1', () => {
  //   const service: ConverterService = TestBed.get(ConverterService);
  //   const latitude = 53.615360;
  //   const longitude  = -132.306680;
  //   const hexID = 53615432307;
  //   const strataID = 967;
  //   const x = service.getHexId(longitude, latitude);
  //   let passed = true;
  //   if (hexID - 1001 != x.target.BCHexID) {
  //     passed = false;
  //   }
  //   if (strataID != x.strataID) {
  //     passed = false;
  //   }
  //   expect(passed).toBeTruthy();
  // });

  it('should produce correct hex ids', () => {
    const service: ConverterService = TestBed.get(ConverterService);
    const obj = JSON.parse(JSON.stringify(hexTest)).default;
        let success = 0;
        let fail = 0;
        for (const item of obj) {
          const x = service.getHexId(item.longitude, item.latitude);
          let passed = true;
          if (item.hexID != x.cc) {
            passed = false;
          }
          // if (item.strataID != x.strataId) {
          //   passed = false;
          // }
          if (!passed) {
            fail++;
            console.log(`\n***`);
            console.log(`expected hexID: ${item.hexID}`);
            console.log(`received hexID: ${x.cc}`);
            // break;
          } else {
            success ++;
          }
        }
        console.log(`\n******\nHex conversion:`);
        console.log(`passed: ${success}`);
        console.log(`failed: ${fail}`);
    expect(fail).toBeLessThan(1);
  });
});
