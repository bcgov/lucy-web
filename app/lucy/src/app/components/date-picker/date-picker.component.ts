import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
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
    return String(this._date);
  }
  // Set
  @Input() set date(date: string) {
    if (!date) {
      this._date = new Date();
    } else {
      this._date = new Date(date);
    }
    console.log(this._date);
    // this.ngDate = new NgbDate(this._date.getFullYear(), this._date.getMonth(), this._date.getDay());
  }
  ////////////////////

  @Output() selected = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  dateChanged(value: NgbDate) {
    console.dir(value);
    const newDate = new Date(`${value.year}-${value.month}-${value.day}`);
    if (this._date !== newDate) {
      this._date = new Date(`${value.year}-${value.month}-${value.day}`);
      this.emitSelection();
    }
  }

  emitSelection() {
    this.selected.emit(this._date);
  }

}
