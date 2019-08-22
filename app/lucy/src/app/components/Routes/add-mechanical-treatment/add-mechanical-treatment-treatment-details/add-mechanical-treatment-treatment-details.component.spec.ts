import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMechanicalTreatmentTreatmentDetailsComponent } from './add-mechanical-treatment-treatment-details.component';

describe('AddMechanicalTreatmentTreatmentDetailsComponent', () => {
  let component: AddMechanicalTreatmentTreatmentDetailsComponent;
  let fixture: ComponentFixture<AddMechanicalTreatmentTreatmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMechanicalTreatmentTreatmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMechanicalTreatmentTreatmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
