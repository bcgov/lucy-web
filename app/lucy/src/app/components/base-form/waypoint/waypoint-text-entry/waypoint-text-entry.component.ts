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
  eastings: string;
  northings: string;
  zone: string;

  latVerification = {
    required: true,
  };

  longVerification = {
    required: true,
  };

  eastingsVerification = {
    required: true,
  };

  northingsVerification = {
    required: true,
  };

  zoneVerification = {
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

  @Input() showLatLong: boolean = true;

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
    this.latLongValuesChanged();
    this.notifyChangeEvent();
  }

  longChanged(value: string) {
    if ((this.validation.isValidLongitude(value)) || (value === ``)) {
      this.long = value;
    }
    this.latLongValuesChanged();
    this.notifyChangeEvent();
  }

  eastingChanged(value: string) {
    if (!this.validation.isValidUTMEastings(value)) {
      return;
    }
    this.eastings = value;
    this.utmValuesChanged();
    this.notifyChangeEvent();
  }

  northingsChanged(value: string) {
    if (!this.validation.isValidUTMNorthings(value)) {
      return;
    }
    this.northings = value;
    this.utmValuesChanged();
    this.notifyChangeEvent();
  }

  zoneChanged(value: string) {
    if (!this.validation.isValidUTMZone(value)) {
      return;
    }
    this.zone = value;
    this.utmValuesChanged();
    this.notifyChangeEvent();
  }

  latLongValuesChanged() {
    if (!this.showLatLong) {
      return;
    }

    const converted = this.converter.convertLatLongCoordinateToUTM(+this.lat, +this.long);

    if (!converted
        || !this.validation.isValidUTMEastings(String(Math.round(converted.eastings)))
        || !this.validation.isValidUTMNorthings(String(Math.round(converted.northings)))
        || !this.validation.isValidUTMZone(String(Math.round(converted.zone)))
    ) {
      this.eastings = '';
      this.northings = '';
      this.zone = '';
      return;
    }

    this.eastings = `${Math.round(converted.eastings)}`;
    this.northings = `${Math.round(converted.northings)}`;
    this.zone = `${Math.round(converted.zone)}`;
  }

  utmValuesChanged() {
    // If its in lat/long mode, dont run this function.
    if (this.showLatLong) {
      return;
    }

    const converted = this.converter.convertUTMToLatLongCoordinate(+this.eastings, +this.northings, +this.zone);

    if (!converted || !this.validation.isValidLatitude(String(converted.latitude)) || !this.validation.isValidLongitude(String(converted.longitude))) {
      this.lat = ``;
      this.long = ``;
      return;
    }

    this.lat = `${parseFloat(converted.latitude.toFixed(6))}`;
    this.long = `${parseFloat(converted.latitude.toFixed(6))}`;
  }
  

  private notifyChangeEvent() {
    this._point = {
      latitude: Number(this.lat),
      longitude: Number(this.long)
    };
    this.pointChanged.emit(this._point);
  }
}
