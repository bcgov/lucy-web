import { Component, OnInit, Input, Output, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormMode, Jurisdiction, InvasivePlantSpecies, SpeciesObservations } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species-cell',
  templateUrl: './add-plant-observation-invasive-plant-species-cell.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species-cell.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesCellComponent implements OnInit, AfterViewChecked {
  ViewMode = FormMode.View;

  get width(): string {
    if (!this.object || !this.object.width) {
      return '';
    }
    return String(this.object.width);
  }

  get length(): string {
    if (!this.object || !this.object.length) {
      return '';
    }
    return String(this.object.length);
  }

  get selectedInviasiveSpecies(): DropdownObject | undefined {
    if (!this.object || !this.object.species) {
      return undefined;
    }
    return {
      name: this.object.species[this.dropdownService.displayedInvasivePlantspeciesField],
      object: this.object.species,
    };
  }

  get selectedJurisdiction(): DropdownObject | undefined {
    if (!this.object || !this.object.jurisdiction) {
      return undefined;
    }
    return {
      name: this.object.jurisdiction[this.dropdownService.displayedJuristictionsField],
      object: this.object.jurisdiction,
    };
  }

  get selectedDensity(): DropdownObject | undefined {
    if (!this.object || !this.object.density) {
      return undefined;
    }
    return {
      name: this.object.density[this.dropdownService.displayedDensityField],
      object: this.object.density,
    };
  }

  get selectedDistribution(): DropdownObject | undefined {
    if (!this.object || !this.object.distribution) {
      return undefined;
    }
    return {
      name: this.object.distribution[this.dropdownService.displayedDistributionField],
      object: this.object.distribution,
    };
  }
 
  get selectedSurveyType(): DropdownObject | undefined {
    if (!this.object || !this.object.surveyType) {
      return undefined;
    }
    return {
      name: this.object.surveyType[this.dropdownService.displayedSurveyTypeField],
      object: this.object.surveyType,
    };
  }

  get selectedSurveyGeometry(): DropdownObject | undefined {
    if (!this.object || !this.object.surveyGeometry) {
      return undefined;
    }
    return {
      name: this.object.surveyGeometry[this.dropdownService.displayedSurveyGeometryField],
      object: this.object.surveyGeometry,
    };
  }

  get selectedSpecificUseCode(): DropdownObject | undefined {
    if (!this.object || !this.object.specificUseCode) {
      return undefined;
    }
    return {
      name: this.object.specificUseCode[this.dropdownService.displayedSpecificUseCodeField],
      object: this.object.specificUseCode,
    };
  }

  get selectedSoilTexture(): DropdownObject | undefined {
    if (!this.object || !this.object.soilTexture) {
      return undefined;
    }
    return {
      name: this.object.soilTexture[this.dropdownService.displayedSoilTextureField],
      object: this.object.soilTexture,
    };
  }

  get calculatedArea(): string {
    if (!this.object) {
      return ``;
    }
    const total =  parseFloat((this.object.width * this.object.length).toFixed(6));
    return `${total} m²`;
  }

  get accessDescription(): string {
    if (!this.object || !this.object.accessDescription) {
      return '';
    }
    return this.object.accessDescription;
  }

  juristictions: DropdownObject[];
  invasivePlantSpecies: DropdownObject[];
  surveyModes: DropdownObject[];
  soilTextureCodes: DropdownObject[];
  specificUseCodes: DropdownObject[];
  distributions: DropdownObject[];
  densities: DropdownObject[];

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
  private _object: SpeciesObservations;
  // Get
  get object(): SpeciesObservations {
    return this._object;
  }
  // Set
  @Input() set object(object: SpeciesObservations) {
    this._object = object;
  }
  ////////////////////

  @Output() speciesCellInfoChanged = new EventEmitter<SpeciesObservations>();
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
  }

  private notifyChangeEvent() {
    if (this.object) {
      this.speciesCellInfoChanged.emit(this.object);
    }
  }

  fieldValueChanged(value: DropdownObject) {
    console.log(value);
  }

  invasivePlantSpeciesChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.species = value.object;
      this.notifyChangeEvent();
    }
  }

  jurisdictionChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.jurisdiction = value.object;
      this.notifyChangeEvent();
    }
  }

  densityChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.density = value.object;
      this.notifyChangeEvent();
    }
  }

  distributionChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.distribution = value.object;
      this.notifyChangeEvent();
    }
  }

  surveyModeChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.surveyType = value.object;
      this.notifyChangeEvent();
    }
  }

  soilTextureCodeChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.soilTexture = value.object;
      this.notifyChangeEvent();
    }
  }

  specificUseCodeChanged(value: DropdownObject) {
    if (this.object && value.object) {
      this.object.specificUseCode = value.object;
      this.notifyChangeEvent();
    }
  }

  plotDimentionWidthChanged(value: number) {
    if (this.object) {
      this.object.width = value;
      this.notifyChangeEvent();
    }
  }

  plotDimentionLengthChanged(value: number) {
    if (this.object) {
      this.object.length = value;
      this.notifyChangeEvent();
    }
  }

  accessDescriptionChanged(value: string) {
    if (this.object) {
      this.object.accessDescription = value;
      this.notifyChangeEvent();
    }
  }
}
