import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { ValidationService } from 'src/app/services/validation.service';

interface WaypointCoordinate {
  lat: string;
  long: string;
}

@Component({
  selector: 'app-waypoint-text-entry',
  templateUrl: './waypoint-text-entry.component.html',
  styleUrls: ['./waypoint-text-entry.component.css']
})
export class WaypointTextEntryComponent implements OnInit, WaypointCoordinate {

   lat: string;
   long: string;
   point: WaypointCoordinate;
   validation: ValidationService;

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }

  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }

  @Output() locationChanged = new EventEmitter<any>();

  constructor(
  ) { }

  ngOnInit() {
    this.validation = new ValidationService();
  }

  latChanged(value: string) {
    if ((this.validation.isValidLatitude(value)) || (value === ``)) {
      this.lat = value;
      this.notifyChangeEvent();
    }
  }

  longChanged(value: string) {
    if ((this.validation.isValidLongitude(value)) || (value === ``)) {
      this.long = value;
      this.notifyChangeEvent();
    }
  }

  private notifyChangeEvent() {
    if (this.mode !== FormMode.View) {
      const point: WaypointCoordinate = {
        lat: this.lat,
        long: this.long
      };
      this.locationChanged.emit(point);
    }
  }
}
