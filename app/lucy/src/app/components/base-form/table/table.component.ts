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
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RouterService } from 'src/app/services/router.service';

export interface TableModel {
  displayedColums: string[];
  columns: TableColumn[];
  rows: TableRowModel[];
}

export interface TableRowModel {
  fields: {};
  url: string;
}

export interface TableColumn {
  key: string;
  display: string;
}

export type MapObject = {[key: string]: any};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  ///// Table Model
  private _model: TableModel;
  get model(): TableModel {
    return this._model;
  }
  @Input() set model(object: TableModel) {
    this._model = object;
    if (object) {
      this.initMaterialTable();
    }
  }
  ////////////////////

  isTableReady = false;
  get isReady(): boolean {
    return (this.model !== undefined) && this.isTableReady;
  }

  get tableColumns(): TableColumn[] {
    if (!this.model || !this.model.columns) {
      return [];
    }
    return this.model.columns;
  }

  tableRows: MapObject[] = [];

  /************ Material Table ************/
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<MapObject>(this.tableRows);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  /************ END OF Material Table ************/
  constructor(private router: RouterService) { }

  ngOnInit() {
  }

  /**
   * Initialize data source and paginator
   */
  private initMaterialTable() {
    this.isTableReady = false;
    this.generateTableRows();
    this.displayedColumns = this.model.displayedColums;
    this.dataSource = new MatTableDataSource<MapObject>(this.tableRows);
    this.dataSource.paginator = this.paginator;
    this.isTableReady = true;
  }

  private generateTableRows() {
    this.tableRows = [];
    if (!this.model || !this.model.rows) {
      // console.log(`invalid table model`);
      return;
    }
    for (const row of this.model.rows) {
      const fields = row.fields;
      const rowData = {};

      /* Populate the row data based on following constraints
       *
       * If it's an object, store the `displayLabel`
       * For all other types, store the value directly
       */
      for (const field of Object.keys(fields)) {
        if (typeof fields[field] === 'object') {
          rowData[field] = fields[field].displayLabel;
        } else {
          rowData[field] = fields[field];
        }
      }

      this.tableRows.push(rowData);
    }
  }

  headerForDisplayedKey(key: string): string {
    for (const column of this.tableColumns) {
      if (column.key === key) {
        return column.display;
      }
    }
    return key;
  }

  viewDetails(object: any) {
    if (!this.router.isViewRoute || !object.api || !object.objectId) {
      return;
    }
    const route = this.router.getAppRouteForAPI(object.api);
    if (!route) {
      // console.log('not found');
      return;
    }
    this.router.navigateTo(route, object.objectId, true);
  }

}
