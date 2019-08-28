import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DiffResult } from 'src/app/services/diff.service';

@Component({
  selector: 'app-diff-viewer',
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.css']
})
export class DiffViewerComponent implements OnInit {

  @Input() diffObject: DiffResult;

  constructor() { }

  ngOnInit() {
  }

}
