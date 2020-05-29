import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WaypointTextEntryComponent } from '../waypoint-text-entry/waypoint-text-entry.component';
import { MapPreviewPoint } from 'src/app/components/Utilities/map-preview/map-preview.component';
import { ValidationService } from 'src/app/services/validation.service';
import { ConverterService, LatLongCoordinate, AlbersCoordinate } from 'src/app/services/coordinateConversion/location.service';
const haversine = require('haversine-distance');

@Component({
  selector: 'app-waypoint-modal',
  templateUrl: './waypoint-modal.component.html',
  styleUrls: ['./waypoint-modal.component.css']
})
export class WaypointModalComponent implements OnInit {
  // Set the initial view location for map
  public mapCenter: MapPreviewPoint = {
    latitude: 52.068508,
    longitude: -123.288152,
    zoom: 4
  };

  MIN_NUM_POINTS = 2;
  MAX_NUM_POINTS = 20;
  MIN_DISTANCE_BTWN_POINTS = 1;   // in metres
  MAX_DISTANCE_BTWN_POINTS = 200;  // in metres

  showInfo = false;
  showMap = false;
  showLatLong = true;
  waypointEntryComponents = [];
  offset: number;
  points: LatLongCoordinate[] = [];
  polygon: LatLongCoordinate[] = [];
  polygonInAlbers: AlbersCoordinate[] = [];
  maxPointsLengthReached = false;
  waypointValid: boolean;
  offsetValid: boolean;
  errors: string[] = [];
  /**
   * flag is used to indicate whether the waypoint displayed in map-preview matches
   * the values input by the user in the modal text fields
   * 
   * if inputDirtyFlag == true, primary button in modal will be "Generate Path"
   * if inputDirtyFlag == false, primary button in modal will be "Done"
   */
  inputDirtyFlag = true;

  offsetVerification = {
    positive: true,
    max: 20,
    required: true,
  };

  private _geoJSON: any;
  get geoJSON(): any {
    return this._geoJSON;
  }
  @Input() set geoJSON(json: any) {
    this._geoJSON = json;
    if (this._geoJSON && this._geoJSON.features !== undefined && this.points.length === 0) {
      this.addPointsFromGeoJSON();
      this.createWaypointTextEntriesForPoints();
    }
    this.geoJSONEmitter.emit(this._geoJSON);
  }

  @Output() geoJSONEmitter = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  showAddIcon(index: number) {
    const totalWaypoints = this.waypointEntryComponents.length - 1;
    return totalWaypoints === index;
  }

  constructor(
    private validation: ValidationService,
    private converter: ConverterService,
  ) {  }

  ngOnInit() {
    if (this._geoJSON && (this.geoJSON.features === undefined || this.geoJSON.features.length === 0)) {
      // minimum 2 points are required for waypoint, so adding 2 empty text entry fields by default
      this.waypointEntryComponents.push(new WaypointTextEntryComponent(this.validation, this.converter));
      this.waypointEntryComponents.push(new WaypointTextEntryComponent(this.validation, this.converter));
      this.maxPointsLengthReached = this.waypointEntryComponents.length === this.MAX_NUM_POINTS ? true : false;
    }
  }

  toggleView() {
    this.showInfo = !this.showInfo;
  }

  toggleUTM() {
    this.showLatLong = false;
  }

  toggleLAT() {
    this.showLatLong = true;
  }

  offsetChanged(value: number) {
    this.offset = value;
    this.inputDirtyFlag = true;
  }

  pointChanged(coordinate: LatLongCoordinate, index: number) {
    this.points.splice(index, 1, coordinate);
    this.inputDirtyFlag = true;
  }

  geoJSONChangeHandler(json: any) {
    this.geoJSON = json;
    this.geoJSONEmitter.emit(this.geoJSON);
  }

  /**
   * parses points from input GeoJSON and adds them to this.points
   */
  private addPointsFromGeoJSON() {
    for (const feature of this.geoJSON['features']) {
      if (feature['geometry']['type'] === 'Polygon') {
        this.offset = feature['properties']['offset'];
      } else if (feature['geometry']['type'] === 'Point') {
        this.points.push({latitude: feature['geometry']['coordinates'][1], longitude: feature['geometry']['coordinates'][0]});
      }
    }
  }

  private createWaypointTextEntriesForPoints() {
    // first remove any existing waypoint entry components
    this.waypointEntryComponents = [];
    for (const pt of this.points) {
      const wte = new WaypointTextEntryComponent(this.validation, this.converter);
      wte.point = pt;
      this.waypointEntryComponents.push(wte);
      this.maxPointsLengthReached = this.waypointEntryComponents.length === this.MAX_NUM_POINTS ? true : false;
    }
  }

  addNewWaypointTextEntry() {
    const newWaypointEntry = new WaypointTextEntryComponent(this.validation, this.converter);
    this.waypointEntryComponents.push(newWaypointEntry);
    this.maxPointsLengthReached = this.waypointEntryComponents.length === this.MAX_NUM_POINTS ? true : false;
    this.points.push(newWaypointEntry.point);
    this.inputDirtyFlag = true;
  }

  removeWaypoint(index: number) {
    this.waypointEntryComponents.splice(index, 1);
    this.points.splice(index, 1);
    this.maxPointsLengthReached = this.points.length === this.MAX_NUM_POINTS ? true : false;
    this.inputDirtyFlag = true;
  }

  waypointEntryDone() {
    this.geoJSONEmitter.emit(this.geoJSON);
    this.onClose.emit({offset: this.offset, points: this.points, polygon: this.polygon});
  }

  generatePath() {
    this.errors = [];
    if (!this.validWaypointValues(this.offset, this.points)) {
      this.errors.push('Error: please fill all the fields');
      return;
    }

    if (this.waypointEntryComponents.length > this.MAX_NUM_POINTS) {
      this.errors.push(`Error: cannot enter more than ${this.MAX_NUM_POINTS} coordinates`);
    } else if (this.waypointEntryComponents.length < this.MIN_NUM_POINTS) {
      this.errors.push(`Error: cannot enter less than ${this.MIN_NUM_POINTS} coordinates`);
    } else if (this.validDistanceBetweenPoints && this.pointsAreWithinBC) {
      this.polygon = [];
      this.polygonInAlbers = [];
      this.showMap = true;
      this.geoJSON = {};
      this.calculateWaypointBoundaryPoints();
      this.inputDirtyFlag = false;
    }
  }

  get validDistanceBetweenPoints() {
    let counter = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const distance = haversine(this.points[i], this.points[i + 1]);
      if ( distance < this.MIN_DISTANCE_BTWN_POINTS || distance > this.MAX_DISTANCE_BTWN_POINTS ) {
        this.errors.push(`Error: invalid distance (` + distance.toFixed(2) + `m) between points ` + (i + 1) + ` and ` + (i + 2));
        counter += 1;
      }
    }
    return (counter === 0);
  }

  get pointsAreWithinBC() {
    let counter = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      if (!this.converter.isInsideBC(this.points[i].latitude, this.points[i].longitude)) {
        this.errors.push(`Error: point ` + (i + 1) + ` is not within BC`);
        counter += 1;
      }
    }
    return (counter === 0);
  }

  validWaypointValues(offset: number, points: LatLongCoordinate[]) {
    if (!offset || points.length === 0) {
      return false;
    }

    const invalidPoints = points.filter(point => !point.latitude || !point.longitude);
    return (invalidPoints.length === 0);
  }

  onBack() {
    this.onClose.emit();
  }

  /********* Waypoint Math/Helper Methods **********/

  /**
   * Given an offset distance in metres and a list of lat/long coordinates representing the centre line
   * of the waypoint, calculates the lat/long coordinates to be used as the boundary of the waypoint
   * (drawn on the map as a polygon). Calculations are performed in BC Albers, so input lat/long coords
   * are first converted into Albers, calculated upon, and then converted back into lat/long for drawing
   * on map.
   * @param offset width in metres of the waypoint line
   * @param coords ordered list of lat/long coords centred along waypoint line (distance of half of offset to either
   * side of each coordinate)
   */
  private calculateWaypointBoundaryPoints() {
    const coordsInAlbers: AlbersCoordinate[] = [];

    // convert lat/long coords to Albers
    for (const c of this.points) {
      const point: AlbersCoordinate = this.converter.latLongCoordinateToAlbers(c.latitude, c.longitude);
      coordsInAlbers.push(point);
    }

    // traverse list of Albers coords, calculating left side of offset/buffer
    for (let i = 0; i < coordsInAlbers.length - 1; i++) {
      const vx = coordsInAlbers[i + 1].x - coordsInAlbers[i].x;
      const vy = coordsInAlbers[i + 1].y - coordsInAlbers[i].y;
      const dist = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
      const ux = (-1 * vy) / dist;
      const uy = vx / dist;

      let nextPoint = {
        x: coordsInAlbers[i].x + (this.offset * ux),
        y: coordsInAlbers[i].y + (this.offset * uy)
      };
      this.polygonInAlbers.push(nextPoint);

      nextPoint = {
        x: coordsInAlbers[i + 1].x + (this.offset * ux),
        y: coordsInAlbers[i + 1].y + (this.offset * uy)
      };
      this.polygonInAlbers.push(nextPoint);
    }

    // traverse list of coords in reverse, calculating other side of offset/buffer
    for (let i = coordsInAlbers.length - 1; i > 0; i--) {
      const vx = coordsInAlbers[i].x - coordsInAlbers[i - 1].x;
      const vy = coordsInAlbers[i].y - coordsInAlbers[i - 1].y;
      const dist = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
      const ux = (-1 * vy) / dist;
      const uy = vx / dist;

      let nextPoint = {
        x: coordsInAlbers[i].x - (this.offset * ux),
        y: coordsInAlbers[i].y - (this.offset * uy)
      };
      this.polygonInAlbers.push(nextPoint);

      nextPoint = {
        x: coordsInAlbers[i - 1].x - (this.offset * ux),
        y: coordsInAlbers[i - 1].y - (this.offset * uy)
      };
      this.polygonInAlbers.push(nextPoint);
    }

    // iterate through lower portion of polygonInAlbers to calculate intersection point
    for (let i = 0; i < ((this.polygonInAlbers.length / 2) - 2); i = i + 2) {
      this.oneIterationOfIntersectionCalculations(i);
    }

    // iterate through second portion of polygonInAlbers to calculate intersection points
    for (let i = (this.polygonInAlbers.length / 2); i < this.polygonInAlbers.length - 3; i = i + 2) {
      this.oneIterationOfIntersectionCalculations(i);
    }

    // check for duplicated coordinates in polygonInAlbers
    // if any duplicates found, remove them
    for (let i = 0; i < this.polygonInAlbers.length; i++) {
      const pt = this.polygonInAlbers[i];
      const indices = this.polygonInAlbers.map(p => (p.x === pt.x && p.y === pt.y));
      const index = indices.indexOf(true, i + 1);
      if (index > -1) {
        this.polygonInAlbers.splice(index, 1);
      }
    }

    // convert each coordinate in waypointBoundaryPointsAlbers from BC Albers to
    // lat/long, add to polygon
    for (const a of this.polygonInAlbers) {
      const l = this.converter.albersToLatLongCoordinate(a.x, a.y);
      this.polygon.push(l);
    }
  }

  private oneIterationOfIntersectionCalculations(i: number) {
    const x11 = this.polygonInAlbers[i].x;
    const x12 = this.polygonInAlbers[i + 1].x;
    const y11 = this.polygonInAlbers[i].y;
    const y12 = this.polygonInAlbers[i + 1].y;
    const x21 = this.polygonInAlbers[i + 2].x;
    const x22 = this.polygonInAlbers[i + 3].x;
    const y21 = this.polygonInAlbers[i + 2].y;
    const y22 = this.polygonInAlbers[i + 3].y;

    const points = {
      x11: x11,
      x12: x12,
      y11: y11,
      y12: y12,
      x21: x21,
      x22: x22,
      y21: y21,
      y22: y22
    };
    const intersection = this.findIntersection(points);

    // replace end point of first arc & start point of second arc with intersection
    this.polygonInAlbers[i + 1].x = intersection.interX;
    this.polygonInAlbers[i + 1].y = intersection.interY;
    this.polygonInAlbers[i + 2].x = intersection.interX;
    this.polygonInAlbers[i + 2].y = intersection.interY;
  }

  /**
   * Returns the x & y coordinates of the point of intersection amongst input values
   * @param values dictionary object of 4 x and 4 y values
   */
  private findIntersection(values: any) {
    const dx1 = values.x12 - values.x11;
    const dy1 = values.y12 - values.y11;
    const dx2 = values.x22 - values.x21;
    const dy2 = values.y22 - values.y21;
    const denom = dy1 * dx2 - dx1 * dy2;
    const tt1 = ((values.x11 - values.x21) * dy2 + (values.y21 - values.y11) * dx2) / denom; // cannot be zero

    // Find the point of intersection
    const interX = values.x11 + dx1 * tt1;
    const interY = values.y11 + dy1 * tt1;

    return ({interX: interX, interY: interY});
  }

  /******** End Waypoint Math/Helper Methods *******/
}
