import { Component, OnInit, Output, EventEmitter } from '@angular/core';

export interface AddPlantObservationInvasivePlantSpeciesEmitter {
  object: any
}

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species',
  templateUrl: './add-plant-observation-invasive-plant-species.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesComponent implements OnInit {

  constructor() { }

  @Output() addPlantObservationInvasivePlantSpeciesEmitter = new EventEmitter<AddPlantObservationInvasivePlantSpeciesEmitter>();
  ngOnInit() {
  }

}
