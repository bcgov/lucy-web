import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

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

  @Input() fieldHeader = ``;

  ///// Selected item
  private _selectedItem = ``;
  // Get selected item
  get selectedItem(): string {
    return this._selectedItem;
  }
  // Set selected item
  @Input() set selectedItem(item: string) {
    this._selectedItem = item;
  }
  ////////////////////

  ///// Items list
  private _items: string[] = [];
  // Get items
  get items(): string[] {
    return this._items;
  }
  // Set items
  @Input() set items(array: string[]) {
    this._items = array;
  }
  ////////////////////

  // Response
  @Output() selectionChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  selected(item: string) {
    this.selectedItem = item;
    this.selectionChanged.emit(this.selectedItem);
  }

}
