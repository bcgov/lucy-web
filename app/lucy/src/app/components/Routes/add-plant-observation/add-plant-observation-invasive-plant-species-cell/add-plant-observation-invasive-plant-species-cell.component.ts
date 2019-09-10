import { Component, OnInit, Input, Output, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormMode, Jurisdiction, InvasivePlantSpecies, Observation } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species-cell',
  templateUrl: './add-plant-observation-invasive-plant-species-cell.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species-cell.component.css']
})

/**
 * Invasive Plant Species section of observation form.
 * Takes an observation object and formMode as input
 * Emits Observation object on changes.
 * @Input mode: FormMode
 * @Input observationObject: Observation
 * @Output speciesCellInfoChanged: EventEmitter<Observation>();
 */
export class AddPlantObservationInvasivePlantSpeciesCellComponent implements OnInit, AfterViewChecked {
  ViewMode = FormMode.View;

  get width(): string {
    if (!this.observationObject || !this.observationObject.width) {
      return '';
    }
    return String(this.observationObject.width);
  }

  get length(): string {
    if (!this.observationObject || !this.observationObject.length) {
      return '';
    }
    return String(this.observationObject.length);
  }

  get selectedInviasiveSpecies(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.species) {
      return undefined;
    }
    return {
      name: this.observationObject.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.observationObject.species,
    };
  }

  get selectedGeometry(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.observationGeometry) {
      return undefined;
    }
    return {
      name: this.observationObject.observationGeometry[this.dropdownService.displayedSurveyGeometryField],
      object: this.observationObject.observationGeometry,
    };
  }

  get selectedJurisdiction(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.jurisdiction) {
      return undefined;
    }
    return {
      name: this.observationObject.jurisdiction[this.dropdownService.displayedJuristictionsField],
      object: this.observationObject.jurisdiction,
    };
  }

  get selectedDensity(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.density) {
      return undefined;
    }
    return {
      name: this.observationObject.density[this.dropdownService.displayedDensityField],
      object: this.observationObject.density,
    };
  }

  get selectedDistribution(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.distribution) {
      return undefined;
    }
    return {
      name: this.observationObject.distribution[this.dropdownService.displayedDistributionField],
      object: this.observationObject.distribution,
    };
  }
 
  get selectedSurveyType(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.observationType) {
      return undefined;
    }
    return {
      name: this.observationObject.observationType[this.dropdownService.displayedSurveyTypeField],
      object: this.observationObject.observationType,
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

  get selectedSpecificUseCode(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.specificUseCode) {
      return undefined;
    }
    return {
      name: this.observationObject.specificUseCode[this.dropdownService.displayedSpecificUseCodeField],
      object: this.observationObject.specificUseCode,
    };
  }

  get selectedSoilTexture(): DropdownObject | undefined {
    if (!this.observationObject || !this.observationObject.soilTexture) {
      return undefined;
    }
    return {
      name: this.observationObject.soilTexture[this.dropdownService.displayedSoilTextureField],
      object: this.observationObject.soilTexture,
    };
  }

  get calculatedArea(): string {
    if (!this.observationObject) {
      return ``;
    }
    const total =  parseFloat((this.observationObject.width * this.observationObject.length).toFixed(6));
    return `${total} m²`;
  }

  get accessDescription(): string {
    if (!this.observationObject || !this.observationObject.accessDescription) {
      return '';
    }
    return this.observationObject.accessDescription;
  }

  juristictions: DropdownObject[];
  invasivePlantSpecies: DropdownObject[];
  surveyModes: DropdownObject[];
  soilTextureCodes: DropdownObject[];
  specificUseCodes: DropdownObject[];
  distributions: DropdownObject[];
  densities: DropdownObject[];
  geometry: DropdownObject[];

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
  private _observationObject: Observation;
  // Get
  get observationObject(): Observation {
    return this._observationObject;
  }
  // Set
  @Input() set observationObject(object: Observation) {
    this._observationObject = object;
  }
  ////////////////////

  @Output() speciesCellInfoChanged = new EventEmitter<Observation>();
  constructor(private validation: ValidationService, private dropdownService: DropdownService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.getDropdownData();
  }

  ngAfterViewChecked(): void {
    // console.log(`Form - plant info mode is ${this.mode} -ngAfterViewChecked`);
  }

  getDropdownData() {
    this.loadingService.add();
    this.dropdownService.getInvasivePlantSpecies().then((result) => {
      this.invasivePlantSpecies = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getJuristictions().then((result) => {
      this.juristictions = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getSurveyModes().then((result) => {
      this.surveyModes = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getSoilTextureCodes().then((result) => {
      this.soilTextureCodes = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getSpecificUseCodes().then((result) => {
      this.specificUseCodes = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getDistributions().then((result) => {
      this.distributions = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getDensities().then((result) => {
      this.densities = result;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.dropdownService.getGeometry().then((result) => {
      this.geometry = result;
      this.loadingService.remove();
    });
  }

  private notifyChangeEvent() {
    if (this.observationObject) {
      this.speciesCellInfoChanged.emit(this.observationObject);
    }
  }

  fieldValueChanged(value: DropdownObject) {
    console.log(value);
  }

  invasivePlantSpeciesChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.species = value.object;
      this.notifyChangeEvent();
    }
  }

  jurisdictionChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.jurisdiction = value.object;
      this.notifyChangeEvent();
    }
  }

  densityChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.density = value.object;
      this.notifyChangeEvent();
    }
  }

  distributionChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.distribution = value.object;
      this.notifyChangeEvent();
    }
  }

  surveyModeChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.observationType = value.object;
      this.notifyChangeEvent();
    }
  }

  soilTextureCodeChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.soilTexture = value.object;
      this.notifyChangeEvent();
    }
  }

  specificUseCodeChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.specificUseCode = value.object;
      this.notifyChangeEvent();
    }
  }

  plotDimentionWidthChanged(value: number) {
    if (this.observationObject) {
      this.observationObject.width = value;
      this.notifyChangeEvent();
    }
  }

  plotDimentionLengthChanged(value: number) {
    if (this.observationObject) {
      this.observationObject.length = value;
      this.notifyChangeEvent();
    }
  }

  accessDescriptionChanged(value: string) {
    if (this.observationObject) {
      this.observationObject.accessDescription = value;
      this.notifyChangeEvent();
    }
  }

  geometryChanged(value: DropdownObject) {
    if (this.observationObject && value.object) {
      this.observationObject.observationGeometry = value.object;
      this.notifyChangeEvent();
    }
  }
}
