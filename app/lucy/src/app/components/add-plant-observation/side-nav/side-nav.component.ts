import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})


@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })

export class SideNavComponent implements OnInit {

  private _visibleClasses = [];
  get visibleClasses(): string[] {
    return this._visibleClasses;
  }

  basicInfoIsVisible = false;
  advancedDataIsVisible = false;

  @Input() set visibleClasses(classNames: string[]) {
    this._visibleClasses = classNames;
    this.highlightMenuComponent();
  }

  @Output() sideNavItemClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  highlightMenuComponent() {
    this.swtichAllOff();
    if (this.visibleClasses.length < 1) {
      return;
    }
    const first = this.visibleClasses[0];
    for (let _i = 0; _i < this.visibleClasses.length; _i++) {
      if (this.visibleClasses[_i] === ``) {
        continue;
      } else {
        const className = this.visibleClasses[_i];
        if (className.toLowerCase().includes(`basic`)) {
          this.basicInfoIsVisible = true;
          break;
        } else if (className.toLowerCase().includes(`advanced`)) {
          this.advancedDataIsVisible = true;
          break;
        }
      }
    }
  }

  swtichAllOff() {
    this.basicInfoIsVisible = false;
    this.advancedDataIsVisible = false;
  }
}
