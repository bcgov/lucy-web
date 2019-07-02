import { Component, OnInit } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
// import { Observation} from '../../models';
import 'node_modules/leaflet/';
declare let L;

@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css']
})

export class AddPlantObservationComponent implements OnInit {

  /***** Location *****/
  isLatLongMode: Boolean = false;
  // * UTM
  eastings?: String;
  northings?: String;
  zone?: String;

  // * Lat Long
  lat?: String;
  long?: String;

  // * Validations
  validLat: Boolean = true;
  validLong: Boolean= true;
  validEastings: Boolean = true;
  validNorthings: Boolean = true;
  validZone: Boolean = true;

  map?
  /******************/

  /* Survey */
  surveyDate?: Date;
  surveyAgency?: String;
  surveyors?: String;

  constructor(private converterService: ConverterService) { }

  ngOnInit() {
    // this.initMapAt(52.068508, -123.288152, 4);
  }

  initMapAt(lat, long, zoom) {
    this.map = L.map('map').setView([lat, long], zoom);
   
    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      // }).addTo(this.map);
  }

  initWithOpenStreet() {

  }

  initMapWithGoodleSatellite() {
    
  }

  showMapAt(lat, long, zoom) {
    if (lat == undefined || long == undefined) {return}
    this.map.setView(new L.LatLng(lat, long), zoom);
  }

  addMapMarkerAt(lat, long) {
    L.marker([lat, long]).addTo(this.map);
  }

  showMapAtCurrentLatLong() {
    this.showMapAt(this.lat, this.long, 15)
    this.addMapMarkerAt(this.lat, this.long)
  }

  utmValuesChanged() {
    console.log("from utm")
    this.resetLatLongFields()
    this.isLatLongMode = false
    let converted = this.converterService.toLatLon(this.eastings, this.northings, this.zone, null, true, false)

    let latitude = String(converted.latitude)
    if (latitude != "NaN" && latitude != "null") {
      this.lat = latitude
    }

    let longitude = String(converted.longitude)
    if (longitude != "NaN" && longitude != "null") {
      this.long = longitude
    }

    console.log(converted)
    this.showMapAtCurrentLatLong()

  }

  latLongValuesChanged() {
    console.log("from lat long")
    this.resetUTMFields()
    this.isLatLongMode = true

    this.validLat = this.converterService.isValidLatitude(this.lat)
    this.validLong = this.converterService.isValidLongitude(this.long)

    console.log(this.validLat);
    console.log(this.validLong);
    if (!this.validLat || !this.validLong) {
      return
    }
    
    let converted = this.converterService.fromLatLon(this.lat, this.long, undefined)

    let easting = String(converted.easting)
    if (easting != "NaN" && easting != "null") {
      this.eastings = easting
    }

    let northing = String(converted.northing)
    if (northing != "NaN" && northing != "null") {
      this.northings = northing
    }

    let zoneNum = String(converted.zoneNum)
    if (zoneNum != "NaN" && zoneNum != "null") {
      this.zone = zoneNum
    } else {
      this.zone = converted.zoneLetter
    }

    console.log(converted)
    this.showMapAtCurrentLatLong()
  }

  resetUTMFields() {
    this.eastings = ""
    this.northings = ""
    this.zone = ""

    this.validEastings = true
    this.validNorthings = true
    this.validZone = true
  }

  resetLatLongFields() {
    this.lat = ""
    this.long = ""

    this.validLat = true
    this.validLong = true
  }

  testWithLatLon() {
    this.lat = "48.430562"
    this.long = "-123.365831"
    this.latLongValuesChanged()
  }

  testWithUTM() {
    this.eastings = "472938.52"
    this.northings = "5364221.84"
    this.zone = "10"
    this.utmValuesChanged()
  }

  testWithKewloanaLatLong() {
    this.lat = "49.9055772"
    this.long = "-119.472584"
    this.latLongValuesChanged()
  }

  testWithKewloanaUTM() {
    this.eastings = "322462.246733"
    this.northings = "5531063.683699"
    this.zone = "11"
    this.utmValuesChanged()
  }
}