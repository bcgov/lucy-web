import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormMode, Jurisdiction, InvasivePlantSpecies } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species-cell',
  templateUrl: './add-plant-observation-invasive-plant-species-cell.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species-cell.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesCellComponent implements OnInit, AfterViewChecked {

  ViewMode = FormMode.View;

  ////// TODO: temporary
  plotDimentionWidth: number;
  plotDimentionLength: number;
  ////////////////////

  get calculatedArea(): string {
    if (!this.plotDimentionLength || ! this.plotDimentionWidth) {
      return `0`;
    }
    return `${this.plotDimentionWidth * this.plotDimentionLength} m²`;
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
    console.log(`Form - plant info mode is ${mode}`);
    this._mode = mode;
  }
  ////////////////////

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


  fieldValueChanged(value: DropdownObject) {
    console.log(value);
  }

  invasivePlantSpeciesChanged(value: DropdownObject) {
    console.log(value);
  }

  jurisdictionChanged(value: DropdownObject) {
    console.log(value);
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
    this.plotDimentionWidth = value;
  }

  plotDimentionLengthChanged(value: number) {
    this.plotDimentionLength = value;
  }


}
