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
