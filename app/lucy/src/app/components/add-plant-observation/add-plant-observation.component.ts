import { Component, OnInit, Input, AfterViewChecked, NgZone } from '@angular/core';
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

export class AddPlantObservationComponent implements OnInit, AfterViewChecked {
  

    ///// Form Mode
    private _mode: FormMode = FormMode.View;
    // Get
    get mode(): FormMode {
      return this._mode;
    }
    // Set
    @Input() set mode(mode: FormMode) {
      console.log(`Form mode is ${mode}`);
      this._mode = mode;
    }
    ////////////////////

  constructor(private zone: NgZone ) { }

  ngOnInit() {
    // this.mode = FormMode.Edit;
    setTimeout(() => {
      this.zone.run(() => {
        this.mode = FormMode.Edit;
      });
    }, 1000);
  }

  ngAfterViewChecked(): void {
    // this.mode = FormMode.Edit;

  }

}