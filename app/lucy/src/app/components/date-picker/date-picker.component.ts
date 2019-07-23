import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormMode } from 'src/app/models';

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

  ///// NG Bootstrap Date
  private _ngDate: NgbDate;
  // Get
  get ngDate(): NgbDate {
    return this._ngDate;
  }
  // Set
  set ngDate(date: NgbDate) {
    this._ngDate = date;
  }
  ////////////////////

  ///// Date
  private _date: Date;
  get date(): string {
    return `${this._date.getFullYear()}-${this._date.getMonth()}-${this._date.getDay()}`;
  }
  // Set
  @Input() set date(date: string) {
    if (!date) {
      this._date = new Date();
    } else {
      this._date = new Date(date);
      console.log(`Setting`);
      console.dir(this._date);
      console.dir(date);
      // const ngDate = new NgbDate(this._date.getUTCFullYear(), this._date.getUTCMonth() + 1, this._date.getUTCDay());
      // console.log(`to ng date:`);
      // console.dir(ngDate);
      // this.ngDate = ngDate;
    }
  }
  ////////////////////

  @Output() selected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  dateChanged(value: NgbDate) {
    const newDate = new Date(`${value.year}-${value.month - 1}-${value.day}`);
    if (this._date !== newDate) {
      this._date = newDate;
      this.emitSelection();
    }
  }

  emitSelection() {
    this.selected.emit(this._date);
  }

}
