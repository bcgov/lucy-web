import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMechanicalTreatmentAdvancedComponent } from './add-mechanical-treatment-advanced.component';

describe('AddMechanicalTreatmentAdvancedComponent', () => {
  let component: AddMechanicalTreatmentAdvancedComponent;
  let fixture: ComponentFixture<AddMechanicalTreatmentAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMechanicalTreatmentAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMechanicalTreatmentAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
