import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse/papaparse.min.js';
import { ApiService, APIRequestMethod } from '../api.service';
import { AppConstants } from 'src/app/constants';

export enum ExportType {
  WatercraftRiskAssessment,
  Shift,
  Observation
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private api: ApiService) { }

  /**
   * Download CSV export of data type specified.
   */
  public exportCSV(type: ExportType) {
    this.exportCSVfrom(this.urlForExportType(type), this.fileNameForExportType(type));
  }

  public async getInspectAppExportData(type: ExportType): Promise<any> {
    const data = await this.api.request(APIRequestMethod.GET, this.urlForExportType(type), null);
    if (!data.success) {
      console.log('Error: Couldnt fetch data');
      return;
    }
    return data.response
  }

  /**
   * Returns the endpoint for the given ExportType.
   * @param type ExportType
   */
  private urlForExportType(type: ExportType): string {
    switch (type) {
      case ExportType.WatercraftRiskAssessment:
        return AppConstants.API_WatercraftAssessment_Export;
      case ExportType.Shift:
        return AppConstants.API_Shift_Export;
      case ExportType.Observation:
        return AppConstants.API_observation_Export;
    }
  }

  /**
   * Returns the endpoint for the given ExportType.
   * @param type ExportType
   */
  private fileNameForExportType(type: ExportType): string {
    const dateNow = Date().toString();
    switch (type) {
      case ExportType.WatercraftRiskAssessment:
        return `Watercaft Risk Assessment Report - ${dateNow}`;
      case ExportType.Shift:
        return `Shift Report - ${dateNow}`;
      case ExportType.Observation:
        return `Observation Report - ${dateNow}`;
    }
  }

  /**
   * Download data from endpoint and export as csv file.
   * @param url endpoint
   */
  private async exportCSVfrom(url: string, fileName: string) {
    const data = await this.api.request(APIRequestMethod.GET, url, null);
    if (!data.success) {
      console.log('Error: Couldnt fetch data');
      return;
    }
    this.downloadCSV(data.response, fileName);
  }

  /**
   * Save array of objects as a CSV file.
   * Default name is export - current date and time.
   * @param objects to export
   * @param fileName file name
   */
  public downloadCSV(objects: any, fileName: string | null) {
    if (!objects) { return; }
    const _fileName = fileName ? fileName : `export - ${Date().toString()}`;
    const csv =  Papa.unparse(objects);
    // const csv = this.toCSV(objects);
    if (!csv) { return; }
    const blob = new Blob([csv.toString()], { type: 'text/json' });
    saveAs(blob, `${_fileName}.csv`);
  }

  /**
   * Save array of objects as a json file.
   * Default name is export - current date and time.
   * @param objects array of objects
   * @param name file name
   */
  public downloadJSON(objects: any, name: string | null) {
    if (!objects) { return; }
    const fileName = name ? name : `export - ${Date().toString()}`;
    const json = JSON.stringify(objects);
    const blob = new Blob([json.toString()], { type: 'text/json' });
    saveAs(blob, `${fileName}.json`);
  }
}
