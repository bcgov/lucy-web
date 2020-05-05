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
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormMode } from 'src/app/models';
import { MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

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

  ///// Date
  private _date: Date;
  get date(): string {
    if (this._date) {
      return moment(this._date).format('YYYY-MM-DD');
    } else {
      return ``;
    }
  }
  // Set
  @Input() set date(date: string) {
    if (date) {
      this._date = moment(date, 'YYYY-MM-DD').toDate();
      this.emitSelection();
    }
  }
  ////////////////////

  get fieldId(): string {
    return this.camelize(this.header);
  }

  @Output() selected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  checkKey(event: any) {
    // To make the date picker input tab-friendly
    return event.key === 'Tab';
  }

  pastAndPresentDatesOnlyFilter = (d: Date): boolean => {
    const currentDate = new Date();
    // prevent dates in future from being selected
    return currentDate >= d;
  }

  dateChanged(event: MatDatepickerInputEvent<Date>) {
    if (this._date !== event.value) {
        this._date = event.value;
        this.emitSelection();
    }
  }

  emitSelection() {
    this.selected.emit(this._date);
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }
}
