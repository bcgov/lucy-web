import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { ConverterService, LatLongCoordinate } from 'src/app/services/coordinateConversion/location.service';

@Component({
  selector: 'app-waypoint-text-entry',
  templateUrl: './waypoint-text-entry.component.html',
  styleUrls: ['./waypoint-text-entry.component.css']
})
export class WaypointTextEntryComponent implements OnInit {

  lat: string;
  long: string;

  latVerification = {
    required: true,
  };

  longVerification = {
    required: true,
  };

  private _point: LatLongCoordinate;
  get point(): LatLongCoordinate {
    return this._point;
  }

  @Input() set point(point: LatLongCoordinate) {
    this._point = {...point};
    let latExists = false;
    let longExists = false;

    if (this.point && this.point.latitude) {
      this.lat = `${this.point.latitude}`;
      latExists = true;
    }
    if (this.point && this.point.longitude) {
      this.long = `${this.point.longitude}`;
      longExists = true;
    }
  }

  @Output() pointChanged = new EventEmitter<any>();

  constructor(
    private validation: ValidationService,
    private converter: ConverterService,
  ) { }

  ngOnInit() {
  }

  latChanged(value: string) {
    if ((this.validation.isValidLatitude(value)) || (value === ``)) {
      this.lat = value;
    }
    this.notifyChangeEvent();
  }

  longChanged(value: string) {
    if ((this.validation.isValidLongitude(value)) || (value === ``)) {
      this.long = value;
    }
    this.notifyChangeEvent();
  }

  private notifyChangeEvent() {
    const lat = Number(this.lat);
    const long = Number(this.long);
    if (this.converter.isInsideBC(lat, long)) {
      this._point = {
        latitude: Number(this.lat),
        longitude: Number(this.long)
      };
      this.pointChanged.emit(this._point);
    } else {
      console.log(this.lat + `, ` + this.long + ` is not within BC`);
    }
  }
}
