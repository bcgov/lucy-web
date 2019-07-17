import { Component, OnInit } from '@angular/core';
import { Observation } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { ObservationService } from 'src/app/services/observation.service';
import { AppRoutes } from 'src/app/constants';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  /************ Sorting Variables ************/
  sortAscending = false;
  sortingByDate = false;
  sortingBySpecies = false;
  sortingByLocation = false;
  sortingBySurveyor = false;

  /************ End of Sorting Variables ************/

  observations: Observation[];

  constructor(private codeTables: CodeTableService, private observationService: ObservationService, private router: RouterService) { }

  ngOnInit() {
    this.createDummys();
    this.fetchObservations();
  }

  private async fetchObservations() {
    const observations = await this.observationService.getAll();
    console.dir(observations);
    this.observations = observations;
  }

  /************ Sorting Function ************/
  sortByDate() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByDate) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByDate = true;

    // Sort objects
    this.observations.sort((left, right): number => {
      if (left.date < right.date) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.date > right.date) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }

  sortBySpecies() {
    this.resetSortFields();
    this.sortingBySpecies = true;
  }

  sortByLocation() {
    this.resetSortFields();
    this.sortingByLocation = true;
  }

  sortBySurveyor() {
    this.resetSortFields();
    this.sortingBySurveyor = true;
  }

  resetSortFields() {
    this.sortingByDate = false;
    this.sortingBySpecies = false;
    this.sortingByLocation = false;
    this.sortingBySurveyor = false;
  }

  /************ End of Sorting Function ************/

  view(observation: Observation) {
    this.router.navigateTo(AppRoutes.ViewObservation, observation.observation_id);
  }

  /************ Dummy Data ************/
  createDummys() {
    this.observations = [];
    this.codeTables.getInvasivePlantSpecies().then((invasivePlantSpecies) => {
      this.codeTables.getJuristictions().then((juristictions) => {
        this.observations.push({
          observation_id: this.getUniqueId(),
          lat: 1,
          long: 1,
          date: `2019-05-30`,
          observerFirstName: `Jake`,
          observerLastName: `Lake`,
          observerOrganization: { name: `freshworks` },
          speciesObservations: [{
            observationSpecies_Id: 1,
            species: invasivePlantSpecies[0],
            jurisdiction: juristictions[0],
            width: 1,
            length: 2,
            accessDescription: 'go right',
          }]
        },
        {
          observation_id: this.getUniqueId(),
          lat: 1,
          long: 1,
          date: `2019-05-30`,
          observerFirstName: `Mike`,
          observerLastName: `Ike`,
          observerOrganization: { name: `Freshworks` },
          speciesObservations: [{
            observationSpecies_Id: 1,
            species: invasivePlantSpecies[0],
            jurisdiction: juristictions[0],
            width: 1,
            length: 2,
            accessDescription: 'go right',
          }]
        }
        );
      });
    });
  }
  /************ End of Data ************/

  private getUniqueId(): number {
    if (this.observations.length < 1) {
      return 0;
    }
    const usedIds: number[] = [];
    for (const object of this.observations) {
      usedIds.push(object.observation_id);
    }

    const sortedUsedIds = usedIds.sort((n1, n2) => n1 - n2);
    return sortedUsedIds.pop() + 1;
  }

}
