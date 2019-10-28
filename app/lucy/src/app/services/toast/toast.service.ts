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
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ToastModel {
  message: string;
  icon: ToastIconType;
}

export enum ToastIconType {
  success,
  fail,
  none,
}


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private subject = new Subject<ToastModel>();

  private que: ToastModel[] = [];
  private get current(): ToastModel {
    return this.que[0];
  }

  constructor() { }

  /**
   * Show a toast message
   * @param message string
   * @param iconType ToastIconType
   */
  public show(message: string, iconType?: ToastIconType) {
    let icon = ToastIconType.none;
    if(iconType !== undefined) {
      icon = iconType;
    }
    const model: ToastModel = {
      message: message,
      icon: icon,
    };
    this.que.push(model);
    this.emit();
  }

  /**
   * Get observable to subscribe to.
  */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

   /**
   * Remove from que.
   * @param message AlertModel
   */
  public clear(message: ToastModel) {
    if (!message) { return; }
    this.que.splice(0, 1);
    this.emit();
  }

  private indexOf(message: ToastModel, inArray: ToastModel[]): number {
    for (let i = 0; i < inArray.length ; i++) {
      if (this.isTheSameAlert(inArray[i], message)) {
        return i;
      }
    }
    return -1;
  }

  private isTheSameAlert(item1: ToastModel, item2: ToastModel) {
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