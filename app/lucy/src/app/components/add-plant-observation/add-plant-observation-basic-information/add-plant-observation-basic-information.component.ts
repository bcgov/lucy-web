import { Component, OnInit } from '@angular/core';
import { MapPreviewPoint, LatLong } from '../../map-preview/map-preview.component';
import { ConverterService } from 'src/app/services/converter.service';
import { ValidationService } from 'src/app/services/validation.service';

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

  constructor(private converterService: ConverterService, private validation: ValidationService) { }

  ngOnInit() {
    this.mapCenter = {
      latitude: 52.068508,
      longitude: -123.288152,
      zoom: 4
    };
  }

  private utmCoordinatesAreValid(): boolean {
    console.log(this.validNorthings );
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

}
