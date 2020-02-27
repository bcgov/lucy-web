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
 * 	Created by Raj Manivannan on 2020-02-26.
 */
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appElementFocus]'
})
export class ElementFocusDirective implements OnInit {
  /**
   * Move the focus to the `ref` element on initial render
   * @param ref the ref to the input element on which this directive is used
   * @var setFocus the boolean to determine if an element needs be focused, when there are more than one ref
   */
  constructor(private ref: ElementRef) { }

  @Input() setFocus: boolean;

  ngOnInit(): void {
    if (this.setFocus) {
      this.ref.nativeElement.focus();
    }
  }

}
