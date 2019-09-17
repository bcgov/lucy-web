import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';
import { FormMode } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import { ConverterService } from 'src/app/services/coordinateConversion/location.service';

@Component({
  selector: 'app-add-mechanical-treatment-advanced',
  templateUrl: './add-mechanical-treatment-advanced.component.html',
  styleUrls: ['./add-mechanical-treatment-advanced.component.css']
})
export class AddMechanicalTreatmentAdvancedComponent implements OnInit {

  issueswithTreatment: DropdownObject[] = [];
  disposalMethods: DropdownObject[] = [];
  disturbanceIssues: DropdownObject[] = [];
  rootSystems: DropdownObject[] = [];

  get issuewithTreatment(): DropdownObject {
    if (this.object && this.object.issue) {
      return {
        name: this.object.issue[this.dropdownService.displayedMechanicalIssueField],
        object: this.object.issue,
      };
    } else {
      return undefined;
    }
  }

  get disposalMethod(): DropdownObject {
    if (this.object && this.object.mechanicalDisposalMethod) {
      return {
        name: this.object.mechanicalDisposalMethod[this.dropdownService.displayedMechanicalDisposalMethodField],
        object: this.object.mechanicalDisposalMethod,
      };
    } else {
      return undefined;
    }
  }

  get disturbanceIssue(): DropdownObject {
    if (this.object && this.object.soilDisturbance) {
      return {
        name: this.object.soilDisturbance[this.dropdownService.displayedSoilDisturbanceField],
        object: this.object.soilDisturbance,
      };
    } else {
      return undefined;
    }
  }

  get rootSystem(): DropdownObject {
    if (this.object && this.object.rootRemoval) {
      return {
        name: this.object.rootRemoval[this.dropdownService.displayedRootRemovalField],
        object: this.object.rootRemoval,
      };
    } else {
      return undefined;
    }
  }

  get signageOnSiteIndicator(): boolean {
    if (this.object) {
      return this.object.signageOnSiteIndicator;
    } else {
      return false;
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

  ///// Mechanical Treatment object
  private _object: MechanicalTreatment;
  get object(): MechanicalTreatment {
    return this._object;
  }
  @Input() set object(object: MechanicalTreatment) {
    this._object = object;
  }
  ////////////////////

  @Output() advancedInfoChanged = new EventEmitter<MechanicalTreatment>();
  constructor(private dropdownService: DropdownService) { }

  ngOnInit() {
    this.fetchDropDownContent();
  }

  async fetchDropDownContent() {
    this.issueswithTreatment = await this.dropdownService.getMechanicalIssues();
    this.disposalMethods = await this.dropdownService.getMechanicalDisposalMethods();
    this.disturbanceIssues = await this.dropdownService.getMechanicalSoilDisturbances();
    this.rootSystems = await this.dropdownService.getMechanicalRootRemovals();
  }

  private notifyChangeEvent() {
    if (this.object && !this.isViewMode) {
      this.advancedInfoChanged.emit(this.object);
    }
  }

  issueswithTreatmentChanged(value: DropdownObject) {
    if (this.object) {
      this.object.issue = value.object;
    }
    this.notifyChangeEvent();
  }

  disposalMethodsChanged(value: DropdownObject) {
    if (this.object) {
      this.object.mechanicalDisposalMethod = value.object;
    }
    this.notifyChangeEvent();

  }

  disturbanceIssuestChanged(value: DropdownObject) {
    if (this.object) {
      this.object.soilDisturbance = value.object;
    }
    this.notifyChangeEvent();
  }

  rootSystemChanged(value: DropdownObject) {
    if (this.object) {
      this.object.rootRemoval = value.object;
    }
    this.notifyChangeEvent();
  }

  signageOnSiteIndicatorChanged(value: boolean) {
    if (this.object) {
      this.object.signageOnSiteIndicator = value;
    }
    this.notifyChangeEvent();
  }

}
