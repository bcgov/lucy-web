import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { AppRoutes } from '../constants';
import { RouterService } from '../services/router.service';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import { AlertModel, AlertService } from '../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  private authStatusIsLoading: boolean | null = null;

  public get isAuthenticated(): boolean {
    if (this.authStatusIsLoading === null || this.authStatusIsLoading) {
      return false;
    }
    return this.ssoService.isAuthenticated();
  }

  private get isReady(): boolean {
    return this.authStatusIsLoading === false;
  }

  public userAccessUpdatedMessage: Message;
  public userAccessUpdatedMessages: Message[];

  // ALERTS
  public alertMessage: AlertModel;
  private alertsSubscription: Subscription;
  ////////

  constructor(private routerService: RouterService, private ssoService: SsoService, private messageService: MessageService, private alertService: AlertService) {
    this.subscribeToAlertService();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unSubscribeFromAlertService();
  }

  ngAfterViewInit() {
    this.reRouteIfNeeded();
    this.testAlerts();
  }

  private subscribeToAlertService() {
    this.alertsSubscription = this.alertService.getObservable().subscribe(message => {
      console.log(`GOT A MESSAGE`);
      console.dir(message);
      if (message) {
        this.alertMessage = message;
      } else {
        this.alertMessage = undefined;
      }
    });
  }

  private unSubscribeFromAlertService() {
    this.alertsSubscription.unsubscribe();
  }

  private reRouteIfNeeded() {
    this.checkAuthStatus().then((isAuthenticated) => {
      if (isAuthenticated && (this.routerService.current === AppRoutes.Root) || this.routerService.current === undefined) {
        this.routerService.navigateTo(AppRoutes.Profile);
      }
    });
  }

  private async checkAuthStatus(): Promise<boolean> {
    this.authStatusIsLoading = true;
    const isAuthenticated = await this.ssoService.isAuthenticatedAsync();
    this.authStatusIsLoading = false;

    // Load messages
    if (isAuthenticated) {
      this.fetchMessages();
    }

    return isAuthenticated;
  }

  private fetchMessages() {
    this.messageService.fetchUnreadMessages().then(messages => {
      /// For testing
      const msg = {
        body: null,
        message_id: 2,
        status: 0,
        title: `Request Access rejected`,
        type: 0
      };
      /////
      this.showMessage(messages[0]);
    });
  }

  private showMessage(message: Message) {
    this.userAccessUpdatedMessage = message;
    this.delay(1).then(() => {
      $(`#userAccessMessageModal`).modal('show');
    });
  }

  /**
   * Create a delay
   * @param ms milliseconds
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  userAccessUpdatedModalEmitted(event: boolean) {
    console.log(`Messages was respoded to, re-fetching`);
    this.fetchMessages();
  }

  private testAlerts() {
    return;
    this.delay(100).then(() => {
      this.alertService.show(`HELOO`, `one`, null);
      this.delay(100).then(() => {
        this.alertService.show(`HELOO`, `two`, null);
        this.delay(1000).then(() => {
          this.alertService.show(`HELOO`, `three`, null);
        });
      });
      this.delay(1000).then(() => {
        this.alertService.show(`HELOO`, `three?`, null);
      });
      this.delay(1000).then(() => {
        this.alertService.show(`HELOO`, `three???`, null);
      });
    });
    this.delay(1000).then(() => {
      this.alertService.show(`Hola`, `one?`, null);
    });
  }

}
