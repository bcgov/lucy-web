import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Save array of objects as a CSV file
   * Default name is export - current date and time
   * @param objects 
   * @param name 
   */
  public downloadCSV(objects: any, name: string | null) {
    if (!objects) { return; }
    const fileName = name ? name : `export - ${Date().toString()}`;
    const items = this.flattenJsonArray(objects);
    const replacer = (key, value) => value === null ? '' : value; // handle null values here
    const header = Object.keys(items[0]);
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');
    const blob = new Blob([csv.toString()], { type: 'text/json' });
    saveAs(blob, `${fileName}.csv`);
  }

  /**
   * Save array of objects as a json file
   * Default name is export - current date and time
   * @param objects array of objects
   * @param name file name
   */
  public downloadJSON(objects: any, name: string | null) {
    if (!objects) { return; }
    const fileName = name ? name : `export - ${Date().toString()}`;
    const json = JSON.stringify(this.flattenJsonArray(objects));
    const blob = new Blob([json.toString()], { type: 'text/json' });
    saveAs(blob, `${fileName}.json`);
  }

  /*
  Convert array of objects with nested objects into a flat structure
  */
  public flattenJsonArray(data: any[]): any {
    const flatArray = [];
    const flatObject = {};

    for (let index = 0; index < data.length; index++) {
      for (let prop in data[index]) {

        let value = data[index][prop];

        if (Array.isArray(data[index][prop])) {
          for (let i = 0; i < value.length; i++) {
            for (let inProp in value[i]) {
              flatObject[`${prop}-${inProp}`] = value[i][inProp]; // Key name for nested objext
            }
          }
        } else {
          flatObject[prop] = value;
        }
      }
      flatArray.push(flatObject);
    }
    return flatArray;
  }
}
