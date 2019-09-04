import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})


@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })

export class SideNavComponent implements OnInit {

  /**
   * When user clicks an element,
   * highlightMenuComponent() may not
   * pick the same element after scrolling.
   * we can use this flag to not let
   * highlightMenuComponent() pick an element
   * for a short duration
   */
  private locked = false;

  private _visibleClasses = [];
  get visibleClasses(): string[] {
    return this._visibleClasses;
  }

  basicInfoIsVisible = false;
  advancedDataIsVisible = false;
  treatmentsSectionVisible = false;

  @Input() set visibleClasses(classNames: string[]) {
    this._visibleClasses = classNames;
    this.highlightMenuComponent();
  }

  @Output() sideNavItemClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Loops though array of
   * class names and enables
   * selected styling for the
   * last element found
   */
  highlightMenuComponent() {
    if (this.locked) {
      return;
    }
    this.swtichAllOff();
    if (this.visibleClasses.length < 1) {
      return;
    }
    for (let _i = 0; _i < this.visibleClasses.length; _i++) {
      if (this.visibleClasses[_i] === ``) {
        continue;
      } else {
        const className = this.visibleClasses[_i];
        if (className.toLowerCase().includes(`basic`)) {
          this.swtichAllOff();
          this.basicInfoIsVisible = true;
        } else if (className.toLowerCase().includes(`advanced`)) {
          this.swtichAllOff();
          this.advancedDataIsVisible = true;
        } else if (className.toLowerCase().includes(`treatments`)) {
          this.swtichAllOff();
          this.treatmentsSectionVisible = true;
        }
      }
    }
  }

  swtichAllOff() {
    this.basicInfoIsVisible = false;
    this.advancedDataIsVisible = false;
    this.treatmentsSectionVisible = false;
  }

  basicSectionSelected() {
    this.sideNavItemClicked.emit(`basic`);
    this.swtichAllOff();
    this.basicInfoIsVisible = true;
    this.lockHighlightingShortly();
  }

  advancedSectionSelected() {
    this.sideNavItemClicked.emit(`advanced`);
    this.swtichAllOff();
    this.advancedDataIsVisible = true;
    this.lockHighlightingShortly();
  }

  treatmentsSectionSelected() {
    this.sideNavItemClicked.emit(`treatments`);
    this.swtichAllOff();
    this.treatmentsSectionVisible = true;
    this.lockHighlightingShortly();
  }


  /**
   * When user clicks an element,
   * highlightMenuComponent() may not
   * pick the same element after scrolling.
   * we can use this function to not let
   * highlightMenuComponent() pick an element
   * for a short duration
   */
  private async lockHighlightingShortly() {
    this.locked = true;
    await this.delay(2000);
    this.locked = false;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
