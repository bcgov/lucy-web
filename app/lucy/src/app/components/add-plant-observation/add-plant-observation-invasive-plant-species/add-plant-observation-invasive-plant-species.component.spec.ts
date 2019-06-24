import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationInvasivePlantSpeciesComponent } from './add-plant-observation-invasive-plant-species.component';

describe('AddPlantObservationInvasivePlantSpeciesComponent', () => {
  let component: AddPlantObservationInvasivePlantSpeciesComponent;
  let fixture: ComponentFixture<AddPlantObservationInvasivePlantSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationInvasivePlantSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationInvasivePlantSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
