import { Component, OnInit, Input } from '@angular/core';
import { MapPreviewPoint, LatLong } from '../../map-preview/map-preview.component';
import { ConverterService } from 'src/app/services/converter.service';
import { ValidationService } from 'src/app/services/validation.service';
import { FormMode } from 'src/app/models';

@Component({
  selector: 'app-add-plant-observation-basic-information',
  templateUrl: './add-plant-observation-basic-information.component.html',
  styleUrls: ['./add-plant-observation-basic-information.component.css']
})
export class AddPlantObservationBasicInformationComponent implements OnInit {

  private mapCenter: MapPreviewPoint;
  private markers: LatLong[] = [];

  // * UTM
  eastings: string;
  northings: string;
  zone: string;
  minUTMDecimals = 2;

  // * Lat Long
  lat: string;
  long: string;

  // * Validations
  validLat: Boolean = true;
  validLong: Boolean = true;

  get validEastings(): boolean {
    return this.validation.isValidNumber(this.eastings)
      && this.validation.hasMinDecimalPlaces(this.eastings, this.minUTMDecimals);
  }

  get validNorthings(): boolean {
    return this.validation.isValidNumber(this.northings)
      && this.validation.hasMinDecimalPlaces(this.northings, this.minUTMDecimals);
  }

  get validZone(): boolean {
    return this.validation.isValidNumber(this.zone);
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

  constructor(private converterService: ConverterService, private validation: ValidationService) { }

  ngOnInit() {
    this.mapCenter = {
      latitude: 52.068508,
      longitude: -123.288152,
      zoom: 4
    };
  }

  private utmCoordinatesAreValid(): boolean {
    console.log(this.validNorthings);
    console.log(this.validEastings);
    console.log(this.validZone);
    return (this.validNorthings && this.validEastings && this.validZone);
  }

  utmValuesChanged() {
    console.log(`from utm`);

    // 1) Check if fields are valid
    if (!this.utmCoordinatesAreValid()) {
      return;
    }
    // 2) Convert to lat long
    const converted = this.converterService.toLatLon(this.eastings, this.northings, this.zone, null, true, false);
    console.dir(converted);

    // 3) Check if converted lat long are valid
    if (!this.validation.isValidLatitude(String(converted.latitude)) || !this.validation.isValidLongitude(String(converted.longitude))) {
      console.log(`Invalid lat long`);
      console.dir(converted);
      return;
    }

    // 4) Change map center
    this.mapCenter = {
      latitude: converted.latitude,
      longitude: converted.longitude,
      zoom: 15
    };

    // 5) Add pin
    this.markers = [];
    this.markers.push({
      latitude: converted.latitude,
      longitude: converted.longitude
    });
  }

  /**
   * Listener for event emitted from
   * Map Preview Component
   * @param event MapPreviewPoint
   */
  private mapCenterChanged(event: MapPreviewPoint) {

  }

  // testWithLatLon() {
  //   this.lat = "48.430562"
  //   this.long = "-123.365831"
  //   this.latLongValuesChanged()
  // }

  // testWithUTM() {
  //   this.eastings = "472938.52"
  //   this.northings = "5364221.84"
  //   this.zone = "10"
  //   this.utmValuesChanged()
  // }

  // testWithKewloanaLatLong() {
  //   this.lat = "49.9055772"
  //   this.long = "-119.472584"
  //   this.latLongValuesChanged()
  // }

  // testWithKewloanaUTM() {
  //   this.eastings = "322462.246733"
  //   this.northings = "5531063.683699"
  //   this.zone = "11"
  //   this.utmValuesChanged()
  // }

}
