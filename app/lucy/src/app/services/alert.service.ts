import { Injectable, EventEmitter} from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface AlertModel {
  title: string;
  body: string;
  buttons: AlertModalButton[];
}

export interface AlertModalButton {
  name: string;
  canDismiss: boolean,
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

    const model: AlertModel = {
      title: title,
      body: body,
      buttons: actionButtons
    };
    this.que.push(model);
    this.emit();
  }

  /**
   * Add message to que and returns true or false
   * to indicate if user confirmed or cancelled.
   * @returns boolean
   */
  public async showConfirmation(title: string, body: string): Promise<boolean> {
    const confirmAction = new EventEmitter<boolean>();
    const cancelAction = new EventEmitter<boolean>();
    const actionButtons: AlertModalButton[] = [];

    return new Promise<boolean>((resolve, reject) => {


      confirmAction.subscribe(item => {
        confirmAction.unsubscribe();
        cancelAction.unsubscribe();
        console.log(`should confirm`);
        resolve(true);
      });

      cancelAction.subscribe(item => {
        confirmAction.unsubscribe();
        cancelAction.unsubscribe();
        console.log(`should cancel`);
        resolve(false);
      });

      actionButtons.push({
        name: `Confirm`,
        canDismiss: true,
        eventEmitter: confirmAction,
      });

      actionButtons.push({
        name: `Cancel`,
        canDismiss: true,
        eventEmitter: cancelAction,
      });

      const model: AlertModel = {
        title: title,
        body: body,
        buttons: actionButtons
      };

      this.que.push(model);
      this.emit();
    });
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
