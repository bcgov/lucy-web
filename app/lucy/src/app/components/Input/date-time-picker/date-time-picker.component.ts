/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: time-picker.component.ts
 * Project: lucy
 * File Created: Monday, 27th January 2020 11:09:11 am
 * Author: Williams, Andrea IIT (you@you.you)
 * -----
 * Last Modified: Monday, 27th January 2020 11:16:00 am
 * Modified By: Williams, Andrea IIT (you@you.you>)
 * -----
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbTimepicker, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormMode } from 'src/app/models';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { Time } from '@angular/common';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css']
})
export class DateTimePickerComponent implements OnInit {

  // Field header
  @Input() header = '';
  // Optional Input
  @Input() editable = true;

  get readonly(): boolean {
    if (this.mode === FormMode.View) {
      return true;
    } else {
      return !this.editable;
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

  private _dateTime: Date;
  private _time: Time;
  dateTimeAsString: string;

  get dateTime(): any {
    return this._dateTime;
  }

  @Input() set dateTime(dateTime: any) {
    if (dateTime === undefined) { return; }
    if (typeof dateTime === typeof Date) {
      this._dateTime.setDate(dateTime);
    } else {
      this._dateTime.setTime(dateTime);
    }
    this.emitSelection();
  }

  get time(): Time {
    return this._time;
  }

  @Input() set time(time: Time) {
    if (time === undefined) { return; }
    this._time = time;
  }

  ////////////////////

  get fieldId(): string {
    return this.camelize(this.header);
  }

  @Output() selected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
    // set current date and time as default
    this._dateTime = new Date();
  }

  /**
   * update the year/month/day of the dateTime object
   * (the time portion of dateTime is controlled by a different picker)
   * @param event change event from material datepicker
   */
  dateChanged(event) {
    this._dateTime.setFullYear(event.value.getFullYear());
    this._dateTime.setMonth(event.value.getMonth());
    this._dateTime.setDate(event.value.getDate());
    this.emitSelection();
  }

  timeChanged(event) {
    this._time = event;
    this.emitTimeSelection();
  }

  emitTimeSelection() {
    const h = this._time.toString().split(':')[0];
    const m = this._time.toString().split(':')[1];
    this._dateTime.setHours(+h, +m);
    console.log(this._dateTime);
    this.emitSelection();
  }

  emitSelection() {
    this.selected.emit(this._dateTime);
    this.dateTimeInReadonlyFormat();
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  pastAndPresentDatesOnlyFilter = (d: Date): boolean => {
    const currentDate = new Date();
    // prevent dates in future from being selected
    return currentDate >= d;
  }

  dateTimeInReadonlyFormat() {
    const date = this._dateTime.toDateString();
    const time = this._dateTime.getHours().toString() + ':' + this._dateTime.getMinutes().toString();
    this.dateTimeAsString = date + ' ' + time;
  }
}
