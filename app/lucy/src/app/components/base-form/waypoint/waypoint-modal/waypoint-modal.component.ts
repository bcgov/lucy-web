import { Component, OnInit } from '@angular/core';
import { WaypointTextEntryComponent } from '../waypoint-text-entry/waypoint-text-entry.component';

@Component({
  selector: 'app-waypoint-modal',
  templateUrl: './waypoint-modal.component.html',
  styleUrls: ['./waypoint-modal.component.css']
})
export class WaypointModalComponent implements OnInit {

  MIN_NUM_POINTS = 2;
  MAX_NUM_POINTS = 10;

  showInfo = false;
  pointsEntered = [];
  offset: number;
  maxPointsLengthReached = false;

  offsetVerification = {
    positive: true,
    max: 20,
    required: true,
  };

  constructor() { }

  ngOnInit() {
    // minimum 2 points are required for waypoint, so adding 2 empty text entry fields by default
    this.pointsEntered.push(new WaypointTextEntryComponent());
    this.pointsEntered.push(new WaypointTextEntryComponent());
    this.maxPointsLengthReached = this.pointsEntered.length === this.MAX_NUM_POINTS ? true : false;
  }

  toggleView() {
    this.showInfo = !this.showInfo;
  }

  offsetChanged(value: number) {
    this.offset = value;
  }

  addNewWaypointTextEntry() {
    this.pointsEntered.push(new WaypointTextEntryComponent());
    this.maxPointsLengthReached = this.pointsEntered.length === this.MAX_NUM_POINTS ? true : false;
  }

  removeWaypoint(index: number) {
    this.pointsEntered.splice(index, 1);
    this.maxPointsLengthReached = this.pointsEntered.length === this.MAX_NUM_POINTS ? true : false;
  }

  generatePath() {
    if (this.pointsEntered.length > this.MAX_NUM_POINTS) {
      console.log('Error: cannot enter more than 10 coordinates');
    } else if (this.pointsEntered.length < this.MIN_NUM_POINTS) {
      console.log('Error: cannot enter less than 2 coordinates');
    } else {
      console.log(`Offset width: ` + this.offset);
      console.log(this.pointsEntered);
    }
  }
}
