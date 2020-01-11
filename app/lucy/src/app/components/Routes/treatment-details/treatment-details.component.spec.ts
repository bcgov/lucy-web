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
 * File: treatment-details.component.spec.ts
 * Project: lucy
 * File Created: Friday, 13th December 2019 2:58:20 pm
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Monday, 6th January 2020 4:17:30 pm
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { TreatmentDetailsComponent } from './treatment-details.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MomentPipe } from 'src/app/pipes/MomentPipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TreatmentDetailsComponent', () => {
  let component: TreatmentDetailsComponent;
  let fixture: ComponentFixture<TreatmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [ CookieService ],
      declarations: [TreatmentDetailsComponent, MomentPipe],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
