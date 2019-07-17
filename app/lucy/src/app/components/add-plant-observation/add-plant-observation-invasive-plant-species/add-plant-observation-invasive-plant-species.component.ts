import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { InvasivePlantSpecies, ObservationInvasivePlantSpecies, Jurisdiction } from 'src/app/models/observation';
import { CodeTableService } from 'src/app/services/code-table.service';

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

  constructor(private codeTableService: CodeTableService) { }

  ngOnInit() {
  }

  addNewSpecies(): ObservationInvasivePlantSpecies {
    return this.addSpecies(undefined, undefined, undefined, 0, 0, undefined);
  }

  addSpecies(id: number, species: InvasivePlantSpecies, jurisdiction: Jurisdiction, width: number, length: number, accessDescription: string): ObservationInvasivePlantSpecies {
    const newSpecies = {
      observationSpecies_Id: id ? id : this.getUniqueId(),
      species: species,
      jurisdiction: jurisdiction,
      width: width,
      length: length,
      accessDescription: accessDescription,
    };
    this.objects.push(newSpecies);
    return(newSpecies);
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

  autofillForTesting() {
    this.codeTableService.getInvasivePlantSpecies().then((plantSpecies) => {
      this.codeTableService.getJuristictions().then((jurisdiction) => {
        const species = this.addSpecies(undefined, plantSpecies[0], jurisdiction[0], 5, 5, `go left`);
      });
    });
  }
}
