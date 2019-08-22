import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantObservationInvasivePlantSpeciesCellComponent } from './add-plant-observation-invasive-plant-species-cell.component';

describe('AddPlantObservationInvasivePlantSpeciesCellComponent', () => {
  let component: AddPlantObservationInvasivePlantSpeciesCellComponent;
  let fixture: ComponentFixture<AddPlantObservationInvasivePlantSpeciesCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlantObservationInvasivePlantSpeciesCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlantObservationInvasivePlantSpeciesCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
