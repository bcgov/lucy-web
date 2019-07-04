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

  items: string[] = [`one`, `two`];

  constructor() { }

  ngOnInit() {
  }

  dropdownSelectionChanged(event) {
    console.log(event)
  }
}