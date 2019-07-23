import { Component, OnInit } from '@angular/core';
import { Observation } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { ObservationService } from 'src/app/services/observation.service';
import { AppRoutes } from 'src/app/constants';
import { RouterService } from 'src/app/services/router.service';
import { LatLong } from '../map-preview/map-preview.component';
import { LoadingService } from 'src/app/services/loading.service';
import { DummyService } from 'src/app/services/dummy.service';
import * as moment from 'moment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {

  /************ Sorting Variables ************/
  sortAscending = false;
  sortingByObservationId = false;
  sortingByDate = false;
  sortingBySpecies = false;
  sortingByLocation = false;
  sortingBySurveyor = false;
  /************ End of Sorting Variables ************/

  markers: LatLong[] = [];
  observations: Observation[];

  /************ Flags ************/
  showMap = true;
  showList = true;
  /************ End of Flags ************/

  constructor(private codeTables: CodeTableService, private observationService: ObservationService, private router: RouterService, private loadingService: LoadingService, private dummy: DummyService) { }

  ngOnInit() {
    this.fetchObservations();
  }

  private async fetchObservations() {
    this.loadingService.add();
    const observations = await this.observationService.getAll();
    this.observations = observations;
    this.setMapMarkers();
    this.loadingService.remove();
  }

  private setMapMarkers() {
    this.markers = [];
    for (const object of this.observations) {
      this.markers.push( {
        latitude: object.lat,
        longitude: object.long
      });
    }
  }

  switchShowMap() {
    this.showMap = !this.showMap;
  }

  switchShowList() {
    this.showList = !this.showList;

    /**
     * When adding and removing
     * list div, the size of the map needs to change.
     * so if map is showing, we can remove and
     * re-add it quickly
    */

    if (this.showMap) {
      this.showMap = false;
      this.delay(1).then(() => {
        this.showMap = true;
      });
    }
  }

  /**
   * Create a delay
   * @param ms milliseconds
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // get dateToString(date: Date): string {
  //   return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
  // }

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
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingBySpecies) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingBySpecies = true;

    // Sort objects
    this.observations.sort((left, right): number => {
      if (left.speciesObservations[0].species.commonName < right.speciesObservations[0].species.commonName) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.speciesObservations[0].species.commonName > right.speciesObservations[0].species.commonName) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }

  sortByLocation() {
    this.resetSortFields();
    this.sortingByLocation = true;
  }

  sortBySurveyor() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingBySurveyor) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingBySurveyor = true;

    // Sort objects
    this.observations.sort((left, right): number => {
      if (left.observerLastName < right.observerLastName) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.observerLastName > right.observerLastName) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }

  sortByObservationId() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByObservationId) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByObservationId = true;

    // Sort objects
    this.observations.sort((left, right): number => {
      if (left.observation_id < right.observation_id) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.observation_id > right.observation_id) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
  }

  resetSortFields() {
    this.sortingByDate = false;
    this.sortingBySpecies = false;
    this.sortingByLocation = false;
    this.sortingBySurveyor = false;
    this.sortingByObservationId = false;
  }

  /************ End of Sorting Function ************/

  view(observation: Observation) {
    this.router.navigateTo(AppRoutes.ViewObservation, observation.observation_id);
  }

  /************ Dummy Data ************/
  async createDummys() {
    this.loadingService.add();
    this.observations = [];
    const random = await this.dummy.createDummyObservations(40);
    this.observations = random;
    this.setMapMarkers();
    this.loadingService.remove();
  }

  /************ End of Dummy Data ************/

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

  generateObservationForTesting() {
    this.createDummys();
  }

}
