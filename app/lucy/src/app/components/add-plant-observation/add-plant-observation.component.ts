import { Component, OnInit, Input, AfterViewChecked, NgZone } from '@angular/core';
import { ConverterService } from 'src/app/services/converter.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';


import 'node_modules/leaflet/';
import { FormMode } from 'src/app/models';
declare let L;

@Component({
  selector: 'app-add-plant-observation',
  templateUrl: './add-plant-observation.component.html',
  styleUrls: ['./add-plant-observation.component.css']
})


@NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]})
export class AddPlantObservationComponent implements OnInit, AfterViewChecked {

  private _visibleClasses = [];
  get visibleClasses(): string[] {
    return this._visibleClasses;
  }
  set visibleClasses(classNames: string[]) {
    this._visibleClasses = classNames;
  }
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

  constructor(private zone: NgZone) { }

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

  public onIntersection({ target, visible }: { target: Element; visible: boolean }): void {
    const visibleClasses = [];
    this.visibleClasses.push(target.className);
    this.visibleClasses.forEach(element => {
      if (element !== target.className) {
        visibleClasses.push(element);
      } else if (element === target.className && visible) {
        visibleClasses.push(element);
      }
    });
    this.visibleClasses = visibleClasses;
  }
}
