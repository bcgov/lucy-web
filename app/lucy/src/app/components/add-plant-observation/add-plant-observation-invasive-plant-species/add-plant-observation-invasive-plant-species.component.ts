import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';

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

  @Output() addPlantObservationInvasivePlantSpeciesEmitter = new EventEmitter<AddPlantObservationInvasivePlantSpeciesEmitter>();

  constructor() { }

  ngOnInit() {
  }

}
