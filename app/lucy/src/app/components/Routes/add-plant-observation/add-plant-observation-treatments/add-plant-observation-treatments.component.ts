import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observation, InvasivePlantSpecies } from 'src/app/models';
import { MechanicalTreatment } from 'src/app/models/MechanicalTreatment';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as moment from 'moment';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes } from 'src/app/constants';

export enum TreatmentMethod {
  Mechanical,
  Chemical
}

export interface ObservationTreatment {
  id: number;
  date: string;
  method: TreatmentMethod;
  species: InvasivePlantSpecies;
}

@Component({
  selector: 'app-add-plant-observation-treatments',
  templateUrl: './add-plant-observation-treatments.component.html',
  styleUrls: ['./add-plant-observation-treatments.component.css']
})
export class AddPlantObservationTreatmentsComponent implements OnInit {

  ///// Sort flags
  sortingAscending = false;
  sortingByDate = false;
  sortingByMethod = false;
  sortingBySpecies = false;
  ////////////////////

  ///// Observation object
  private _object: Observation;
  get observationObject(): Observation {
    return this._object;
  }
  @Input() set observationObject(object: Observation) {
    this._object = object;
    if (object && object.mechanicalTreatments) {
      this.generateObservationTreatments();
      this.initMaterialTable();
    }
  }
  ////////////////////

  ///// Mechanical Treatments
  get mechanicalTreatments(): MechanicalTreatment[] {
    if (this.observationObject && this.observationObject.mechanicalTreatments) {
      return this.observationObject.mechanicalTreatments;
    }
    return [];
  }
  ////////////////////

  observationTreatments: ObservationTreatment[] = [];

  /************ Material Table ************/
  displayedColumns: string[] = ['Date', 'Method', 'Species', `Actions`];
  dataSource = new MatTableDataSource<ObservationTreatment>(this.observationTreatments);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /************ END OF Material Table ************/
  constructor(private routerService: RouterService) { }

  ngOnInit() {
  }

  /**
   * Initialize data source and paginator
   * for Table of invasive species
   */
  private initMaterialTable() {
    this.dataSource = new MatTableDataSource<ObservationTreatment>(this.observationTreatments);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Convert various treaments in
   * Observation object and combine
   * them into a single
   * ObservationTreatment array
   */
  private generateObservationTreatments() {
    this.observationTreatments = [];
    for (const mechanicalTreatment of this.mechanicalTreatments) {
      this.observationTreatments.push( {
        id: mechanicalTreatment.mechanical_treatment_id,
        date: mechanicalTreatment.date,
        method: TreatmentMethod.Mechanical,
        species: mechanicalTreatment.species
      });
    }
  }

  ///// Sort functions

  /**
   * Set all sorting flags to false
   */
  resetSortFields() {
    this.sortingByDate = false;
    this.sortingBySpecies = false;
    this.sortingByMethod = false;
  }

  /**
   * Sort Observation Treatment array by date
   */
  sortByDate() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByDate) {
      this.sortingAscending = !this.sortingAscending;
    } else {
      this.sortingAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByDate = true;

    // Sort objects
    this.observationTreatments.sort((left, right): number => {
      if (left.date < right.date) {
        if (this.sortingAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.date > right.date) {
        if (this.sortingAscending) {
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
   * Sort Observation Treatment array by Species
   */
  sortBySpecies() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingBySpecies) {
      this.sortingAscending = !this.sortingAscending;
    } else {
      this.sortingAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingBySpecies = true;

    // Sort objects
    this.observationTreatments.sort((left, right): number => {
      if (!left.species) {
        return 1;
      }
      if (!right.species) {
        return 0;
      }
      if (left.species.commonName < right.species.commonName) {
        if (this.sortingAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.species.commonName > right.species.commonName) {
        if (this.sortingAscending) {
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
   * Sort Observation Treatment array by Treatment Method
   */
  sortByMethod() {
    // If aready sorting by this criteria,
    // Flip between ascending and descending
    if (this.sortingByMethod) {
      this.sortingAscending = !this.sortingAscending;
    } else {
      this.sortingAscending = false;
    }

    // Set sort flags
    this.resetSortFields();
    this.sortingByMethod = true;

    // Sort objects
    this.observationTreatments.sort((left, right): number => {
      if (left.method < right.method) {
        if (this.sortingAscending) {
          return 1;
        } else {
          return -1;
        }
      }
      if (left.method > right.method) {
        if (this.sortingAscending) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    });
    this.initMaterialTable();
  }
  ////////////////////

  /**
   * View details of specified Observation Treatment object
   * @param object ObservationTreatment
   */
  viewTreatment(object: ObservationTreatment) {
    switch (object.method) {
      case TreatmentMethod.Mechanical:
        this.routerService.navigateTo(AppRoutes.ViewMechanicalTreatment, object.id);
        break;
      case TreatmentMethod.Chemical:
        break;
    }
  }

}
