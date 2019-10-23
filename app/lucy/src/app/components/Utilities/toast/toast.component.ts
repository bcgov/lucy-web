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
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ToastModel, ToastIconType, ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  private displaySeconds = 7;

  private dirmissDurationInSeconds = 0.5;
  private get timeout(): number {
    return (this.displaySeconds * 1000) + (this.dirmissDurationInSeconds * 1000);
  }
  private get displayTime(): number {
    return this.timeout - (this.dirmissDurationInSeconds * 1000);
  }

  dismissTimer: any;
  dismissAnimationTimer: any;

  presenting = true;
  closedEarly = false;

  private _model: ToastModel = {
    message: '',
    icon: ToastIconType.none
  };

  get model(): ToastModel {
    return this._model;
  }

  @Input()
  set model(model: ToastModel) {
     this._model = model;
     if (this.model) {
      this.beginTimeout();
     }
   }

  get iconType(): string {
    if (this.model && this.model.icon !== undefined) {
      return ToastIconType[this.model.icon];
    } else {
      return ToastIconType[ToastIconType.none];
    }
  }

  get isSuccess(): boolean {
    if (this.model && this.model.icon !== undefined) {
      return this.model.icon === ToastIconType.success;
    }
  }

  get isFailure(): boolean {
    if (this.model && this.model.icon !== undefined) {
      return this.model.icon === ToastIconType.fail;
    }
  }

  constructor(private toastService: ToastService) { }

  ngOnInit() {
  }

  async beginTimeout() {
    this.presenting = true;
    this.beginDismissAnimationTimer();
    this.beginDismissTimer();
  }

  async beginDismissAnimationTimer() {
    // const current = {... this.model};
    await this.waitForDismissAnimationTimeout();
    if (!this.closedEarly) {
      this.presenting = false;
    }
  }

  async beginDismissTimer() {
    await this.waitForDismissTimeout();
    if (this.model && !this.closedEarly) {
      this.toastService.clear(this.model);
    }
  }

  async closeAction() {
    // 1) stop beginDismissAnimationTimer and beginDismissTimer from executing
    this.closedEarly = true;
    clearTimeout(this.dismissTimer);
    clearTimeout(this.dismissAnimationTimer);
    // execute dismiss animation
    this.presenting = false;
    await this.wait(this.dirmissDurationInSeconds * 1000);
    // clear it in toast
    if (this.model) {
      this.toastService.clear(this.model);
    }
    // 3) un-block beginDismissAnimationTimer and beginDismissTimer.
    this.closedEarly = false;
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  private wait(ms: number): Promise<any> {
    return new Promise( resolve => {
      setTimeout(resolve, ms);
    } );
  }

  private waitForDismissTimeout(): Promise<any> {
    return new Promise( resolve => {
      this.dismissTimer = setTimeout(resolve, this.timeout);
    } );
  }

  private waitForDismissAnimationTimeout(): Promise<any> {
    return new Promise( resolve => {
      this.dismissAnimationTimer = setTimeout(resolve, this.displayTime);
    } );
  }
}
