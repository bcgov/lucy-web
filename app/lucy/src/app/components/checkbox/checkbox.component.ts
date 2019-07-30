import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  // Field header
  @Input() header = '';
  @Input() set value(checked: boolean) {
    this._checked = checked;
  }

  private _checked = false;
  get checked(): boolean {
    return this._checked;
  }
  set checked(checked: boolean) {
    this._checked = checked;
    this.emit();
  }

  // Output
  @Output() selectionChanged = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  private emit() {
    console.log('emitting');
    this.selectionChanged.emit(this.checked);
  }

}
