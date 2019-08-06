import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { AppRoutes } from '../constants';
import { RouterService } from '../services/router.service';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import { AlertModel, AlertService } from '../services/alert.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ErrorService } from '../services/error.service';
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

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  private showLoading = false;
  private loadingSubscription: Subscription;
  /////////////////

  constructor(
    private errorService: ErrorService,
    private routerService: RouterService,
    private ssoService: SsoService,
    private messageService: MessageService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef) {
    this.setupLoadingIcon();
    this.subscribeToAlertService();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unSubscribeFromAlertService();
    this.unSubscribeFromLoadingService();
  }

  ngAfterViewInit() {
    this.subscribeToLoadingService();
    this.reRouteIfNeeded();
    this.testAlerts();
  }

  /******** Loading animation ********/
  setupLoadingIcon() {
    this.lottieConfig = {
      path: 'https://assets3.lottiefiles.com/datafiles/fPx4vaZrul2Fvg9/data.json',
      // path: 'src/assets/loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stopLoadingAnimation() {
    this.anim.stop();
  }

  playLoadingAnimation() {
    this.anim.play();
  }

  pauseLoadingAnimation() {
    this.anim.pause();
  }

  setSpeedOfLoadingAnimation(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  private subscribeToLoadingService() {
    this.loadingSubscription = this.loadingService.getObservable().subscribe(show => {
      this.showLoading = show;
      this.cdr.detectChanges();
    });
  }

  private unSubscribeFromLoadingService() {
    this.loadingSubscription.unsubscribe();
  }

  /******** End Loading animation ********/

  /******** Alerts ********/
  private subscribeToAlertService() {
    this.alertsSubscription = this.alertService.getObservable().subscribe(message => {
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
  /******** End Alerts ********/

  /******** Auth and Routing ********/
  private async reRouteIfNeeded() {
    this.loadingService.add();
    const isAuthenticated =  await this.checkAuthStatus();
    if (isAuthenticated && (this.routerService.current === AppRoutes.Root) || this.routerService.current === undefined) {
      this.routerService.navigateTo(AppRoutes.Profile);
    }
    this.loadingService.remove();
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
  /******** End Auth and Routing ********/

  /******** Notifications ********/
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

  userAccessUpdatedModalEmitted(event: boolean) {
    console.log(`Messages was respoded to, re-fetching`);
    this.fetchMessages();
  }
  /******** End Notifications ********/

  /**
   * Create a delay
   * @param ms milliseconds
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
