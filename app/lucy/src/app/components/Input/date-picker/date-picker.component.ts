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

  @Output() selected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
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

}
