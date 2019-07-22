import { Component, OnInit, Input, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { MapPreviewPoint, LatLong } from '../../map-preview/map-preview.component';
import { ConverterService } from 'src/app/services/converter.service';
import { ValidationService } from 'src/app/services/validation.service';
import { FormMode, Observation, Organization } from 'src/app/models';
import { DropdownObject, DropdownService } from 'src/app/services/dropdown.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-plant-observation-basic-information',
  templateUrl: './add-plant-observation-basic-information.component.html',
  styleUrls: ['./add-plant-observation-basic-information.component.css']
})
export class AddPlantObservationBasicInformationComponent implements OnInit, AfterViewChecked {
  locationEntryModeLatLong = true;

  // Map helpers
  private mapCenter: MapPreviewPoint;
  private markers: LatLong[] = [];

  organizations: Organization[] = [];

  get observerFirstName(): string {
    if (this.observationObject) {
      return this.observationObject.observerFirstName;
    }
    return ``;
  }

  get observerLastName(): string {
    if (this.observationObject) {
      return this.observationObject.observerLastName;
    }
    return ``;
  }

  get organization(): DropdownObject | undefined  {
    if (this.observationObject && this.observationObject.observerOrganization) {
      return {
        name: this.observationObject.observerOrganization[this.dropdownService.displayedOrganizationField],
        object: this.observationObject.observerOrganization,
      };
    }
    return undefined;
  }

  get observationDate(): string | undefined {
    if (this.observationObject) {
      // console.log(this.observationObject.date);
      return this.observationObject.date;
    }
    return undefined;
  }

  // * UTM
  eastings: string;
  northings: string;
  zone: string;
  minUTMDecimals = 2;

  // * Lat Long
  get lat(): string {
    if (this.observationObject && this.observationObject.lat) {
      return String(this.observationObject.lat);
    } else {
      return ``;
    }
  }

  get long(): string {
    if (this.observationObject && this.observationObject.long) {
      return String(this.observationObject.long);
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
   // Get
   get mode(): FormMode {
     return this._mode;
   }
   // Set
   @Input() set mode(mode: FormMode) {
     this._mode = mode;
   }
   ////////////////////

  ///// Invasive plant objects
  private _object: Observation;
  // Get
  get observationObject(): Observation {
    return this._object;
  }
  // Set
  @Input() set observationObject(object: Observation) {
    this._object = object;
    this.autofill();

  }
  ////////////////////

  @Output() basicInfoChanged = new EventEmitter<Observation>();
  constructor(private converterService: ConverterService, private validation: ValidationService, private dropdownService: DropdownService) { }

  ngOnInit() {
    this.mapCenter = {
      latitude: 52.068508,
      longitude: -123.288152,
      zoom: 4
    };

    this.dropdownService.getOrganizations().then((result) => {
      this.organizations = result;
    });
  }

  ngAfterViewChecked(): void {
  }

  private notifyChangeEvent() {
    if (this.observationObject && !this.isViewMode) {
      this.basicInfoChanged.emit(this.observationObject);
    }
  }

  autofill() {
    this.setUTMFromObservationLatLong();
  }

  setUTMFromObservationLatLong() {
    if (!this.observationObject || !this.validation.isValidLatitude(String(this.observationObject.lat)) || !this.validation.isValidLongitude(String(this.observationObject.long))) {
      return;
    }

    const converted = this.converterService.toUTM(this.observationObject.lat, this.observationObject.long);
    this.zoneChanged(converted.zoneNum);
    this.northingsChanged(String(converted.northing.toFixed(0)));
    this.eastingChanged(String(converted.easting.toFixed(0)));

    this.setMapToObservationLocation();
  }

  observerLastNameChanged(value: string) {
    if (this.observationObject) {
      this.observationObject.observerLastName = value;
    }
    this.notifyChangeEvent();
  }

  observerFirstNameChanged(value: string) {
    if (this.observationObject) {
      this.observationObject.observerFirstName = value;
    }
    this.notifyChangeEvent();
  }

  organizationChanged(value: DropdownObject) {
    if (this.observationObject) {
      this.observationObject.observerOrganization = value.object;
    }
    this.notifyChangeEvent();
  }

  observationDateChanged(value: any) {
    if (this.observationObject && value) {
      this.observationObject.date = value;
    }
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
    if (this.observationObject && this.validation.isValidLatitude(value)) {
      this.observationObject.lat = +value;
    }
    this.latLongChanged();
  }

  /**
   * Validate and show on map
   * @param value longitude
   */
  longChanged(value: string) {
    if (this.observationObject && this.validation.isValidLongitude(value)) {
      this.observationObject.long = +value;
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
    if (!this.locationEntryModeLatLong || !this.observationObject) {
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
    if (this.locationEntryModeLatLong || !this.observationObject) {
      return;
    }

    // 1) Check if fields are valid
    if (!this.utmCoordinatesAreValid()) {
      return;
    }

    // 2) Convert to lat long
    const converted = this.converterService.toLatLon(this.eastings, this.northings, this.zone, null, true, false);

    // 3) Check if converted lat long are valid
    if (!this.validation.isValidLatitude(String(converted.latitude)) || !this.validation.isValidLongitude(String(converted.longitude))) {
      console.dir(converted);
      return;
    }

    // 4) Store lat / long
    this.observationObject.lat = parseFloat(converted.latitude.toFixed(6));
    this.observationObject.long = parseFloat(converted.longitude.toFixed(6));

    // 5) Set Map
    this.setMapToObservationLocation();
  }

  /**
   * Show map and add pin at the current observation lat/long
   */
  private setMapToObservationLocation() {
    this.setMapTo(this.observationObject.lat, this.observationObject.long);
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

  /**
   * Listener for event emitted from
   * Map Preview Component
   * @param event MapPreviewPoint
   */
  private mapCenterChanged(event: MapPreviewPoint) {

  }
}
