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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LocationInputComponent } from './location-input.component';
import { ConverterService } from 'src/app/services/coordinateConversion/location.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { ValidationService } from 'src/app/services/validation.service';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LocationInputComponent (isolated test)', () => {
    let component: LocationInputComponent;
    let fixture:  ComponentFixture<LocationInputComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            FormsModule,
            RouterTestingModule
          ],
          declarations: [LocationInputComponent],
          providers: [
            ConverterService,
            DropdownService,
            ValidationService,
            CookieService,
          ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LocationInputComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

// describe('LocationInputComponent (shallow test)', () => {
//     let component: LocationInputComponent;
//     let fixture: ComponentFixture<LocationInputComponent>;
//     let obsObject: Observation;

//     beforeAll(async() => {
//         TestBed.configureTestingModule({
//             declarations: [LocationInputComponent],
//             providers: [ConverterService, DropdownService, ValidationService, CookieService, DummyService, CodeTableService, {provide: APP_BASE_HREF, useValue: '/'}],
//             imports: [ HttpClientModule, RouterModule.forRoot([]) ],
//             schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
//         }).compileComponents();
//         fixture = TestBed.createComponent(LocationInputComponent);
//         const dummyService: DummyService = TestBed.get(DummyService);
//         component = fixture.componentInstance;
//         await dummyService.createDummyObservation([]).then((value) => {
//             obsObject = value;
//             component.object = value;
//         });
//         fixture.detectChanges();
//     });

//     it('should instantiate', async() => {
//         fixture.whenStable().then(() => {
//             expect(component).toBeDefined();
//         });
//     });

//     /**
//      * Test validity of lat & long input values (should be within BC)
//      */
//     it('should accept latitude = 48.00000 (within BC)', async() => {
//         fixture.whenStable().then(() => {
//             component.object.latitude = `48.00000`;
//             component.object.latitude.dispatchEvent(new Event('input'));
//             expect(component.validLat).toBeTruthy();
//             expect(component.mapCenter.latitude).toEqual(48);
//         });
//     });

// it('should accept latitude = 61.00000 (within BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `61.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeTruthy();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toEqual(61);
//         expect(componentFixture.componentInstance.latChanged).toHaveBeenCalled();

//     });
// });

// it('should accept latitude = 55.00000 (within BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `55.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeTruthy();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toEqual(55);
//         expect(componentFixture.componentInstance.latChanged).toHaveBeenCalled();
//     });
// });

// it('should reject latitude = 47.99995 (outside BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `47.99995`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeFalsy();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toBeGreaterThan(47.99995);
//     });
// });

// it('should reject latitude = 61.00005 (outside BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `61.00005`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeFalsy();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toBeLessThan(61.00005);
//     });
// });

// it('should accept longitude = -114.00000 (within BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-114.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-114);
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//     });
// });

// it('should accept longitude = -139.00000 (within BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-139.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-139);
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//     });
// });

// it('should accept longitude = -125.00000 (within BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-125.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-125);
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//     });
// });

// it('should reject longitude = -113.00000 (outside BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-113.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeFalsy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toBeLessThan(-113);
//     });
// });

// it('should reject longitude = -140.00000 (outside BC)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-140.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeFalsy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toBeGreaterThan(-140);
//     });
// });

// it('should reject longitude = 125.00000 (longitude should not be positive)', async() => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `125.00000`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeFalsy();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toBeLessThan(125);
//     });
// });

// // /**
// //  * Test number of decimal places provided by user
// //  */
// it('should accept lat within BC with 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `49.12345`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeTruthy();
//         expect(componentFixture.componentInstance.latChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toEqual(49.12345);
//     });
// });

// it('should accept long within BC with 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-123.12345`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(49.12345);
//     });
// });

// it('should reject lat within BC with only 3 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `49.123`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeFalsy();
//     });
// });

// it('should reject long within BC with only 3 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-125.123`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeFalsy();
//     });
// });

// it('should accept lat within BC that only has 4 decimal places, but should pad with 0 to create 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `49.1234`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeTruthy();
//         expect(componentFixture.componentInstance.latChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toEqual(49.1234);
//         expect(componentFixture.componentInstance.lat).toEqual(`49.12340`);
//     });
// });

// it('should accept long within BC that only has 4 decimal places, but should pad with 0 to create 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-125.1234`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-125.1234);
//         expect(componentFixture.componentInstance.long).toEqual(`-125.12340`);
//     });
// });

// it('should accept lat within BC that has 6 decimal places, but should truncate value to 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `49.123456`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeTruthy();
//         expect(componentFixture.componentInstance.latChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.latitude).toEqual(49.12345);
//         expect(componentFixture.componentInstance.lat).toEqual(`49.12346`);
//     });
// });

// it('should accept long within BC that has 6 decimal places, but should truncate value to 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-126.987001`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-126.98700);
//         expect(componentFixture.componentInstance.long).toEqual(`-126.98700`);
//     });
// });

// it('should accept value within BC that has 7 decimal places, but should truncate value to 5 decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.longitude = `-126.1234567`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLong).toBeTruthy();
//         expect(componentFixture.componentInstance.longChanged).toHaveBeenCalled();
//         expect(componentFixture.componentInstance.mapCenter.longitude).toEqual(-126.12346);
//         expect(componentFixture.componentInstance.long).toEqual(`-126.12346`);
//     });
// });

// it('should reject value within BC that does not have any decimal places', () => {
//     componentFixture.whenStable().then(() => {
//         componentFixture.componentInstance.object.latitude = `49.`;
//         componentFixture.componentInstance.object.dispatchEvent(new Event('input'));
//         expect(componentFixture.componentInstance.validLat).toBeFalsy();
//     });
// });

// });
