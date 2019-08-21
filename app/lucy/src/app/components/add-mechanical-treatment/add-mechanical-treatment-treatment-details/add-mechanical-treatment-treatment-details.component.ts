import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import * as moment from 'moment';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';

@Component({
  selector: 'app-add-mechanical-treatment-treatment-details',
  templateUrl: './add-mechanical-treatment-treatment-details.component.html',
  styleUrls: ['./add-mechanical-treatment-treatment-details.component.css']
})
export class AddMechanicalTreatmentTreatmentDetailsComponent implements OnInit {

  agencies: DropdownObject[] = [];
  mechanicalMethods: DropdownObject[] = [];
  species: DropdownObject[] = [];
  observations: DropdownObject[] = [];

  ViewMode = FormMode.View;

  get calculatedArea(): string {
    if (!this.object || !this.object.width || !this.object.length) {
      return '';
    }
    return String(this.object.width * this.object.length);
  }

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

  get paperFileReference(): string {
    if (!this.object) {
      return '';
    }
    return this.object.paperFileReference;
  }

  get treatmentDate(): string | undefined {
    if (this.object) {
      return this.object.date;
    }
    return undefined;
  }

  get organization(): DropdownObject | undefined {
    if (this.object && this.object.speciesAgency) {
      return {
        name: this.object.speciesAgency[this.dropdownService.displayedAgencyField],
        object: this.object.speciesAgency,
      };
    } else {
      return undefined;
    }
  }

  get selectedmechanicalMethod(): DropdownObject | undefined {
    if (this.object && this.object.mechanicalMethod) {
      return {
        name: this.object.mechanicalMethod[this.dropdownService.displayedMechanicalTreatmentMethodField],
        object: this.object.mechanicalMethod,
      };
    } else {
      return undefined;
    }
  }

  get selectedSpecies(): DropdownObject | undefined {
    if (this.object && this.object.speciesAgency) {
      return {
        name: this.object.species[this.dropdownService.displayedInvasivePlantspeciesField],
        object: this.object.species,
      };
    } else {
      return undefined;
    }
  }

  get comment(): string {
    if (!this.object || !this.object.comment) {
      return '';
    }
    return String(this.object.comment);
  }

  get observation(): DropdownObject | undefined {
    if (this.object && this.object.observation) {
      return {
        name: this.object.observation[this.dropdownService.displayedObservationField],
        object: this.object.observation,
      };
    } else {
      return undefined;
    }
  }

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  get isViewMode(): boolean {
    return this.mode === FormMode.View;
  }

  ///// Invasive plant objects
  private _object: MechanicalTreatment;
  get object(): MechanicalTreatment {
    return this._object;
  }
  @Input() set object(object: MechanicalTreatment) {
    this._object = object;
    this.autofill();
  }
  ////////////////////

  @Output() basicInfoChanged = new EventEmitter<MechanicalTreatment>();
  constructor(private dropdownService: DropdownService) { }

  ngOnInit() {
    this.dropdownService.getAgencies().then((result) => {
      this.agencies = result;
    });

    this.dropdownService.getMechanicalTreatmentMethods().then((result) => {
      this.mechanicalMethods = result;
    });

    this.dropdownService.getInvasivePlantSpecies().then((result) => {
      this.species = result;
    });
    this.dropdownService.getObservations().then((result) => {
      this.observations = result;
    });
    
  }

  private notifyChangeEvent() {
    if (this.object && !this.isViewMode) {
      this.basicInfoChanged.emit(this.object);
    }
  }

  autofill() {

  }

  observationChanged(value: DropdownObject) {
    if (this.object) {
      this.object.observation = value.object;
    }
    this.notifyChangeEvent();
  }

  treatmentDateChanged(date: Date) {
    if (this.object && date) {
      const formatted = moment(date).format('YYYY-MM-DD');
      this.object.date = formatted;
    }
  }

  paperFileReferenceChanged(value: string) {
    if (this.object) {
      this.object.paperFileReference = value;
    }
  }

  organizationChanged(value: DropdownObject) {
    if (this.object) {
      this.object.speciesAgency = value.object;
    }
    this.notifyChangeEvent();
  }

  mechanicalMethodsChanged(value: DropdownObject) {
    if (this.object) {
      this.object.mechanicalMethod = value.object;
    }
    this.notifyChangeEvent();
  }

  speciesChanged(value: DropdownObject) {
    if (this.object) {
      this.object.species = value.object;
    }
    this.notifyChangeEvent();
  }

  lengthChanged(value: string) {
    if (this.object) {
      this.object.length = +value;
    }
  }

  widthChanged(value: string) {
    if (this.object) {
      this.object.width = +value;
    }
  }

  commentChanged(value: string) {
    if (this.object) {
      this.object.comment = value;
    }
  }

}
