import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})


@NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]})

export class SideNavComponent implements OnInit {
  
  private _visibleClasses = [];
  get visibleClasses(): string[] {
    return this. _visibleClasses;
  }

  @Input() set visibleClasses(classNames: string[]) {
    this._visibleClasses = classNames;
  }

  @Output() sideNavItemClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  highlightMenuComponent() {
    if (this.visibleClasses.length < 1) {

    }
    const first = this.visibleClasses[0];
  }

}
