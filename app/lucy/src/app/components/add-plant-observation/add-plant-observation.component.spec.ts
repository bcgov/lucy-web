import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationComponent } from './add-plant-observation.component';

describe('AddPlantObservationComponent', () => {
  let component: AddPlantObservationComponent;
  let fixture: ComponentFixture<AddPlantObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
