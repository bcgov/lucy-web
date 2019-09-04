import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMechanicalTreatmentBasicInfoComponent } from './add-mechanical-treatment-basic-info.component';

describe('AddMechanicalTreatmentBasicInfoComponent', () => {
  let component: AddMechanicalTreatmentBasicInfoComponent;
  let fixture: ComponentFixture<AddMechanicalTreatmentBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMechanicalTreatmentBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMechanicalTreatmentBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
