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
          const x = service.getHexId(item.latitude, item.longitude);
          let passed = true;
          if (item.hexID != x.target.BCHexID) {
            passed = false;
          }
          if (item.strataID != x.strataID) {
            passed = false;
          }
          if (!passed) {
            fail++;
            console.log(`\n***`);
            console.log(`expected hexID: ${item.hexID}`);
            console.log(`received hexID: ${x.target.BCHexID}`);
            console.log(`expected strataID: ${item.strataID}`);
            console.log(`received strataID: ${x.strataID}`);
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
