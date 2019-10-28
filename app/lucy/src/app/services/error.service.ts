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
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RouterService } from './router.service';
import { AppRoutes } from '../constants';

export enum ErrorType {
  AccessDenied,
  NotFound,
  NotAvailable,
  Unknown
}

export interface ErrorModel {
  title: string;
  body: string;
}
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private subject = new Subject<ErrorModel>();
  public current: ErrorModel;

  constructor(private router: RouterService) { }

  /**
   * Get observable to subscribe to.
   */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Emit an error model object
   * @param body string
   * @param title string
   */
  public show(type: ErrorType) {
    this.setErrorMessage(type);
    this.router.navigateTo(AppRoutes.Error);
  }

  private setErrorMessage(type: ErrorType) {
    switch (type) {
      case ErrorType.AccessDenied:
        this.current = {
          title: `Access denied`,
          body: `You can request elevated access in your profile page`
        };
        break;
      case ErrorType.NotFound:
        this.current = {
          title: `Not Found`,
          body: `The requested resource was not found`
        };
        break;
      case ErrorType.NotAvailable:
        this.current = {
          title: `Unavailable`,
          body: `The requested resource is currently unavailable`
        };
        break;
      case ErrorType.Unknown:
        this.current = {
          title: `Whoops, something is wrong`,
          body: `Please try again later`
        };
        break;
    }
  }
}