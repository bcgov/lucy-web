import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private subject = new Subject<boolean>();
  private loadingQue = 0;

  /**
   * Get observable to subscribe to.
   */
  public getObservable(): Observable<any> {
    return this.subject.asObservable();
  }

  constructor() { }

  public add() {
    this.loadingQue += 1;
    this.emit();
  }

  public remove() {
    this.loadingQue -= 1;
    if (this.loadingQue < 0) {
      this.loadingQue = 0;
    }
    this.emit();
  }

  /**
   * Sends the first alert in que array.
   */
  private emit() {
    this.subject.next(this.loadingQue !== 0);
  }
}
