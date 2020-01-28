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
// import { MatDatepickerInputEvent } from '@angular/material';
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

  private _dateTime: {
    date: Date,
    time: Time
  };

  get date(): string {
    if (this._dateTime.date) {
      return moment(this._dateTime.date).format('YYYY-MM-DD');
    } else {
      return ``;
    }
  }

  @Input() set date(date: string) {
    if (date) {
      this._dateTime.date = moment(date, 'YYYY-MM-DD').toDate();
      this.emitSelection();
    }
  }


  get time(): string {
    if (this._dateTime.time) {
      return moment(this._dateTime.time).format('HH:mm');
    } else {
      return ``;
    }
  }
  // Set
  @Input() set time(time: string) {
    const reg = time.split(':');
    if (reg.length === 2) {
      this._dateTime.time = {
          hours: +reg[0],
          minutes: +reg[1]
      };
      this.emitSelection();
    }
  }
  ////////////////////

  get fieldId(): string {
    return this.camelize(this.header);
  }

  @Output() selected = new EventEmitter<{date: Date, time: Time}>();

  constructor() { }

  ngOnInit() {
    // set current date and time as default
    this._dateTime = {
      date: new Date(),
      time: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
      }
    };
  }

  timeChanged(event) {
    if (this._dateTime.time !== event.value) {
        this._dateTime.time = event.value;
        this.emitSelection();
    }
  }

  dateChanged(event) {
    if (this._dateTime.date !== event.value) {
      this._dateTime.date = event.value;
      this.emitSelection();
    }
  }

  emitSelection() {
    this.selected.emit({
      date: this._dateTime.date,
      time: this._dateTime.time
    });
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
}
