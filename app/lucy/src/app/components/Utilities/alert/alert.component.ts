/**
 * Copyright 2019 Province of British Columbia
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { AlertModel, AlertService, AlertModalButton } from 'src/app/services/alert.service';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  public get title(): string {
    if (this.model === undefined) {
      return ``;
    } else {
      return this.model.title;
    }
  }

  public get body(): string {
    if (this.model === undefined) {
      return ``;
    } else {
      return this.model.body;
    }
  }

  public get buttons(): AlertModalButton[] {
    if (this.model === undefined) {
      return [];
    } else {
      return this.model.buttons;
    }
  }

  public get iHaveObject(): boolean {
    return this.model !== undefined;
  }

  private modalReference: NgbModalRef;

  private _model: AlertModel;

  get model(): AlertModel {
    return this._model;
  }

  @Input()
  set model(model: AlertModel) {
     this._model = model;
     this.delay(1).then(() => {
      this.showModal();
    });
  }

  @Output() alertEventEmitter = new EventEmitter<boolean>();
  @ViewChild('alertModal') private content;

  constructor(private alertService: AlertService, private modalService: NgbModal) { }

  ngOnInit() {}

  buttonPressed(button: AlertModalButton) {
    button.eventEmitter.emit();
    if (button.canDismiss) {
      this.removeModal();
      if (this.model) {
        this.alertService.clear(this.model);
      }
    }
  }

  private removeModal() {
    if (this.modalReference) {
      console.log(`XX closing Modal`);
      this.modalReference.close();
      delete(this.modalReference)
      this.modalReference = undefined;
    }
  }

  private async showModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'alertModalTitle'
    };

    if (!this.modalReference) {
      this.modalReference = this.modalService.open(this.content, ngbModalOptions);
    }
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
