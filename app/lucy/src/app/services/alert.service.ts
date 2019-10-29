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
import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AlertModel {
  title: string;
  body: string[];
  buttons: AlertModalButton[];
}

export interface AlertModalButton {
  name: string;
  canDismiss: boolean;
  eventEmitter: EventEmitter<boolean> | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<AlertModel>();
  private que: AlertModel[] = [];
  private get current(): AlertModel {
    return this.que[0];
  }

  constructor() { }

  /**
   * Get observable to subscribe to.
   */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Add Alert message to que.
   * @param body string
   * @param title string
   * @param buttons AlertModalButton[] || null. Array of custom buttons
   */
  public show(title: string, body: string, buttons?: AlertModalButton[] | null) {
    let actionButtons: AlertModalButton[] = [];

    if (!buttons || buttons === null || buttons.length < 1) {
      actionButtons.push({
        name: `Okay`,
        canDismiss: true,
        eventEmitter: new EventEmitter<boolean>(),
      });
    } else {
      actionButtons = buttons;
    }

    this.pushModal(title, body, actionButtons);
  }

 /**
  * Add message to que and returns true or false
  * to indicate if user confirmed or cancelled.
  * @param title Message title
  * @param body Message body
  * @param confirmName Defaults to Confirm
  * @param cancelName Defefaults to Cancel
  * @returns boolean
  */

  public async showConfirmation(title: string, body: string, confirmName?: string, cancelName?: string): Promise<boolean> {
    const confirmAction = new EventEmitter<boolean>();
    const cancelAction = new EventEmitter<boolean>();
    const actionButtons: AlertModalButton[] = [];

    return new Promise<boolean>((resolve, reject) => {
      confirmAction.subscribe(item => {
        confirmAction.unsubscribe();
        cancelAction.unsubscribe();
        resolve(true);
      });

      cancelAction.subscribe(item => {
        confirmAction.unsubscribe();
        cancelAction.unsubscribe();
        resolve(false);
      });

      actionButtons.push({
        name: cancelName ? confirmName : `Confirm`,
        canDismiss: true,
        eventEmitter: confirmAction,
      });

      actionButtons.push({
        name: cancelName ? cancelName : `Cancel`,
        canDismiss: true,
        eventEmitter: cancelAction,
      });

      this.pushModal(title, body, actionButtons);
    });
  }

  private pushModal(title: string, body: string, actionButtons: AlertModalButton[]) {
    const model: AlertModel = {
      title: title,
      body: body.split('\n'),
      buttons: actionButtons
    };

    this.que.push(model);
    this.emit();
  }

  /**
   * Remove Alert Message from que.
   * @param message AlertModel
   */
  public clear(message: AlertModel) {
    if (!message) { return; }
    this.que.splice(0, 1);
    // this.que.splice(this.indexOf(message, this.que), 1);
    this.emit();
  }

  private indexOf(message: AlertModel, inArray: AlertModel[]): number {
    for (let i = 0; i < inArray.length ; i++) {
      if (this.isTheSameAlert(inArray[i], message)) {
        return i;
      }
    }
    return -1;
  }

  private isTheSameAlert(item1: AlertModel, item2:AlertModel) {
    const first = JSON.parse(JSON.stringify(item1));
    const second = JSON.parse(JSON.stringify(item2));
    return first === second;
  }

  /**
   * Sends the first alert in que array.
   */
  private emit() {
    this.subject.next(this.current);
  }

}
