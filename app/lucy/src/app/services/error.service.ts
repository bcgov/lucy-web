import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RouterService } from './router.service';
import { AppRoutes } from '../constants';

export enum ErrorType {
  AccessDenied,
  NotFound
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
    }
  }
}