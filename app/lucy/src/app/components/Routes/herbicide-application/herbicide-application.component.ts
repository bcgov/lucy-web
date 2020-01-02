
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
import { LoadingService } from 'src/app/services/loading.service';

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
              private dropdownService: DropdownService,
              private loadingService: LoadingService) { }


  async ngOnInit() {
    if (this.mode === FormMode.Create) {
      this.prepareDropdownMenus();
    } else if (this.mode === FormMode.Edit) {
      // this.loadingService.add();
      this.treatment = await this.formService.getObjectWithId(this.config.api, this.config.objectId);
      // this.loadingService.remove();
      this.responseBody = this.treatment;
      this.mixDeliveryRate = this.responseBody.mixDeliveryRate;
      this.prepareDropdownMenus();
      this.compileTankMixes();
    }
  }

  set tankMixes(h: HerbicideTankMix[]) {
    for (const elem of h) {
        this._tankMixes.push(elem);
    }
  }

  get tankMixes(): HerbicideTankMix[] {
      return this._tankMixes;
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
        this.unusedHerbicides.splice(this.unusedHerbicides.indexOf(tm.herbicide), 1);
      }
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    });
  }

  compileTankMixes() {
    for (const tm of this.responseBody.tankMixes) {
      tm.amountUsed = tm.dilutionRate;
      this.tankMixes.push(tm);
    }
  }

  removeHerbicide(h: HerbicideTankMix) {
    if (this.tankMixes.includes(h)) {
      // remove the deleted tank mix from the array of tankMixes
      const index = this.tankMixes.findIndex((element) => element === h);
      this.tankMixes.splice(index, 1);
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
    if (!this.tankMixesContainsHerbicide(herbicideCodeSelected)) {
      const htm = this.createTankMixForHerbicide(herbicideCodeSelected);
      this.tankMixes.push(htm);
    }

    // remove the selected herbicide from the list of unusedHerbicides so it can't be selected again in dropdowns
    if (this.unusedHerbicides.includes(herbicideCodeSelected)) {
      const index = this.unusedHerbicides.findIndex((element) => element === herbicideCodeSelected);
      this.unusedHerbicides.splice(index, 1);
      this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.unusedHerbicides);
    }

    // reset this flag - something has been entered in empty row
    this.showEmptyRow = false;

    this.notifyTankMixChangeEvent();
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
      herbicide_tank_mix_id: undefined
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
