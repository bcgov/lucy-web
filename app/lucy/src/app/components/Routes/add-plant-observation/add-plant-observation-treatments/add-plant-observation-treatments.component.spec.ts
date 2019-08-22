import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationTreatmentsComponent } from './add-plant-observation-treatments.component';

describe('AddPlantObservationTreatmentsComponent', () => {
  let component: AddPlantObservationTreatmentsComponent;
  let fixture: ComponentFixture<AddPlantObservationTreatmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationTreatmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
