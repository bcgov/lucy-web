import { Component, OnInit, Input, Output, AfterViewChecked, EventEmitter } from '@angular/core';
import { FormMode, Jurisdiction, InvasivePlantSpecies, SpeciesObservations } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';

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
  constructor(private validation: ValidationService, private dropdownService: DropdownService) { }

  ngOnInit() {
    this.getDropdownData();
  }

  ngAfterViewChecked(): void {
    // console.log(`Form - plant info mode is ${this.mode} -ngAfterViewChecked`);
  }

  getDropdownData() {
    this.dropdownService.getInvasivePlantSpecies().then((result) => {
      this.invasivePlantSpecies = result;
    });

    this.dropdownService.getJuristictions().then((result) => {
      this.juristictions = result;
    });

    this.dropdownService.getSurveyModes().then((result) => {
      this.surveyModes = result;
    });

    this.dropdownService.getSoilTextureCodes().then((result) => {
      this.soilTextureCodes = result;
    });

    this.dropdownService.getSpecificUseCodes().then((result) => {
      this.specificUseCodes = result;
    });

    this.dropdownService.getDistributions().then((result) => {
      this.distributions = result;
    });

    this.dropdownService.getDensities().then((result) => {
      this.densities = result;
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
    console.log(value);
  }

  distributionChanged(value: DropdownObject) {
    console.log(value);
  }

  surveyModeChanged(value: DropdownObject) {
    console.log(value);
  }

  soilTextureCodeChanged(value: DropdownObject) {
    console.log(value);
  }

  specificUseCodeChanged(value: DropdownObject) {
    console.log(value);
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
