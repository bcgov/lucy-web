
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormMode } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { HerbicideCodes } from 'src/app/models/ChemicalTreatment';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { FormConfigField, FormService } from 'src/app/services/form/form.service';
import * as faker from 'faker';
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
export class HerbicideApplicationComponent implements OnInit {

  // Summary Line section variables
  amountUsed: number;

  // Herbicide Selection section variables
  _herbicidesUsed: HerbicideCodes[] = [];
  herbicides: HerbicideCodes[];

  herbicideMixFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
    Validators.max(100),
    Validators.pattern('^[0-9]*$')
  ]);

  matcher = new HerbicideApplicationErrorStateMatcher();

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  herbicideDropdowns: DropdownObject[];
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

  set herbicidesUsed(h: HerbicideCodes[]) {
    for (const elem of h) {
        this._herbicidesUsed.push(elem);
    }
  }

  get herbicidesUsed(): HerbicideCodes[] {
      return this._herbicidesUsed;
  }

  addEmptyTableRow() {
    // this.herbicidesUsed.push(this.herbicides[faker.random.number(this.herbicides.length)]);
  }

  async prepareDropdownMenus() {
    await this.codeTables.getHerbicideCodes().then((codes) => {
      this.herbicides = codes;
    });
    this.herbicideDropdowns = this.dropdownService.createDropdownObjectsFrom(this.herbicides, 'compositeName');
    // console.dir(this.herbicideDropdowns);
  }

  removeHerbicide(h: HerbicideCodes) {
    if (this.herbicidesUsed.includes(h)) {
      const index = this.herbicidesUsed.findIndex((element) => element === h);
      this.herbicidesUsed.splice(index, 1);
    }
  }

  // herbicideChanged() {
  //   console.dir('something was selected');
  // }

  herbicideChanged(event: any) {
    console.dir(event);
  }

}
