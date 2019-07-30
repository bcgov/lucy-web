import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormMode, Observation } from 'src/app/models';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-plant-observation-advanced-data',
  templateUrl: './add-plant-observation-advanced-data.component.html',
  styleUrls: ['./add-plant-observation-advanced-data.component.css']
})
export class AddPlantObservationAdvancedDataComponent implements OnInit {

  proposedActions: DropdownObject[] = [];
  groundSlopes: DropdownObject[] = [];
  groundAspects: DropdownObject[] = [];
  geometries: DropdownObject[] = [];

  get wellProximity(): string {
    return `0 meters`;
  }

  get selectedProposedAction(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.proposedAction) {
      return undefined;
    }
    return {
      name: this.observationObject.proposedAction[this.dropdownService.displayedProposedActionField],
      object: this.observationObject.proposedAction,
    };
  }

  get selectedGroundSlope(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.groundSlope) {
      return undefined;
    }
    return {
      name: this.observationObject.groundSlope[this.dropdownService.displayedGroundSlopeField],
      object: this.observationObject.groundSlope,
    };
  }

  get selectedGroundAspect(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.groundAspect) {
      return undefined;
    }
    return {
      name: this.observationObject.groundAspect[this.dropdownService.displayedGroundAspecField],
      object: this.observationObject.groundAspect,
    };
  }

  get selectedSurveyGeometry(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.observationGeometry) {
      return undefined;
    }
    return {
      name: this.observationObject.observationGeometry[this.dropdownService.displayedSurveyGeometryField],
      object: this.observationObject.observationGeometry,
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
  constructor(private dropdownService: DropdownService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.getDropdownData();
  }

  getDropdownData() {
    this.loadingService.add();
    this.dropdownService.getProposedActions().then((result) => {
      this.proposedActions = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getGroundAspects().then((result) => {
      this.groundAspects = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getGroundSlopes().then((result) => {
      this.groundSlopes = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getGeometry().then((result) => {
      this.geometries = result;
      this.loadingService.remove();
    });
  }

  private notifyChangeEvent() {
    if (this.observationObject) {
      this.advancedDataChanged.emit(this.observationObject);
    }
  }

  proposedActionChanged(value: DropdownObject) {
     if (this.observationObject && value.object) {
      this.observationObject.proposedAction = value.object;
      this.notifyChangeEvent();
    }
  }

  groundSlopeChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.groundSlope = value.object;
      this.notifyChangeEvent();
    }
  }

  groundAspectChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.groundAspect = value.object;
      this.notifyChangeEvent();
    }
  }

  surveyGeometryChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.observationGeometry = value.object;
      this.notifyChangeEvent();
    }
  }

}
