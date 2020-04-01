import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WaypointTextEntryComponent } from '../waypoint-text-entry/waypoint-text-entry.component';
import { ValidationService } from 'src/app/services/validation.service';
import { ConverterService, LatLongCoordinate } from 'src/app/services/coordinateConversion/location.service';
const haversine = require('haversine-distance');

@Component({
  selector: 'app-waypoint-modal',
  templateUrl: './waypoint-modal.component.html',
  styleUrls: ['./waypoint-modal.component.css']
})
export class WaypointModalComponent implements OnInit {

  MIN_NUM_POINTS = 2;
  MAX_NUM_POINTS = 10;
  MIN_DISTANCE_BTWN_POINTS = 1;   // in metres
  MAX_DISTANCE_BTWN_POINTS = 20;  // in metres

  showInfo = false;
  showMap = false;
  showLatLong = true;
  waypointEntryComponents = [];
  waypoints: [LatLongCoordinate?] = [];
  offset: number;
  maxPointsLengthReached = false;
  waypointValid: boolean;
  offsetValid: boolean;
  errors: string[] = [];

  offsetVerification = {
    positive: true,
    max: 20,
    required: true,
  };

  // Base form response body
  private _responseBody: any = {};
  get responseBody(): any {
    return this._responseBody;
  }
  @Input() set responseBody(responseBody: any) {
    this._responseBody = responseBody;
  }

  @Output() offsetChangedEmitter = new EventEmitter<any>();

  @Output() waypointsEventHandler = new EventEmitter<any>();

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
    // minimum 2 points are required for waypoint, so adding 2 empty text entry fields by default
    this.waypointEntryComponents.push(new WaypointTextEntryComponent(this.validation, this.converter));
    this.waypointEntryComponents.push(new WaypointTextEntryComponent(this.validation, this.converter));
    this.maxPointsLengthReached = this.waypointEntryComponents.length === this.MAX_NUM_POINTS ? true : false;
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
    this.offsetChangedEmitter.emit(value);
  }

  pointChanged(coordinate: LatLongCoordinate, index: number) {
    this.waypoints.splice(index, 1, coordinate);
  }

  addNewWaypointTextEntry() {
    const newWaypointEntry = new WaypointTextEntryComponent(this.validation, this.converter);
    this.waypointEntryComponents.push(newWaypointEntry);
    this.maxPointsLengthReached = this.waypointEntryComponents.length === this.MAX_NUM_POINTS ? true : false;
    this.waypoints.push(newWaypointEntry.point);
  }

  removeWaypoint(index: number) {
    this.waypointEntryComponents.splice(index, 1);
    this.waypoints.splice(index, 1);
    this.maxPointsLengthReached = this.waypoints.length === this.MAX_NUM_POINTS ? true : false;
  }

  generatePath() {
    this.errors = [];
    if (!this.validWaypointValues(this.offset, this.waypoints)) {
      this.errors.push('Error: please fill all the fields');
      return;
    }
    
    if (this.waypointEntryComponents.length > this.MAX_NUM_POINTS) {
      this.errors.push('Error: cannot enter more than 10 coordinates');
    } else if (this.waypointEntryComponents.length < this.MIN_NUM_POINTS) {
      this.errors.push('Error: cannot enter less than 2 coordinates');
    } else if (this.validDistanceBetweenPoints && this.pointsAreWithinBC) {
      this.waypointsEventHandler.emit({ offset: this.offset, points: this.waypoints });
      this.showMap = true;
    }
  }

  get validDistanceBetweenPoints() {
    let counter = 0;
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const distance = haversine(this.waypoints[i], this.waypoints[i + 1]);
      if ( distance < this.MIN_DISTANCE_BTWN_POINTS || distance > this.MAX_DISTANCE_BTWN_POINTS ) {
        this.errors.push(`Error: invalid distance (` + distance.toFixed(2) + `m) between points ` + (i + 1) + ` and ` + (i + 2));
        counter += 1;
      }
    }
    return (counter === 0);
  }

  get pointsAreWithinBC() {
    let counter = 0;
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      if (!this.converter.isInsideBC(this.waypoints[i].latitude, this.waypoints[i].longitude)) {
        this.errors.push(`Error: point ` + (i + 1) + ` is not within BC`);
        counter += 1;
      }
    }
    return (counter === 0);
  }

  validWaypointValues(offset: number, points: LatLongCoordinate[]) {
    if (!offset || points.length === 0) return false;

    const invalidPoints = points.filter(point => !point.latitude || !point.longitude);
    return (invalidPoints.length === 0)
  }

  onBack() {
    this.onClose.emit();
  }

  submitTestData() {
    // valid data
    this.offset = 3;
    this.waypoints.push({latitude: 48.430961, longitude: -123.354064});
    this.waypoints.push({latitude: 48.430997, longitude: -123.354144});
    this.waypoints.push({latitude: 48.431013, longitude: -123.354051});
    this.waypoints.push({latitude: 48.431088, longitude: -123.354008});
    this.waypoints.push({latitude: 48.431072, longitude: -123.353949});
    this.waypoints.push({latitude: 48.431154, longitude: -123.353922});
    this.waypoints.push({latitude: 48.431197, longitude: -123.353981});
    this.waypoints.push({latitude: 48.431227, longitude: -123.354094});
    this.waypoints.push({latitude: 48.431248, longitude: -123.354148});
    this.waypoints.push({latitude: 48.431329, longitude: -123.354118});
    this.generatePath();

    // // invalid data
    // this.offset = 33;  // too large
    // this.waypoints.push({latitude: 48.430961, longitude: -123.354064});
    // this.waypoints.push({latitude: 48.431197, longitude: -123.353981});
    // this.waypoints.push({latitude: 48.431197, longitude: -123.353980}); // too close to previous
    // this.waypoints.push({latitude: 50.530961, longitude: -124.354008}); // too far away
    // this.waypoints.push({latitude: 48.541516, longitude: -123.121760}); // in Washington state
    // this.generatePath();
  }
}
