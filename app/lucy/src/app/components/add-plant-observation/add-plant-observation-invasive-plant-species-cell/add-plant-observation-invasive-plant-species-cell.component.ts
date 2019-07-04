import { Component, OnInit, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species-cell',
  templateUrl: './add-plant-observation-invasive-plant-species-cell.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species-cell.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesCellComponent implements OnInit {

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

  items: string[] = [`one`, `two`];

  constructor(private validation: ValidationService) { }

  ngOnInit() {
  }

  fieldValueChanged(value: string) {
    console.log(value);
  }

  invasivePlantSpeciesChanged(value: string) {
    console.log(value);
  }

  jurisdictionChanged(value: string) {
    console.log(value);
  }

  densityChanged(value: string) {
    console.log(value);
  }

  distributionChanged(value: string) {
    console.log(value);
  }

  surveyModeChanged(value: string) {
    console.log(value);
  }

  soilTextureCodeChanged(value: string) {
    console.log(value);
  }

  specificUseCodeChanged(value: string) {
    console.log(value);
  }

}
