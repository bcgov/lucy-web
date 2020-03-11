import { Component, OnInit, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';


@Component({
  selector: 'app-waypoint-text-entry',
  templateUrl: './waypoint-text-entry.component.html',
  styleUrls: ['./waypoint-text-entry.component.css']
})
export class WaypointTextEntryComponent implements OnInit {

   lat: string;
   long: string;
   validation: ValidationService;

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }

  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }

  constructor(
  ) { }

  ngOnInit() {
    this.validation = new ValidationService();
  }

  latChanged(value: string) {
    if ((this.validation.isValidLatitude(value)) || (value === ``)) {
      this.lat = value;
    }
  }

  longChanged(value: string) {
    if ((this.validation.isValidLongitude(value)) || (value === ``)) {
      this.long = value;
    }
  }

}
