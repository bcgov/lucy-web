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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiffResult } from 'src/app/services/diff.service';
import { AppConstants } from 'src/app/constants';
import { Utility } from 'src/app/services/utility';

declare const process: any;

interface ChangedField {
  name: string;
  prettyName: string;
  before: string;
  after: string;
}
@Component({
  selector: 'app-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.css']
})
export class DiffViewerComponent implements OnInit {

  /**
   * Boolean value to indicate whether app is running
   * in production environment
   */
  public isProd = false;

  get changes(): ChangedField[] {
    if (!this.diffObject) {
      return [];
    }
    const _changes: ChangedField[] = [];

    // Create array of ChangedField Object
    Object.entries(this.diffObject.changes).forEach(
      ([key, value]) => {
        const before = this.diffObject.originalObject[key];
        const isJson = typeof before === typeof {};
        const isArray = Array.isArray(before);
        const valueStr = `${value}`;
        const prettyKey = (key.replace(/([A-Z])/g, ` $1`)).charAt(0).toUpperCase() + (key.replace(/([A-Z])/g, ` $1`)).slice(1);
        if (isArray) {
          _changes.push({
            name: key,
            // Create a "pretty name" from camelCase keys
            prettyName: prettyKey,
            before: before.toString(),
            after: valueStr,
          });
        } else if (isJson) {
          this.handleRecursiveChanges(_changes, key, prettyKey, before, value);
        } else {
          _changes.push({
            name: key,
            // Create a "pretty name" from camelCase keys
            prettyName: prettyKey,
            before,
            after: valueStr,
          });
        }
      }
    );
    return _changes;
  }

  get numberOfChanged(): number {
    return this.changes.length;
  }

  private _diffObject: DiffResult;
  @Input() set diffObject(object: DiffResult) {
    this._diffObject = object;
    // console.log(object);
  }
  get diffObject(): DiffResult {
    return this._diffObject;
  }

  constructor() { }

  ngOnInit() {
    this.isProd = AppConstants.CONFIG.env == `prod` ? true : false;
  }

  handleRecursiveChanges(changes: any[], key: string, prettyKey: string, before: any, newObj: any) {
    let temp;
    if (typeof newObj !== typeof before) {
      const parsed = JSON.parse(newObj);
      if (Object.keys(parsed).length > 0 && typeof parsed === 'object') {
        temp = parsed;
      }
    }
    if (temp) {
      for (const k in temp) {
        // Check own keys
        if (temp.hasOwnProperty(k) && before[k] && before[k] !== temp[k]) {
          const beforeKeyObj = before[k];
          // Getting pretty key name
          const pName = (k.replace(/([A-Z])/g, ` $1`)).charAt(0).toUpperCase() + (key.replace(/([A-Z])/g, ` $1`)).slice(1);
          // Creating keys recursive presentation
          const nk = `${key}.${k}`;
          const npk = `${prettyKey} - ${Utility.shared.toUpperCase(k)}`;
          if (typeof beforeKeyObj === 'object') {
            // Search recursively
            this.handleRecursiveChanges(changes, nk, npk, beforeKeyObj, temp[k]);
          } else {
            // Create change object
            changes.push({
              name: nk,
              prettyName: npk,
              before:  beforeKeyObj,
              after: temp[k],
           });
          }
        }
      }
    } else {
      // Search object id key
      for (const kk in before) {
        if (before.hasOwnProperty(kk) && kk.includes('_id') && typeof before[kk] !== 'object') {
          changes.push({
            name: `${key}`,
            prettyName: `${prettyKey}`,
            before:  before[kk],
            after: newObj
         });
         break;
        }
      }
    }
  }
}
