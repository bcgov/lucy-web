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
 * 	Created by Rajasekaran Manivannan on 2019-02-11.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTableComponent } from './request-table.component';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { ModalComponent } from 'src/app/components/Utilities/modal/modal.component';
import { RequestModalComponent } from '../request-modal/request-modal.component';
import { FormsModule } from '@angular/forms';

describe('RequestTableComponent', () => {
  let component: RequestTableComponent;
  let fixture: ComponentFixture<RequestTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule
      ],
      declarations: [ RequestTableComponent, ModalComponent, RequestModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
