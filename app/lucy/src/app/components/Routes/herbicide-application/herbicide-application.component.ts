
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormMode } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { HerbicideCodes } from 'src/app/models/ChemicalTreatment';
import { HerbicideTankMix } from 'src/app/models/ChemicalTreatment';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { FormService } from 'src/app/services/form/form.service';
import { ErrorStateMatcher } from '@angular/material';

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
export class HerbicideApplicationComponent implements OnInit, AfterViewInit {

  @Output() tankMixesChanged = new EventEmitter<any>();

  inViewMode = true;

  // Summary Line section variables
  mixDeliveryRate: number;
  treatment: any;

  amountOfMixVerification = {
    required: true,
    positiveNumber: true,
  };

  // Herbicide Selection section variables
  _tankMixes: HerbicideTankMix[] = [];
  selectedHerbicideIndex: Number;
  unusedHerbicides: HerbicideCodes[] = []; // dynamic list of unused herbicides (used to create dropdown menu)
  herbicideDropdowns: DropdownObject[] = []; // dynamic list of dropdown objects built from this.unusedHerbicides
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

  // matcher = new HerbicideApplicationErrorStateMatcher();

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
    if (this.mode === FormMode.View) {
      this.inViewMode = true;
    } else { this.inViewMode = false; }
  }
  // Base form response body
  private _responseBody: any = {};
  get responseBody(): any {
    return this._responseBody;
  }
  @Input() set responseBody(responseBody: any) {
    this._responseBody = responseBody;
  }

  // get method for _tankMixes
  get tankMixes(): HerbicideTankMix[] {
    return this._tankMixes;
  }

  // set method for _tankMixes
  set tankMixes(herbicideTankMixes: HerbicideTankMix[]) {
    this._tankMixes = herbicideTankMixes;
  }

  // Returns a copy of the tankMixes array
  get copyTankMixes(): HerbicideTankMix[] {
    const tankMixesCopy: HerbicideTankMix[] = [];
    for (const mix of this.tankMixes) tankMixesCopy.push(mix);

    return tankMixesCopy;
  }

  get isTankMixEmpty(): boolean {
    return (this.tankMixes ||  []).length === 0;
  }

  get isHerbicideEmpty(): boolean {
    return this.herbicideDropdowns.length === 0;
  }

  // Base form config
  private _config: any = {};
  get config(): any {
    return this._config;
  }
  @Input() set config(config: any) {
    this._config = config;
  }

  constructor(private codeTables: CodeTableService,
              private formService: FormService,
              private dropdownService: DropdownService) { }


  async ngOnInit() {
    if (this.mode === FormMode.Edit) {
      this.treatment = await this.formService.getObjectWithId(this.config.api, this.config.objectId);
      this.responseBody = this.treatment;

      // hacky way of passing responseBody contents to base-form
      // otherwise fields have to be touched by user before base-form recognizes
      // that values exist
      this.notifyDeliveryRateChangeEvent();
      this.notifyTankMixChangeEvent();
    }

    this.mixDeliveryRate = this.responseBody.mixDeliveryRate;
    this.compileTankMixes();
  }

  ngAfterViewInit() {
    this.prepareDropdownMenus();
  }

  private notifyTankMixChangeEvent() {
    if (this.tankMixes && this.mode !== FormMode.View) {
      this.tankMixesChanged.emit(this.tankMixes);
    }
  }

  private notifyDeliveryRateChangeEvent() {
    if (this.mixDeliveryRate && this.mode !== FormMode.View) {
      this.tankMixesChanged.emit(this.mixDeliveryRate);
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
      this.unusedHerbicides = Object.assign([], codes);
      for (const tm of this.tankMixes) {
        const index = this.unusedHerbicides.findIndex((element) => element.herbicide_id === tm.herbicide.herbicide_id);
        if (index > -1) {
          this.unusedHerbicides.splice(index, 1);
        } else {
          console.dir(`Error. Couldn't find tank mix's herbicide in codes`);
        }
      }
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    });
  }

  compileTankMixes() {
    if (this.responseBody.tankMixes) {
      for (const tm of this.responseBody.tankMixes) {
        tm.amountUsed = tm.dilutionRate;
        this.tankMixes.push(tm);
      }
    }
  }

  removeHerbicide(h: HerbicideTankMix) {
    // Making a copy of the existing tank mixes array
    const tankMixesCopy = this.copyTankMixes;

    if (tankMixesCopy.includes(h)) {
      // remove the deleted tank mix from the array of tankMixes
      const index = tankMixesCopy.findIndex((element) => element === h);
      tankMixesCopy.splice(index, 1);
      this.tankMixes = tankMixesCopy;
    }

    // add the deleted herbicide to the list of unusedHerbicides
    this.addHerbicideOption(h);
  }

  herbicideChanged(event: any) {
    // Making a copy of the existing tank mixes array
    const tankMixesCopy = this.copyTankMixes;

    // create new HerbicideTankMix for the selected herbicide, add it to array of tankMixes
    const herbicideCodeSelected = event.object;
    if (!this.tankMixesContainsHerbicide(herbicideCodeSelected)) {
      const htm = this.createTankMixForHerbicide(herbicideCodeSelected);
      tankMixesCopy.push(htm);
      this.tankMixes = tankMixesCopy;
      this.selectedHerbicideIndex = tankMixesCopy.length - 1;
    }

    // remove the selected herbicide from the list of unusedHerbicides so it can't be selected again in dropdowns
    this.removeHerbicideOption(herbicideCodeSelected);
    
    // reset this flag - something has been entered in empty row
    this.showEmptyRow = false;

    this.notifyTankMixChangeEvent();
  }

  async updateHerbicide(event: any, index: number) {
    // Making a copy of the existing tank mixes array
    const tankMixesCopy = await this.copyTankMixes;

    const herbicideSelected = event.object;
    const prevSelected = tankMixesCopy[index];

    if (!this.tankMixesContainsHerbicide(herbicideSelected)) {
      const updatedHerbicide = this.createTankMixForHerbicide(herbicideSelected);
      updatedHerbicide.showAnimation = false;
      tankMixesCopy[index] = updatedHerbicide;
      this.tankMixes = tankMixesCopy;
    }

    this.selectedHerbicideIndex = index;

    // remove the updated herbicide from the list of unusedHerbicides so it can't be selected again in dropdowns
    this.removeHerbicideOption(herbicideSelected);

    // add the previously selected herbicide to the list of unusedHerbicides
    this.addHerbicideOption(prevSelected);
  }

  addHerbicideOption(herbicide: HerbicideTankMix) {
    if (!this.unusedHerbicides.includes(herbicide.herbicide)) {
      this.unusedHerbicides.push(herbicide.herbicide);

      // sort unusedHerbicides list alphabetically by compositeName
      const sortAlpha = (h1: HerbicideCodes, h2: HerbicideCodes) => {
        if (h1.compositeName > h2.compositeName) { return 1; }
        if (h1.compositeName < h2.compositeName) { return -1; }
        return 0;
      };
      this.unusedHerbicides.sort(sortAlpha);
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    }
  }

  removeHerbicideOption(herbicide: HerbicideCodes) {
    if (this.unusedHerbicides.includes(herbicide)) {
      const index = this.unusedHerbicides.findIndex((element) => element === herbicide);
      this.unusedHerbicides.splice(index, 1);
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    }
  }

  showFocus(index: number): boolean {
    return this.selectedHerbicideIndex === index;
  }

  applicationRateChanged(event: any, htm: HerbicideTankMix) {
    htm.applicationRate = event;
    this.notifyTankMixChangeEvent();
  }

  amountUsedChanged(event: any, htm: HerbicideTankMix) {
    htm.dilutionRate = event;
    htm.amountUsed = event;
    this.notifyTankMixChangeEvent();
  }

  deliveryRateChanged(event: any) {
    if (event !== '') {
      this.mixDeliveryRate = event;
      this.responseBody.mixDeliveryRate = this.mixDeliveryRate;
      this.notifyDeliveryRateChangeEvent();
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
      applicationRate: h.applicationRate,
      dilutionRate: undefined,  // actually amount used
      amountUsed: undefined,
      herbicide: h,
      chemicalTreatmentId: undefined,
      herbicide_tank_mix_id: undefined,
      showAnimation: true, // used to enable/disable fade-in animation
    };
    return htm;
  }

  tankMixesContainsHerbicide(h: HerbicideCodes): boolean {
    for (const htm of this.tankMixes) {
      if (h === htm.herbicide) {
        return true;
      }
    }
    return false;
  }

}
