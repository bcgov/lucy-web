import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-waypoint-info',
  templateUrl: './waypoint-info.component.html',
  styleUrls: ['./waypoint-info.component.css']
})
export class WaypointInfoComponent implements OnInit {

  @Output() onBackAction = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onBack() {
    this.onBackAction.emit(true);
  }

}
