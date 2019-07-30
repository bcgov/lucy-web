import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormMode, Observation } from 'src/app/models';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';

@Component({
  selector: 'app-add-plant-observation-advanced-data',
  templateUrl: './add-plant-observation-advanced-data.component.html',
  styleUrls: ['./add-plant-observation-advanced-data.component.css']
})
export class AddPlantObservationAdvancedDataComponent implements OnInit {

  proposedTreatments: DropdownObject[] = [];
  groundSlopes: DropdownObject[] = [];
  groundAspects: DropdownObject[] = [];

  get wellProximity(): string {
    return `0 meters`;
  }

  get selectedProposedTreatment(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.species) {
      return undefined;
    }
    return {
      name: this.observationObject.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.observationObject.species,
    };
  }

  get selectedGroundSlope(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.species) {
      return undefined;
    }
    return {
      name: this.observationObject.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.observationObject.species,
    };
  }

  get selectedGroundAspect(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.species) {
      return undefined;
    }
    return {
      name: this.observationObject.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.observationObject.species,
    };
  }

  get selectedSurveyGeometry(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.species) {
      return undefined;
    }
    return {
      name: this.observationObject.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.observationObject.species,
    };
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
   private _object: Observation;
   // Get
   get observationObject(): Observation {
     return this._object;
   }
   // Set
   @Input() set observationObject(object: Observation) {
     this._object = object;
   }
   ////////////////////

  @Output() advancedDataChanged = new EventEmitter<Observation>();
  constructor(private dropdownService: DropdownService) { }

  ngOnInit() {
  }


  proposedTreatmentChanged(event: DropdownObject) {

  }

  groundSlopeChanged(event: DropdownObject) {

  }

  groundAspectChanged(event: DropdownObject) {

  }

  surveyGeometryChanged(event: DropdownObject) {

  }

}
