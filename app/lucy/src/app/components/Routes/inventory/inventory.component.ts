/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observation } from 'src/app/models';
import { CodeTableService } from 'src/app/services/code-table.service';
import { ObservationService } from 'src/app/services/observation.service';
import { AppRoutes } from 'src/app/constants';
import { RouterService } from 'src/app/services/router.service';
import { LoadingService } from 'src/app/services/loading.service';
import { DummyService } from 'src/app/services/dummy.service';
import * as moment from 'moment';
import { ValidationService } from 'src/app/services/validation.service';
import { RolesService } from 'src/app/services/roles.service';
import { UserAccessType } from 'src/app/models/Role';
import { UserService } from 'src/app/services/user.service';
import { StringConstants } from 'src/app/constants/string-constants';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MapMarker } from '../../Utilities/map-preview/map-preview.component';
import { AppConstants } from 'src/app/constants/app-constants';
import { ToastService, ToastIconType } from 'src/app/services/toast/toast.service';


declare const process: any;

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  /**
   * User access type
   */
  public accessType: UserAccessType = UserAccessType.DataViewer;

   /**
   * Name of database
   * to be consumed by HTML
   */
  public databaseTitle = ``;
  
  /**
   * Boolean to indicate whether app is running in 
   * production environment
   */
  public isProd: boolean = false;

  /**
   * Boolean to indicate whether app is running in 
   * test environment
   */
  public isTest: boolean = false;

  /**
   * Show/Hide Add edit observation button
   * This value will only change
   * when is called ngOnInit().
   * if you wish to manually refresh,
   * call this.setAccessType().
   */
  public get isDataEditor(): boolean {
    return this.roles.canCreate(this.accessType);
  }

  /************ Sorting Variables ************/
  sortAscending = false;
  sortingByObservationId = false;
  sortingByDateObserved = false;
  sortingByDateUpdated = true;   // default sorting mechanism is by date last updated
  sortingBySpecies = false;
  sortingByObserver = false;
  /************ End of Sorting Variables ************/

  markers: MapMarker[] = [];
  observations: Observation[];

  /************ Flags ************/
  showMap = true;
  showList = true;
  /************ End of Flags ************/

  // TEMP
  private _numberOfTests = 10;
  set numberOfObservationForTesting(number: number) {
    if (this.validationService.isValidInteger(String(number))) {
      this._numberOfTests = number;
    }
  }
  get numberOfObservationForTesting(): number {
    return this._numberOfTests;
  }
  panelOpenState = false;
  materialTable = true;


  /************ Material Table ************/
  displayedColumns: string[] = ['Observation_id', 'species', 'date_observed', 'last_updated', 'observer', 'actions'];
  dataSource = new MatTableDataSource<Observation>(this.observations);
  @ViewChild(MatPaginator) paginator: MatPaginator;
   /************ END OF Material Table ************/

  constructor(
    private userService: UserService,
    private roles: RolesService,
    private validationService: ValidationService,
    private codeTables: CodeTableService,
    private observationService: ObservationService,
    private router: RouterService,
    private loadingService: LoadingService,
    private toast: ToastService,
    private dummy: DummyService) { }

  ngOnInit() {
    this.isProd = AppConstants.CONFIG.env === `prod` ? true : false;
    this.isTest = AppConstants.CONFIG.env === `test` ? true : false;
    this.fetchObservations();
    this.setAccessType();
    this.setDatabaseTitle();
  }

  private initMaterialTable() {
    this.dataSource = new MatTableDataSource<Observation>(this.observations);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Setting User's access type
   */
  private async setAccessType() {
    this.loadingService.add();
    this.accessType = await this.userService.getAccess();
    this.loadingService.remove();
  }

  private async fetchObservations() {
    this.loadingService.add();
    const observations = await this.observationService.getAll();
    this.observations = observations;
    this.initMaterialTable();
    this.setMapMarkers();
    this.loadingService.remove();
  }

  private setMapMarkers() {
    this.markers = [];
    for (const object of this.observations) {
      this.markers.push( {
        latitude: object.lat,
        longitude: object.long,
        observation: object,
      });
    }
  }

  private setDatabaseTitle() {
    this.databaseTitle = StringConstants.database_Title;
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
  /**
   * Sorts observations based on the date that the
   * observation was made
   */
  sortByDateObserved() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByDateObserved) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByDateObserved = true;

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
    this.initMaterialTable();
  }

  /**
   * Sorts observations based on the date that the observation
   * info was last updated (updatedAt property)
   */
  sortByDateUpdated() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByDateUpdated) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByDateUpdated = true;

    // Sort objects
    this.observations.sort((left, right): number => {
      if (left.updatedAt < right.updatedAt) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.updatedAt > right.updatedAt) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
    this.initMaterialTable();
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
      if (left.species.commonName < right.species.commonName) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.species.commonName > right.species.commonName) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
    this.initMaterialTable();
  }

  sortByObserver() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByObserver) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByObserver = true;

    // Sort objects
    this.observations.sort((leftObservation, rightObservation): number => {
      if (leftObservation.observerLastName < rightObservation.observerLastName) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (leftObservation.observerLastName > rightObservation.observerLastName) {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      // if we've reached here, left and right LastNames are equal
      // now sort by first name
      if (leftObservation.observerFirstName < rightObservation.observerFirstName) {
        if (this.sortAscending) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (this.sortAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      // if here, left observer name is identical to right observer name
      return 0;
    });
    this.initMaterialTable();
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
    this.initMaterialTable();
  }

  getIconName(): string {
    if (this.sortAscending) {
      return 'arrow_upward';
    } else {
      return 'arrow_downward';
    }
  }

  resetSortFields() {
    this.sortingByDateObserved = false;
    this.sortingByDateUpdated = false;
    this.sortingBySpecies = false;
    this.sortingByObserver = false;
    this.sortingByObservationId = false;
  }

  /************ End of Sorting Function ************/

  view(observation: Observation) {
    this.router.navigateTo(AppRoutes.ViewObservation, observation.observation_id);
  }

  edit(observation: Observation) {
    this.router.navigateTo(AppRoutes.EditObservation, observation.observation_id);
  }

  /************ Dummy Data ************/
  async createDummys() {
    this.loadingService.add();
    await this.delayAsync(100);
    this.observations = [];
    console.log(`generating`);
    const random = await this.dummy.createDummyObservations(this.numberOfObservationForTesting);
    if (!random) {
      this.toast.show('Feature is not available', ToastIconType.fail);
      this.loadingService.remove();
      return 
    }
    console.log(`generated`);
    this.observations = random;
    this.initMaterialTable();
    console.log(`Adding Pins`);
    this.setMapMarkers();
    this.loadingService.remove();
  }

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

  removeGeneratedObservations() {
    this.fetchObservations();
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  async delayAsync(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /************ End of Dummy Data ************/

}
