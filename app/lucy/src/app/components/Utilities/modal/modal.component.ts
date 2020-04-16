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
 * 	Created by Rajasekaran Manivannan on 2019-02-12.
 */
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() align: string;
  @Output() onBackdropClick = new EventEmitter<any>();

  get classNames(): Object {
    if (!this.align) return { 'top-align': true };
    
    // add more class for alignment if needed
    switch (this.align) {
      case 'center': return { 'center-align': true };
      default: return { 'top-align': true };
    }
  }

  constructor() { }

  ngOnInit() {
    //disable body overflow when modal is open
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    //disable body overflow when modal is closed
    document.body.style.overflow = 'unset';
  }

  onClickAway(): void {
    if (this.onBackdropClick) this.onBackdropClick.emit();
  }

}
