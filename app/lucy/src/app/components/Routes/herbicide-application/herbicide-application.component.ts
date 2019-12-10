
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormMode } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { HerbicideCodes } from 'src/app/models/ChemicalTreatment';
import { HerbicideTankMix } from 'src/app/models/ChemicalTreatment';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { FormConfigField, FormService } from 'src/app/services/form/form.service';
import * as faker from 'faker';
import { ErrorStateMatcher } from '@angular/material';
import { DropdownComponent } from '../../Input/dropdown/dropdown.component';

export class HerbicideApplicationErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-herbicide-application',
  templateUrl: './herbicide-application.component.html',
  styleUrls: ['./herbicide-application.component.css']
})
export class HerbicideApplicationComponent implements OnInit {

  // Summary Line section variables
  amountUsed: number;
  overallDilution: number;
  overallApplicationRate: number;
  mixDeliveryRate: number;

  amountOfMixVerification = {
    required: true,
    positiveNumber: true,
  };

  // Herbicide Selection section variables
  _tankMixesUsed: HerbicideTankMix[] = [];
  herbicides: HerbicideCodes[];
  herbicideDropdowns: DropdownObject[];
  showEmptyRow = false;
  _dropdown: DropdownComponent;

  applicationRateVerification = {
    required: true,
    positiveNumber: true
  };
  deliveryRateVerification = {
    required: true,
    positiveNumber: true
  };

  deliveryRateFieldControl = new FormControl('', [
    Validators.required,
    Validators.min(0)
  ]);
  applicationRateFieldControl = new FormControl('', [
    Validators.required,
    Validators.min(0)
  ]);
  amountUsedFieldControl = new FormControl('', [
    Validators.required,
    Validators.min(0)
  ]);

  matcher = new HerbicideApplicationErrorStateMatcher();

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }

  constructor(private codeTables: CodeTableService, private validation: ValidationService, private formService: FormService, private dropdownService: DropdownService) { }


  ngOnInit() {
    this.prepareDropdownMenus();
  }

  set tankMixesUsed(h: HerbicideTankMix[]) {
    for (const elem of h) {
        this._tankMixesUsed.push(elem);
    }
  }

  get tankMixesUsed(): HerbicideTankMix[] {
      return this._tankMixesUsed;
  }

  addEmptyTableRow() {
    this.showEmptyRow = true;

  }

  removeEmptyRow() {
    this.showEmptyRow = false;
  }

  async prepareDropdownMenus() {
    console.dir(`preparing herbicide dropdowns`);
    await this.codeTables.getHerbicideCodes().then((codes) => {
      this.herbicides = codes;
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(codes);
    });
    console.dir(`herbicide dropdowns created`);
    // this._dropdown.items = this.herbicideDropdowns;
  }

  removeHerbicide(h: HerbicideTankMix) {
    if (this.tankMixesUsed.includes(h)) {
      // remove the deleted tank mix from the array of tankMixes
      const index = this.tankMixesUsed.findIndex((element) => element === h);
      this.tankMixesUsed.splice(index, 1);

      this._dropdown.filteredItems.push(this.dropdownService.createDropdownObjectsFrom([h.herbicide])[0]);
    }
  }

  herbicideChanged(event: any) {
    // create new HerbicideTankMix for the selected herbicide, add it to array of tankMixes
    const herbicideCodeSelected = event.object;
    if (!this.tankMixesUsedContainsHerbicide(herbicideCodeSelected)) {
      const htm = this.createTankMixForHerbicide(herbicideCodeSelected);
      this.tankMixesUsed.push(htm);

      const index = this._dropdown.filteredItems.findIndex((element) => element === herbicideCodeSelected);
      if (index > 0) {
        this._dropdown.filteredItems.splice(index, 1);
      }
    }

    // reset this flag - something has been entered in empty row
      this.showEmptyRow = false;
  }

  applicationRateChanged(event: any, htm: HerbicideTankMix) {
    if (this.applicationRateFieldControl.errors === null) {
      htm.applicationRate = event;
    }
  }

  amountUsedChanged(event: any, htm: HerbicideTankMix) {
    if (this.amountUsedFieldControl.errors === null) {
      htm.amountUsed = event;
    }
  }

  getDropdownObjectForHerbicideTankMix(h: HerbicideTankMix): DropdownObject {
    const obj: DropdownObject = {
      name: h.herbicide.compositeName,
      object: h.herbicide
    };
    return obj;
  }

  createTankMixForHerbicide(h: HerbicideCodes): HerbicideTankMix {
    const htm: HerbicideTankMix = {
      displayLabel: h.compositeName,
      applicationRate: h.applicationRate,
      amountUsed: undefined,
      herbicide: h,
    };
    return htm;
  }

  tankMixesUsedContainsHerbicide(h: HerbicideCodes): boolean {
    for (const htm of this.tankMixesUsed) {
      if (h === htm.herbicide) {
        return true;
      }
    }
    return false;
  }

}
