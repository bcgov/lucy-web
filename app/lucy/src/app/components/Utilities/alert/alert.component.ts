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
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AlertModel, AlertService, AlertModalButton } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  presenting = true;
  private dirmissDurationInSeconds = 1;

  public get title(): string {
    if (this.model === undefined) {
      return ``;
    } else {
      return this.model.title;
    }
  }

  public get body(): string[] {
    if (this.model === undefined) {
      return [];
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

  private _model: AlertModel;

  get model(): AlertModel {
    return this._model;
  }

  @Input()
  set model(model: AlertModel) {
     this._model = model;
     this.wait(1).then(() => {
      this.showModal();
    });
  }

  @Output() alertEventEmitter = new EventEmitter<boolean>();

  constructor(private alertService: AlertService) { }

  ngOnInit() {}

  async buttonPressed(button: AlertModalButton) {
    button.eventEmitter.emit();
    if (button.canDismiss) {
      await this.removeModal();
      if (this.model) {
        this.alertService.clear(this.model);
      }
    }
  }

  private async removeModal(): Promise<boolean> {
    this.presenting = false;
    await this.wait(this.dirmissDurationInSeconds * 1000);
    return true;
  }

  private async showModal() {
    this.presenting = true;
  }

   /**
   * Create a delay
   * @param ms milliseconds
   */
  private wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
