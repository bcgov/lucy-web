import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { DropdownObject } from 'src/app/services/dropdown.service';

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
  private _selectedItem: DropdownObject;
  // Get selected item
  get selectedItem(): DropdownObject {
    return this._selectedItem;
  }
  // Set selected item
  @Input() set selectedItem(item: DropdownObject) {
    if (!item) { return; }
    this._selectedItem = item;
  }
  ////////////////////

  get selectedItemName(): string {
    if (this.selectedItem) {
      return this.selectedItem.name;
    } else {
      return ``;
    }
  }

  ///// Items list
  private _items: DropdownObject[] = [];
  // Get items
  get items(): DropdownObject[] {
    return this._items;
  }
  // Set items
  @Input() set items(array: DropdownObject[]) {
    this.filteredItems = array;
    this._items = array;
  }
  ////////////////////

  ///// Items list
  private _filteredItems: DropdownObject[] = [];
  // Get filtered items
  get filteredItems(): DropdownObject[] {
    return this._filteredItems;
  }
  // Set filtered
  set filteredItems(items: DropdownObject[]) {
    this._filteredItems = items;
  }
  ////////////////////

  // Response
  @Output() selectionChanged = new EventEmitter<DropdownObject>();

  constructor() { }

  ngOnInit() {
  }

  selected(item: DropdownObject) {
    this.selectedItem = item;
    this.selectionChanged.emit(this.selectedItem);
  }

  filer(string: string) {
    console.log(string);
    if (string === ``) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = [];
      console.log(`searching`);
      for (const item of this.items) {
        if (item.name.toLowerCase().includes(string.toLowerCase())) {
          this.filteredItems.push(item);
        }
      }
    }
  }

}
