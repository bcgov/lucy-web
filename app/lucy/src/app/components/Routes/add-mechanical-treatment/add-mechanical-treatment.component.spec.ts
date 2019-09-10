import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMechanicalTreatmentComponent } from './add-mechanical-treatment.component';

describe('AddMechanicalTreatmentComponent', () => {
  let component: AddMechanicalTreatmentComponent;
  let fixture: ComponentFixture<AddMechanicalTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMechanicalTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMechanicalTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
