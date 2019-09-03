import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiffResult } from 'src/app/services/diff.service';


interface ChangedField {
  name: string;
  prettyName: string;
  before: string;
  after: string;
}
@Component({
  selector: 'app-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.css']
})
export class DiffViewerComponent implements OnInit {

  get changes(): ChangedField[] {
    if (!this.diffObject) {
      return [];
    }
    const _changes: ChangedField[] = [];

    // Create array of ChangedField Object
    Object.entries(this.diffObject.changes).forEach(
      ([key, value]) => {
        const before = this.diffObject.originalObject[key];
        _changes.push({
          name: key,
          // Create a "pretty name" from camelcase keys
          prettyName: (key.replace(/([A-Z])/g, ` $1`)).charAt(0).toUpperCase() + (key.replace(/([A-Z])/g, ` $1`)).slice(1),
          before: before,
          after: value,
        });
      }
    );
    return _changes;
  }

  @Input() diffObject: DiffResult;

  constructor() { }

  ngOnInit() {
  }

}
