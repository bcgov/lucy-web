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
import { ConverterService, LatLongCoordinate } from 'src/app/services/coordinateConversion/location.service';
import { ValidationService } from 'src/app/services/validation.service';
import { DropdownService } from 'src/app/services/dropdown.service';
import { FormConfigField, FormService } from 'src/app/services/form/form.service';
import { GeometryJSON, InputGeometryJSON } from 'src/lib';
import { BcgwService } from 'src/app/services/bcgw/bcgw.service';

interface SpaceGeomData {
  geometry: any;
  hexId?: string;
  subHexId?: string;
  inputGeometry?: any;
  latitude: number;
  longitude: number;
  metaData?: string;
  space_geom_id?: number;
}

const AreaFieldTitle = {
  WIDTH: 'Width',
  LENGTH: 'Length',
  RADIUS: 'Radius',
  UNKNOWN: 'Unknown',
};

type AreaFunction = (w: number, h?: number) => number;
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

  titles: any = {
    geometrySection: `Geometry and Area`
  };

  // Markers shown on map
  markers: MapMarker[] = [];

  // Empty existing value
  private _existingValue: SpaceGeomData = { geometry: 1, latitude: 0, longitude: 0};

  private areaCalculator: AreaFunction;

  // Entry mode flag
  locationEntryModeLatLong = true;
  // UTM
  eastings: string;
  northings: string;
  zone: string;
  minUTMDecimals = 2;

  showModal = false;

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  get mode(): FormMode {
    return this._mode;
  }

  @Output() locationChanged = new EventEmitter<any>();

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
    if (object.spaceGeom && object.spaceGeom.value) {
      this.fieldObject.geometry.value = {
        name: object.spaceGeom.value.geometry.description,
        value: object.spaceGeom.value.geometry
      };
      this._existingValue = this.processInputValues(object.spaceGeom.value);
      this.object.spaceGeom.value = this._existingValue;
    }
    if (this.object && this.object.latitude && this.object.latitude.value) {
      this.lat = `${this.object.latitude.value}`;
      latExists = true;
    }
    if (this.object && this.object.longitude && this.object.longitude.value) {
      this.long = `${this.object.longitude.value}`;
      longExists = true;
    }
    if (this.object && this.object.isSpaceGeom && this.object.spaceGeom.value) {
      this.lat = this.object.spaceGeom.value.latitude;
      this.long = this.object.spaceGeom.value.longitude;
      latExists = true;
      longExists = true;
      this.processInputJSON(this.object.spaceGeom.value);
    }
    if (latExists && longExists) {
      this.autofill();
    }
  }
  ////////////////////

  get fieldObject(): any {
    if (this.object === undefined) {
      return this.formService.getEmptyConfigField();
    }
    if (this.object !== undefined && this.object.isSpaceGeom) {
      return this.object.spaceGeom.embeddedFields;
    } else {
      return this.object;
    }
  }

  get latitudeField(): FormConfigField {
    if (this.object !== undefined && this.object.isSpaceGeom &&  this.object.spaceGeom.embeddedFields) {
      const spaceGeom: FormConfigField = this.object.spaceGeom;
      return spaceGeom.embeddedFields.latitude;
    }
    if (this.object && this.fieldObject && this.fieldObject.latitude) {
      return this.fieldObject.latitude;
    } else {
      return this.formService.getEmptyConfigField();
    }
  }

  get geometry(): FormConfigField {
    if (this.fieldObject === undefined) {
      return this.formService.getEmptyConfigField();
    }
    const geo = this.fieldObject.geometry || this.formService.getEmptyConfigField();
    return geo;
  }

  get longitudeField(): FormConfigField {
    if (this.object !== undefined && this.object.isSpaceGeom &&  this.object.spaceGeom.embeddedFields) {
      const spaceGeom: FormConfigField = this.object.spaceGeom;
      return spaceGeom.embeddedFields.longitude;
    }
    if (this.object && this.fieldObject && this.fieldObject.longitude) {
      return this.fieldObject.longitude;
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

  dimensionVerification = {
    positiveNumber: true
  };

  // Area Field Info
  headerXDimension = AreaFieldTitle.WIDTH;
  headerYDimension = AreaFieldTitle.LENGTH;
  x = '';
  y = '';
  _showXOnly = false;
  areaLabel = AreaFieldTitle.UNKNOWN;

  get showXOnly(): boolean {
    return this._showXOnly;
  }
  set showXOnly(val: boolean) {
    this._showXOnly = val;
    this.areaCalculator = val === true ? this.calculatePoint : this.calculatePlot;
    this.headerXDimension = val === true ? AreaFieldTitle.RADIUS : AreaFieldTitle.WIDTH;
  }

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

  private _wellDistance = -1;
  get wellDistance(): number {
    return this._wellDistance;
  }
  set wellDistance(value: number) {
    this._wellDistance = value;
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
  constructor(
    private converterService: ConverterService,
    private validation: ValidationService,
    private formService: FormService,
    private BCGWService: BcgwService
    ) { }

  private processInputValues(input: SpaceGeomData) {
    let geometry = input.geometry;
    if (typeof geometry === typeof {}) {
      geometry = geometry['observation_geometry_code_id'] || 1;
    }
    return {
      latitude: input.latitude,
      longitude: input.longitude,
      space_geom_id: input.space_geom_id,
      metaData: input.metaData,
      inputGeometry: input.inputGeometry,
      geometry: geometry
    };
  }

  private processInputJSON(input: SpaceGeomData) {
    if (input.inputGeometry) {
      const json: InputGeometryJSON = input.inputGeometry || { attributes: { area: {}}, geoJSON: {}};
      // Read attribute
      const x = json.attributes.area.radius || json.attributes.area.width;
      const y = json.attributes.area.length;
      // Setting bind props
      this.x = x ? `${x}` : '';
      this.y = y ? `${y}` : '';
      this.showXOnly = json.attributes.area.radius ? true : false;
      this.setAreaLabel(x, y);
    }
  }

  private calculatePlot(w: number, h: number): number { return w * h; }
  private calculatePoint(r: number): number { return Math.PI * r * r; }

  ngOnInit() {
  }

  autofill() {
    this.setUTMFromLatLong();
  }

  setAreaLabel(x: number, y: number) {
    const a = this.areaCalculator(x, y);
    this.areaLabel = a ? `${a.toFixed(1)} square meter` : AreaFieldTitle.UNKNOWN;
  }

  private notifyChangeEvent() {
    if (this.object && !this.isViewMode) {
      if (this.object.isSpaceGeom) {
        // Calculate value
        const existing: any = this._existingValue || {};
        const value: SpaceGeomData = {
          latitude: parseFloat(this.fieldObject.latitude.value || existing.latitude),
          longitude: parseFloat(this.fieldObject.longitude.value || existing.longitude),
          geometry: existing.geometry || 1,
          inputGeometry: existing.inputGeometry || {},
          metaData: 'NONE',
          space_geom_id: existing.space_geom_id
        };
        this.object.spaceGeom.value = value;
      }
      this.locationChanged.emit(this.object);
    }
  }

  private async findNearestWell() {
    if (!this.object || !this.validation.isValidLatitude(String(this.fieldObject.latitude.value)) || !this.validation.isValidLongitude(String(this.fieldObject.longitude.value))) {
      // hide nearest well tag
      this.wellDistance = -1;
      return;
    }
    const latitude = + this.fieldObject.latitude.value;
    const longitude = + this.fieldObject.longitude.value;
    if (latitude !== undefined && longitude !== undefined) {
      const found = await this.BCGWService.findDistanceToClosestWell(latitude, longitude);
      if (found != null) {
        this.wellDistance = found;
      } else {
        // hide nearest well tag
        this.wellDistance = -1;
      }
    } else {
      // hide nearest well tag
      this.wellDistance = -1;
    }
  }

  setUTMFromLatLong() {
    if (!this.object || !this.validation.isValidLatitude(String(this.fieldObject.latitude.value)) || !this.validation.isValidLongitude(String(this.fieldObject.longitude.value))) {
      return;
    }

    const converted = this.converterService.convertLatLongCoordinateToUTM(this.fieldObject.latitude.value, this.fieldObject.longitude.value);
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
      if (this.object.isSpaceGeom) {
        this.object.spaceGeom.embeddedFields.latitude.value = value;
      } else {
        this.fieldObject.latitude.value = value;
      }
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
      if (this.object.isSpaceGeom) {
        this.object.spaceGeom.embeddedFields.longitude.value = value;
      } else {
        this.fieldObject.longitude.value = value;
      }
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
    if (!this.locationEntryModeLatLong || !this.fieldObject) {
      return;
    }

    this.findNearestWell();
    this.setUTMFromLatLong();
  }

  /**
   * Validate, convert to Lat/Long, store and show location on map
   */
  utmValuesChanged() {
    // If observation is being viewed, don't convert
    if (this.mode === FormMode.View) {
      return;
    }

    // If its in lat long entry mode, dont run this function.
    if (this.locationEntryModeLatLong || !this.fieldObject) {
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
      this.fieldObject.latitude.value = '';
      this.fieldObject.longitude.value = '';
      this.lat = ``;
      this.long = ``;
      return;
    }

    // 4) Store lat / long
    this.fieldObject.latitude.value = parseFloat(converted.latitude.toFixed(6));
    this.fieldObject.longitude.value = parseFloat(converted.longitude.toFixed(6));
    this.lat = `${this.fieldObject.latitude.value}`;
    this.long = `${this.fieldObject.longitude.value}`;

    // 5) Set Map
    this.setMapToCurrentLocation();

    this.findNearestWell();
  }

  /**
   * @description Handling geometry change dropdown
   * @param field FormConfigField
   * @param event any
   */
  geometryChanged(event: any) {
    const existingObj = this.fieldObject.geometry.value || {} ;
    const existing = existingObj.value || {};
    const existingId = existing['observation_geometry_code_id'];
    const eventData = event.object || event.value;
    const changedId = eventData['observation_geometry_code_id'];
    if (existingId !== changedId) {
      this.fieldObject.geometry.value = event;
      let geomID = 1;
      if (this._existingValue && event.object) {
        geomID =  changedId;
        this._existingValue.geometry = geomID;
      }
      if (geomID === 1) {
        this.showXOnly = true;
        this.y = '';
      } else {
        this.showXOnly = false;
      }
      this.setGeometryData();
    }
  }

  /**
   * @description Handling X dimensionChange event
   * @param value any
   */
  dimensionXChange(value: any) {
    this.x = value;
    this.setGeometryData();
  }

  /**
   * @description Handling Y dimensionChange event
   * @param value any
   */
  dimensionYChange(value: any) {
    this.y = value;
    this.setGeometryData();
  }

  private setGeometryData() {
    const x = parseFloat(this.x) || 0.0;
    const y =  parseFloat(this.y) || undefined;
    const json = GeometryJSON.createGeometryJSON(
      this._existingValue.geometry,
      x,
      y
      );
    this._existingValue.inputGeometry = json;

    // Calculate Area
    this.setAreaLabel(x, y);
    this.notifyChangeEvent();
  }

  /**
   * Show map and add pin at the current observation lat/long
   */
  private setMapToCurrentLocation() {
    if (!this.fieldObject.latitude.value || !this.fieldObject.longitude.value) {
      console.log(`invalid location`);
      return;
    }
    this.setMapTo(this.fieldObject.latitude.value, this.fieldObject.longitude.value);
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
   * Draw waypoint on map, center map view on waypoint
   * @param points an array of LatLongCoordinates, arranged in the order they should be drawn on the map
   */
  drawWaypointOnMap(points: [LatLongCoordinate]) {
    this.markers = [];
    for (const pt of points) {
      this.markers.push(pt);
    }
    const centerPoint = points[Math.floor(points.length / 2)];
    this.mapCenter = {
      latitude: centerPoint.latitude,
      longitude: centerPoint.longitude,
      zoom: 18
    };
  }

  mapCenterChanged(event: any) {
  }

}
