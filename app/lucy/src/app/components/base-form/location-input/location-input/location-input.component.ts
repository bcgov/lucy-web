/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormMode } from 'src/app/models';
import { MapPreviewPoint, MapMarker } from 'src/app/components/Utilities/map-preview/map-preview.component';
import { ConverterService } from 'src/app/services/coordinateConversion/location.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { FormConfigField, FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.css']
})
export class LocationInputComponent implements OnInit {
   // Set the initial view location for map
  public mapCenter: MapPreviewPoint = {
    latitude: 52.068508,
    longitude: -123.288152,
    zoom: 4
  };

  // Markers shown on map
  markers: MapMarker[] = [];

  // Entry mode flag
  locationEntryModeLatLong = true;
  // UTM
  eastings: string;
  northings: string;
  zone: string;
  minUTMDecimals = 2;

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  ///// Location object
  private _object: any;
  get object(): any {
    return this._object;
  }
  @Input() set object(object: any) {
    this._object = { ...object};
    let latExists = false;
    let longExists = false;

    if (this.object && this.object.latitude && this.object.latitude.value) {
      // console.log(`setting ${this.object.latitude.value}`);
      this.lat = `${this.object.latitude.value}`;
      latExists = true;
    }
    if (this.object && this.object.longitude && this.object.longitude.value) {
      // console.log(`setting ${this.object.longitude.value}`);
      this.long = `${this.object.longitude.value}`;
      longExists = true;
    }
    if (latExists && longExists) {
      this.autofill();
    }
  }
  ////////////////////

  get latitudeField(): FormConfigField {
    if (this.object && this.object.latitude) {
      return this.object.latitude;
    } else {
      return this.formService.getEmptyConfigField();
    }
  }

  get longitudeField(): FormConfigField {
    if (this.object && this.object.longitude) {
      return this.object.longitude;
    } else {
      return this.formService.getEmptyConfigField();
    }
  }

  northingsVerification = {
    isNorthingsUTM: true,
  };

  eastingsVerification = {
    isEastingsUTM: true,
  };

  zonesVerification = {
    isZoneUTM: true,
  };

  private _long = '';
  get long(): string {
    return this._long;
  }
  set long(value: string) {
    this._long = value;
  }
  private _lat = '';
  get lat(): string {
    return this._lat;
  }
  set lat(value: string) {
    this._lat = value;
  }

  // * Validations
  get validLat(): Boolean {
    return this.validation.isValidLatitude(this.lat);
  }
  get validLong(): Boolean {
    return this.validation.isValidLongitude(this.long);
  }

  get validEastings(): boolean {
    return this.validation.isValidUTMEastings(this.eastings);
  }

  get validNorthings(): boolean {
    return this.validation.isValidUTMNorthings(this.northings);
  }

  get validZone(): boolean {
    return this.validation.isValidInteger(this.zone);
  }

  get isViewMode(): boolean {
    return this.mode === FormMode.View;
  }

  @Output() locationChanged = new EventEmitter<any>();
  constructor(private converterService: ConverterService, private validation: ValidationService, private formService: FormService) { }

  ngOnInit() {
  }

  autofill() {
    this.setUTMFromLatLong();
  }

  private notifyChangeEvent() {
    if (this.object && !this.isViewMode) {
      this.locationChanged.emit(this.object);
    }
  }

  setUTMFromLatLong() {
    if (!this.object || !this.validation.isValidLatitude(String(this.object.latitude.value)) || !this.validation.isValidLongitude(String(this.object.longitude.value))) {
      return;
    }

    const converted = this.converterService.convertLatLongCoordinateToUTM(this.object.latitude.value, this.object.longitude.value);
    this.zoneChanged(`${(converted.zone)}`);
    this.northingsChanged(`${(converted.northings.toFixed(0))}`);
    this.eastingChanged(`${(converted.eastings.toFixed(0))}`);

    this.setMapToCurrentLocation();
  }

  private utmCoordinatesAreValid(): boolean {
    return (this.validNorthings && this.validEastings && this.validZone);
  }

  switchInputUTM() {
    this.locationEntryModeLatLong = false;
  }

  switchInputLatLong() {
    this.locationEntryModeLatLong = true;
  }

  /**
   * Validate and show on map
   * @param value latitude
   */
  latChanged(value: string) {
    if ((this.object && Number(value) && this.validation.isValidLatitude(value)) || (value === ``)) {
      this.object.latitude.value = value;
      this.notifyChangeEvent();
    }
    this.latLongChanged();
  }

  /**
   * Validate and show on map
   * @param value longitude
   */
  longChanged(value: string) {
    if ((this.object && Number(value) && this.validation.isValidLongitude(value)) || (value === ``)) {
      this.object.longitude.value = value;
      this.notifyChangeEvent();
    }
    this.latLongChanged();
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

  /**
   * Validate, convert to UTM and show location on map
   */
  latLongChanged() {
    // If its NOT in lat long entry mode, dont run this function.
    if (!this.locationEntryModeLatLong || !this.object) {
      return;
    }

    this.setUTMFromLatLong();
  }

  /**
   * Validate, convert to Lat/Long, store and show location on map
   */
  utmValuesChanged() {
    // If observation is being viewed, dont convert
    if (this.mode === FormMode.View) {
      return;
    }

    // If its in lat long entry mode, dont run this function.
    if (this.locationEntryModeLatLong || !this.object) {
      return;
    }

    // 1) Check if fields are valid
    if (!this.utmCoordinatesAreValid()) {
      return;
    }

    // 2) Convert to lat long
    const converted = this.converterService.convertUTMToLatLongCoordinate(+this.eastings, +this.northings, +this.zone);

    // 3) Check if converted lat long are valid
    if (!converted || !this.validation.isValidLatitude(String(converted.latitude)) || !this.validation.isValidLongitude(String(converted.longitude))) {
      this.object.latitude.value = '';
      this.object.longitude.value = '';
      this.lat = ``;
      this.long = ``;
      return;
    }

    // 4) Store lat / long
    this.object.latitude.value = parseFloat(converted.latitude.toFixed(6));
    this.object.longitude.value = parseFloat(converted.longitude.toFixed(6));
    this.lat = `${this.object.latitude.value}`;
    this.long = `${this.object.longitude.value}`;

    // 5) Set Map
    this.setMapToCurrentLocation();
  }

  /**
   * Show map and add pin at the current observation lat/long
   */
  private setMapToCurrentLocation() {
    if (!this.object.latitude.value || !this.object.longitude.value) {
      console.log(`invalid location`);
      return;
    }
    this.setMapTo(this.object.latitude.value, this.object.longitude.value);
  }

  /**
   * Show map and add pin at specified lat long
   * @param latitude number
   * @param longitude number
   */
  private setMapTo(latitude: number, longitude: number) {
    this.mapCenter = {
      latitude: latitude,
      longitude: longitude,
      zoom: 18
    };
    this.markers = [];
    this.markers.push({
      latitude: latitude,
      longitude: longitude
    });
  }

  mapCenterChanged(event: any) {
  }

}
