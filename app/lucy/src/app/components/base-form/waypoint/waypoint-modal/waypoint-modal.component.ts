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
  waypointEntryComponents = [];
  waypoints: [LatLongCoordinate?] = [];
  offset: number;
  maxPointsLengthReached = false;
  waypointValid: boolean;
  offsetValid: boolean;

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
    if (this.waypointEntryComponents.length > this.MAX_NUM_POINTS) {
      console.log('Error: cannot enter more than 10 coordinates');
    } else if (this.waypointEntryComponents.length < this.MIN_NUM_POINTS) {
      console.log('Error: cannot enter less than 2 coordinates');
    } else if (!this.validDistanceBetweenPoints) {
      console.log(`Invalid distance between points`);
    } else {
      this.waypointsEventHandler.emit({points: this.waypoints, offset: this.offset});
    }
  }

  get validDistanceBetweenPoints() {
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const distance = haversine(this.waypoints[i], this.waypoints[i + 1]);
      if ( distance < this.MIN_DISTANCE_BTWN_POINTS || distance > this.MAX_DISTANCE_BTWN_POINTS ) {
        console.log(`Invalid distance between points ` + i + ` and ` + (i + 1));
        return false;
      }
    }
    return true;
  }
}