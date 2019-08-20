import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import { MapMarker, MapPreviewPoint } from '../../map-preview/map-preview.component';

@Component({
  selector: 'app-add-mechanical-treatment-basic-info',
  templateUrl: './add-mechanical-treatment-basic-info.component.html',
  styleUrls: ['./add-mechanical-treatment-basic-info.component.css']
})
export class AddMechanicalTreatmentBasicInfoComponent implements OnInit {
  locationEntryModeLatLong = true;

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

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  ///// Invasive plant objects
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
  constructor() { }

  ngOnInit() {
  }

  autofill() {

  }

}
