
import { Component, OnInit } from '@angular/core';
import { CodeTableService } from 'src/app/services/code-table.service';
import { InvasivePlantSpecies } from 'src/app/models/observation';
import * as faker from 'faker';

@Component({
  selector: 'app-species-treated',
  templateUrl: './species-treated.component.html',
  styleUrls: ['./species-treated.component.css']
})
export class SpeciesTreatedComponent implements OnInit {

  _speciesBeingTreated: InvasivePlantSpecies[] = [];
  _speciesNotBeingTreated: InvasivePlantSpecies[] = [];
  species: InvasivePlantSpecies[];


  constructor(private codeTables: CodeTableService) { }


  async ngOnInit() {
    this.species = await this.codeTables.getInvasivePlantSpecies();
    for (let i = 0; i < 2; i++) {
        this._speciesBeingTreated.push(this.species[faker.random.number(this.species.length)]);
    }
    for (let i = 0; i < 2; i++) {
        this._speciesNotBeingTreated.push(this.species[faker.random.number(this.species.length)]);
    }

  }

  // TODO speciesBeingTreated is list of plant species taken from ???
  set speciesBeingTreated(s: InvasivePlantSpecies[]) {
    for (const elem of s) {
        this._speciesBeingTreated.push(elem);
    }
  }

  get speciesBeingTreated(): InvasivePlantSpecies[] {
      return this._speciesBeingTreated;
  }

  // // TODO speciesNotBeingTreated is list of plant species that have been observed within the treatment area but are not being addressed by the current treatment record
  set speciesNotBeingTreated(s: InvasivePlantSpecies[]) {
      for (const elem of s) {
        this._speciesNotBeingTreated.push(elem);
      }
  }

  get speciesNotBeingTreated(): InvasivePlantSpecies[] {
      return this._speciesNotBeingTreated;
  }
}
