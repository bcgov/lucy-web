import { Component, OnInit, Input } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
// import { Observation} from '../../models';
import 'node_modules/leaflet/';
import { FormMode } from 'src/app/models';
declare let L;

@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css']
})

export class AddPlantObservationComponent implements OnInit {

    ///// Form Mode
    private _mode: FormMode = FormMode.View;
    // Get
    get mode(): FormMode {
      return this._mode;
    }
    // Set
    @Input() set mode(mode: FormMode) {
      this._mode = mode;
    }
    ////////////////////

  constructor() { }

  ngOnInit() {
  }

}