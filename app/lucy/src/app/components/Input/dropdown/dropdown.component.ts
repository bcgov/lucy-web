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
import { FormMode } from 'src/app/models';
import { DropdownObject } from 'src/app/services/dropdown.service';
import { FormControl } from '@angular/forms';
import { Subject, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatSelectChange } from '@angular/material';
import { AlertService, AlertModalButton } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { AppRoutes} from 'src/app/constants/app-routes.enum';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  /** control for the selected option */
  public optionCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public optionFilterCtrl: FormControl = new FormControl();

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @Input() fieldHeader = ``;
  @Input() multiple = false;
  // Optional Input
  @Input() editable = true;
  @Input() dataCy;
  actionButtons: AlertModalButton[];
  emitter: EventEmitter<boolean>;

  get fieldId(): string {
    if (this.fieldHeader !== undefined) {
      return this.camelize(this.fieldHeader);
    } else { return ``; }
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

  get readonly(): boolean {
    if (this.mode === FormMode.View) {
      return true;
    } else {
      return !this.editable;
    }
  }

  ///// Selected item
  @Output() selectionChanged = new EventEmitter<DropdownObject | DropdownObject[]>();
  private _selectedItem: DropdownObject | DropdownObject[];
  // Get selected item
  get selectedItem(): DropdownObject | DropdownObject[] {
    return this._selectedItem;
  }
  // Set selected item
  @Input() set selectedItem(item: DropdownObject | DropdownObject[]) {
    if (!item) { return; }

    this._selectedItem = item;
    this.selectionChanged.emit(item);
  }
  ////////////////////

  get selectedItemName(): string | string[] {
    if (this.multiple) {
      const items = this.selectedItem as DropdownObject[];
      if (!items || items.length === 0) return '';

      const itemNames = items.map(item => item.name);
      return itemNames;
    }
    const item = this.selectedItem as DropdownObject;
    return item ? item.name : '';
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

    // Create EventEmitter to be used with AlertModalButton.
    // If there are no items available to be added to dropdown,
    // assume that an error has occurred somewhere.
    // (e.g., user is trying to add a new mechanical treatment before any observations have been created)
    this.emitter = new EventEmitter<boolean>();
    this.emitter.subscribe(item => {
      this.routerService.navigateTo(AppRoutes.AddEntry, null, false);
      this.emitter.unsubscribe();
    });

    if (this._items.length === 0) {
      this.alert.show('Error', 'Must create at least one ' + this.fieldHeader + ' first', [{name: `Okay`, canDismiss: true, eventEmitter: this.emitter}]);
    }
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

  constructor( private alert: AlertService, private routerService: RouterService ) {  }

  ngOnInit() {
    // set initial selection
    // this.optionCtrl.setValue(this.items[0]);

    this.optionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });
  }
    
  selected(event: MatSelectChange) {
    if (this.multiple) {
      const selectedOptions = event.value as string[];
      const items = [];
      selectedOptions.forEach(value => {
        const item = this.filteredItems.find(option => option.name === value);
        items.push(item);
      });
      this.selectedItem = items;
      this.selectionChanged.emit(items);
      return;
    }
    const selectedOption = this.filteredItems.find(item => item.name === event.value);
    this.selectedItem = selectedOption;
    this.selectionChanged.emit(selectedOption);
  }

  filterOptions() {
    if (!this.items) {
      return;
    }

    // get the search keyword
    let search = this.optionFilterCtrl.value;
    if (!search) {
      this.filteredItems = this.items;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredItems = [];

    for (const item of this.items) {
      if (item.name !== undefined && String(item.name).toLowerCase().includes(search.toLowerCase())) {
        this.filteredItems.push(item);
      }
    }
  }

  filer(string: string) {
    if (string === ``) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = [];
      for (const item of this.items) {
        if (item.name.toLowerCase().includes(string.toLowerCase())) {
          this.filteredItems.push(item);
        }
      }
    }
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

}
