import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waypoint-text-entry',
  templateUrl: './waypoint-text-entry.component.html',
  styleUrls: ['./waypoint-text-entry.component.css']
})
export class WaypointTextEntryComponent implements OnInit {

   lat;
   long; 

  constructor() { }

  ngOnInit() {
  }

  latitudeChanged() {

  }

  longitudeChanged() {

  }

}
