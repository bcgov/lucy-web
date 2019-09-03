import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import { MapMarker, MapPreviewPoint } from '../../../Utilities/map-preview/map-preview.component';
import { ConverterService } from 'src/app/services/converter.service';
import { DropdownService, DropdownObject } from 'src/app/services/dropdown.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-mechanical-treatment-basic-info',
  templateUrl: './add-mechanical-treatment-basic-info.component.html',
  styleUrls: ['./add-mechanical-treatment-basic-info.component.css']
})
export class AddMechanicalTreatmentBasicInfoComponent implements OnInit {
  locationEntryModeLatLong = true;
  mechanicalTreatmentProviders: DropdownObject[] = [];

  // Set the initial view location for map
  public mapCenter: MapPreviewPoint = {
    latitude: 52.068508,
    longitude: -123.288152,
    zoom: 4
  };

  // Markers shown on map
  private markers: MapMarker[] = [];

  // UTM
  eastings: string;
  northings: string;
  zone: string;
  minUTMDecimals = 2;

  get applicatorFirstName(): string {
    if (this.object) {
      return this.object.applicatorFirstName;
    }
    return ``;
  }

  get applicatorLastName(): string {
    if (this.object) {
      return this.object.applicatorLastName;
    }
    return ``;
  }

  get mechanicalTreatmentProvider(): DropdownObject | undefined {
    if (this.object && this.object.providerContractor) {
      return {
        name: this.object.providerContractor[this.dropdownService.displayedMechanicalTreatmentProviderField],
        object: this.object.providerContractor,
      };
    } else {
      return undefined;
    }
  }

  // Lat Long
  get lat(): string {
    if (this.object && this.object.latitude) {
      return String(this.object.latitude);
    } else {
      return ``;
    }
  }

  get long(): string {
    if (this.object && this.object.longitude) {
      return String(this.object.longitude);
    } else {
      return ``;
    }
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

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  ///// Mechanical Treatment object
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
  constructor(private converterService: ConverterService, private validation: ValidationService, private dropdownService: DropdownService) { }

  ngOnInit() {
    this.dropdownService.getMechanicalTreatmentProviders().then((result) => {
      this.mechanicalTreatmentProviders = result;
    });
  }

  ngAfterViewChecked(): void {
  }

  private notifyChangeEvent() {
    if (this.object && !this.isViewMode) {
      this.basicInfoChanged.emit(this.object);
    }
  }

  autofill() {
    this.setUTMFromObservationLatLong();
  }

  setUTMFromObservationLatLong() {
    if (!this.object || !this.validation.isValidLatitude(String(this.object.latitude)) || !this.validation.isValidLongitude(String(this.object.longitude))) {
      return;
    }

    const converted = this.converterService.convertLatLongCoordinateToUTM(this.object.latitude, this.object.longitude);
    this.zoneChanged(String(converted.zone));
    this.northingsChanged(String(converted.x.toFixed(0)));
    this.eastingChanged(String(converted.y.toFixed(0)));

    this.setMapToObservationLocation();
  }

  applicatorLastNameChanged(value: string) {
    if (this.object) {
      this.object.applicatorLastName = value;
    }
    this.notifyChangeEvent();
  }

  applicatorFirstNameChanged(value: string) {
    if (this.object) {
      this.object.applicatorFirstName = value;
    }
    this.notifyChangeEvent();
  }

  mechanicalTreatmentProviderChanged(value: DropdownObject) {
    if (this.object) {
      this.object.providerContractor = value.object;
    }
    this.notifyChangeEvent();
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
    if (this.object) {
      if (this.validation.isValidLatitude(value)) {
        this.object.latitude = +value;
      } else {
        this.object.latitude = undefined;
      }
    }
    this.latLongChanged();
  }

  /**
   * Validate and show on map
   * @param value longitude
   */
  longChanged(value: string) {
    if (this.object) {
      if (this.validation.isValidLongitude(value)) {
        this.object.longitude = +value;
      } else {
        this.object.longitude = undefined;
      }
    }
    this.latLongChanged();
  }

  eastingChanged(value: string) {
    this.eastings = value;
    this.utmValuesChanged();
    this.notifyChangeEvent();
  }

  northingsChanged(value: string) {
    this.northings = value;
    this.utmValuesChanged();
    this.notifyChangeEvent();
  }

  zoneChanged(value: string) {
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

    this.setUTMFromObservationLatLong();
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
    if (!this.validation.isValidLatitude(String(converted.latitude)) || !this.validation.isValidLongitude(String(converted.longitude))) {
      console.dir(converted);
      return;
    }

    // 4) Store lat / long
    this.object.latitude = parseFloat(converted.latitude.toFixed(6));
    this.object.longitude = parseFloat(converted.longitude.toFixed(6));

    // 5) Set Map
    this.setMapToObservationLocation();
  }

  /**
   * Show map and add pin at the current observation lat/long
   */
  private setMapToObservationLocation() {
    this.setMapTo(this.object.latitude, this.object.longitude);
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

}
