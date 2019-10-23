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
import { MatIconModule } from '@angular/material/icon';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { MatSelect } from '@angular/material/select';
import { ChangeDetectorRef, ElementRef } from '@angular/core';

class MockElementRef implements ElementRef {
  nativeElement = {};
}

// describe('MatSelectSearchComponent', () => {
//   let component: MatSelectSearchComponent;
//   let fixture: ComponentFixture<MatSelectSearchComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [ MatIconModule ],
//       declarations: [ MatSelectSearchComponent ],
//       providers: [MatSelect, ChangeDetectorRef, {provide: ElementRef, useClass: MockElementRef}],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MatSelectSearchComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
