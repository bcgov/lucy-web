import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationAdvancedDataComponent } from './add-plant-observation-advanced-data.component';

describe('AddPlantObservationAdvancedDataComponent', () => {
  let component: AddPlantObservationAdvancedDataComponent;
  let fixture: ComponentFixture<AddPlantObservationAdvancedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationAdvancedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationAdvancedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
