import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { InvasivePlantSpecies, ObservationInvasivePlantSpecies } from 'src/app/models/observation';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species',
  templateUrl: './add-plant-observation-invasive-plant-species.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesComponent implements OnInit {

  get buttonTitle(): string {
    if (this.objects.length < 1) {
      return `+ Add a species to location`;
    } else {
      return `+ Add another species to location`;
    }
  }

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

  ///// Invasive plant objects
  private _objects: ObservationInvasivePlantSpecies[] = [];
  // Get
  get objects(): ObservationInvasivePlantSpecies[] {
    return this._objects;
  }
  // Set
  @Input() set objects(objects: ObservationInvasivePlantSpecies[]) {
    this._objects = objects;
  }
  ////////////////////

  @Output() invasivePlantSpeciesChanged = new EventEmitter<ObservationInvasivePlantSpecies[]>();
  constructor() { }

  ngOnInit() {
  }

  addSpecies() {
    this.objects.push({
      observationSpecies_Id: this.getUniqueId(),
      species: undefined,
      jurisdiction: undefined,
      width: 0,
      length: 0,
      accessDescription: undefined,
    });
  }

  private getUniqueId(): number {
    if (this.objects.length < 1) {
      return 0;
    }
    const usedIds: number[] = [];
    for (const object of this.objects) {
      usedIds.push(object.observationSpecies_Id);
    }

    const sortedUsedIds = usedIds.sort((n1, n2) => n1 - n2);
    return sortedUsedIds.pop() + 1;
  }

  speciesCellInfoChanged(event: ObservationInvasivePlantSpecies) {
    console.log(`change received`);
    for (const i in this.objects) {
      if (this.objects[i].observationSpecies_Id === event.observationSpecies_Id) {
        this.objects[i] = event;
        console.log(`change saved`);
        this.notifyChangeEvent();
      }
    }
  }

  private notifyChangeEvent() {
    if (this.objects) {
      this.invasivePlantSpeciesChanged.emit(this.objects);
    }
  }
}
