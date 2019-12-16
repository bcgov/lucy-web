
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormMode } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { HerbicideCodes } from 'src/app/models/ChemicalTreatment';
import { HerbicideTankMix } from 'src/app/models/ChemicalTreatment';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { FormConfigField, FormService } from 'src/app/services/form/form.service';
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

  @Output() tankMixesChanged = new EventEmitter<HerbicideTankMix[]>();

  // Summary Line section variables
  mixDeliveryRate: number;

  amountOfMixVerification = {
    required: true,
    positiveNumber: true,
  };

  // Herbicide Selection section variables
  _tankMixesUsed: HerbicideTankMix[] = [];
  unusedHerbicides: HerbicideCodes[]; // dynamic list of unused herbicides (used to create dropdown menu)
  herbicideDropdowns: DropdownObject[]; // dynamic list of dropdown objects built from this.unusedHerbicides
  showEmptyRow = false;

  applicationRateVerification = {
    required: true,
    positiveNumber: true
  };
  deliveryRateVerification = {
    required: true,
    positiveNumber: true
  };
  amountUsedVerification = {
    required: true,
    positiveNumber: true
  };

  deliveryRateFieldControl = new FormControl('', [
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

  constructor(private codeTables: CodeTableService, private formService: FormService, private dropdownService: DropdownService) { }


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

  private notifyChangeEvent() {
    if (this.tankMixesUsed && this.mode !== FormMode.View) {
      this.tankMixesChanged.emit(this.tankMixesUsed);
    }
  }

  addEmptyTableRow() {
    this.showEmptyRow = true;

  }

  removeEmptyRow() {
    this.showEmptyRow = false;
  }

  async prepareDropdownMenus() {
    await this.codeTables.getHerbicideCodes().then((codes) => {
      this.unusedHerbicides = codes;
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    });
  }

  removeHerbicide(h: HerbicideTankMix) {
    if (this.tankMixesUsed.includes(h)) {
      // remove the deleted tank mix from the array of tankMixes
      const index = this.tankMixesUsed.findIndex((element) => element === h);
      this.tankMixesUsed.splice(index, 1);
    }

    // return the deleted herbicide to the list of unusedHerbicides
    if (!this.unusedHerbicides.includes(h.herbicide)) {
      this.unusedHerbicides.push(h.herbicide);

      // sort unusedHerbicides list alphabetically by compositeName
      const sortAlpha = (h1: HerbicideCodes, h2: HerbicideCodes) => {
        if (h1.compositeName > h2.compositeName) { return 1; }
        if (h1.compositeName < h2.compositeName) { return -1; }
        return 0;
      }
      this.unusedHerbicides.sort(sortAlpha);
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    }
  }

  herbicideChanged(event: any) {
    // create new HerbicideTankMix for the selected herbicide, add it to array of tankMixes
    const herbicideCodeSelected = event.object;
    if (!this.tankMixesUsedContainsHerbicide(herbicideCodeSelected)) {
      const htm = this.createTankMixForHerbicide(herbicideCodeSelected);
      this.tankMixesUsed.push(htm);
    }

    // remove the selected herbicide from the list of unusedHerbicides so it can't be selected again in dropdowns
    if (this.unusedHerbicides.includes(herbicideCodeSelected)) {
      const index = this.unusedHerbicides.findIndex((element) => element === herbicideCodeSelected);
      this.unusedHerbicides.splice(index, 1);
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    }

    // reset this flag - something has been entered in empty row
    this.showEmptyRow = false;

    this.notifyChangeEvent();
  }

  applicationRateChanged(event: any, htm: HerbicideTankMix) {
    htm.applicationRate = event;
    this.notifyChangeEvent();
  }

  amountUsedChanged(event: any, htm: HerbicideTankMix) {
    htm.amountUsed = event;
    this.notifyChangeEvent();
  }

  deliveryRateChanged(event: any) {
    if (this.deliveryRateFieldControl.errors === null) {
      this.mixDeliveryRate = event;
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
