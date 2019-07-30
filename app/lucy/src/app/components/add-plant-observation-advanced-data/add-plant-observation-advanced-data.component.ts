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
  ViewMode = FormMode.View;

  proposedActions: DropdownObject[] = [];
  groundSlopes: DropdownObject[] = [];
  groundAspects: DropdownObject[] = [];
  geometries: DropdownObject[] = [];

  ////////// Indicators //////////

  get sampleTakenIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.sampleTakenIndicator;
  }

  get wellIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.wellIndicator;
  }

  get legacysiteIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.legacysiteIndicator;
  }

  get edrrIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.edrrIndicator;
  }

  get researchIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.researchIndicator;
  }

  get specialCareFlag(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.specialCareFlag;
  }

  get biologicalIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.biologicalIndicator;
  }

  get aquaticIndicator(): boolean {
    if (!this.observationObject) {
      return false;
    }
    return this.observationObject.aquaticIndicator;
  }

  ////////// End of indicators //////////

  ////////// Further Observation //////////

  get wellProximity(): string {
    return `Unknwon`;
  }

  get sampleTaken(): string {
    if (!this.observationObject || !this.observationObject.sampleTaken) {
      return '';
    }
    return this.observationObject.sampleTaken;
  }

  get rangeUnitNumber(): string {
    if (!this.observationObject || !this.observationObject.rangeUnitNumber) {
      return '';
    }
    return this.observationObject.rangeUnitNumber;
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

  ////////// End of Further Observation //////////

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


  ////////// Indicators //////////

  sampleTakenIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.sampleTakenIndicator = value;
      this.notifyChangeEvent();
    }
  }

  wellIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.wellIndicator = value;
      this.notifyChangeEvent();
    }
  }

  legacysiteIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.legacysiteIndicator = value;
      this.notifyChangeEvent();
    }
  }

  edrrIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.edrrIndicator = value;
      this.notifyChangeEvent();
    }
  }

  researchIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.researchIndicator = value;
      this.notifyChangeEvent();
    }
  }

  specialCareFlagChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.specialCareFlag = value;
      this.notifyChangeEvent();
    }
  }

  biologicalIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.biologicalIndicator = value;
      this.notifyChangeEvent();
    }
  }

  aquaticIndicatorChanged(value: boolean) {
    if (this.observationObject) {
      this.observationObject.aquaticIndicator = value;
      this.notifyChangeEvent();
    }
  }

  ////////// End of Indicators //////////

  ////////// Further Observation //////////

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

  sampleTakenChanged(value: string) {
    if (this.observationObject) {
      this.observationObject.sampleTaken = value;
      this.notifyChangeEvent();
    }
  }

  rangeUnitNumberChanged(value: string) {
    if (this.observationObject) {
      this.observationObject.rangeUnitNumber = value;
      this.notifyChangeEvent();
    }
  }

  ////////// End of Further Observation //////////
}
