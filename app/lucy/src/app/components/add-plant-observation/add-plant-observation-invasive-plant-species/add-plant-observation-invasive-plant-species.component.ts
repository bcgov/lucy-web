import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { InvasivePlantSpecies } from 'src/app/models/observation';

export interface AddPlantObservationInvasivePlantSpeciesEmitter {
  object: any
}

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species',
  templateUrl: './add-plant-observation-invasive-plant-species.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesComponent implements OnInit {

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  // Get
  get mode(): FormMode {
    return this._mode;
  }
  // Set
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////


  ///// Invasive plant objects
  private _objects: InvasivePlantSpecies[] = [];
  // Get
  get objects(): InvasivePlantSpecies[] {
    return this._objects;
  }
  // Set
  @Input() set objects(objects: InvasivePlantSpecies[]) {
    this._objects = objects;
  }
  ////////////////////

  @Output() addPlantObservationInvasivePlantSpeciesEmitter = new EventEmitter<AddPlantObservationInvasivePlantSpeciesEmitter>();

  constructor() { }

  ngOnInit() {
  }

  addSpecies() {
    this.objects.push ({
      observationSpecies_Id: 1,
      plantSpecies: 2,
      juristiction: 2,
      density: 2,
      distribution: 2,
      dimentions: {
        width: 2,
        length: 3,
      },
      surveyMode: 9,
      soilTextureCode: 9,
      useCode: 9,
      accessDescription: 9,
    });
  }

}
