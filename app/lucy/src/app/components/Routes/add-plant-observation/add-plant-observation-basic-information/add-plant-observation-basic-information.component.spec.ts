import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationBasicInformationComponent } from './add-plant-observation-basic-information.component';

describe('AddPlantObservationBasicInformationComponent', () => {
  let component: AddPlantObservationBasicInformationComponent;
  let fixture: ComponentFixture<AddPlantObservationBasicInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationBasicInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationBasicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
