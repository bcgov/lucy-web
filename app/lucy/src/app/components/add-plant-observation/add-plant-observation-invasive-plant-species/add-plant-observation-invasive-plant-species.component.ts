import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { InvasivePlantSpecies } from 'src/app/models/observation';

export interface AddedSpecies {
  object: InvasivePlantSpecies;
}

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species',
  templateUrl: './add-plant-observation-invasive-plant-species.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesComponent implements OnInit {

  get buttonTitle(): string {
    if (this.objects.length < 1) {
      return `+ Add a species to location`;
    } else {
      return `+ Add another species to location`;
    }
  }

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

  @Output() addedSpecies = new EventEmitter<AddedSpecies>();

  constructor() { }

  ngOnInit() {
  }

  addSpecies() {
    this.objects.push ({
      species_id: 1,
      mapCode: `TEST`,
      earlyDetection: 1,
      containmentSpecies: 1,
      containmentSpacialRef: 1,
      species: `TEST`,
      genus: `TEST`,
      commonName: `TEST`,
      latinName: `TEST`,
    });
  }


}
