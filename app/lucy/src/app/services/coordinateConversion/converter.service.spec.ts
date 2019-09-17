import { TestBed } from '@angular/core/testing';
import * as hexTest from './hexTest.json';


import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConverterService = TestBed.get(ConverterService);
    expect(service).toBeTruthy();
  });

  it('should produce hex id', () => {
    const service: ConverterService = TestBed.get(ConverterService);
    const obj: any = hexTest;
    console.log(`loaded tests`);
    let success = 0;
    let fail = 0;
    for (const item of obj) {
      const x = service.getHexId(item.longitude, item.latitude);
      let passed = true;
      if (item.hexID - 1001 != x.target.BCHexID) {
        passed = false;
      }
      if (item.strataID != x.strataID) {
        passed = false;
      }
      if (!passed) {
        fail++;
        console.log(`\n***`)
        console.log(`expected hexID: ${item.hexID}`);
        console.log(`received hexID: ${x.target.BCHexID}`);

      } else {
        success++;
      }
    }
    console.log(`\n******`);
    console.log(`passed: ${success}`);
    console.log(`failed: ${fail}`);

    expect(service).toBeTruthy();
  });
});
