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
 * 	Created by Raj Manivannan on 2019-02-07.
 */
import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickAway]'
})
export class ClickAwayDirective {

  constructor(private ref: ElementRef) { }

  @Output()
  public clickAway = new EventEmitter();

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const clickedInside = this.ref.nativeElement.contains(targetElement);
    let targetId;

    targetId = targetElement.id;
    if (!targetId) {
      targetId = targetElement.parentElement.id;
    }
    
    // Check if the click was outside the element
    // The variable `targetId` is used to avoid onClick events on the parent element
    if (targetElement && !clickedInside && !(targetId === 'clickAwayParent')) {
      this.clickAway.emit(event);
    }
  }
}
