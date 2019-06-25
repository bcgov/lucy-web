import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { UserService } from '../services/user.service';
import { AppRoutes } from '../constants';
import { RouterService } from '../services/router.service';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private authStatusIsLoading: boolean | null = null;

  public get isAuthenticated(): boolean {
    if (this.authStatusIsLoading === null || this.authStatusIsLoading) {
      console.log('Auth status is loading');
      return false;
    }
    return this.ssoService.isAuthenticated();
  }

  private get isReady(): boolean {
    return this.authStatusIsLoading === false;
  }

  public userAccessUpdatedMessage: Message;

  public get userAccessUpdated(): boolean {
    return this.userAccessUpdatedMessage !== undefined;
  }

  constructor(private routerService: RouterService, private ssoService: SsoService, private messageService: MessageService) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.reRouteIfNeeded();
  }

  private reRouteIfNeeded() {
    this.checkAuthStatus().then((isAuthenticated) => {
      console.log(`CheckAuthStatus returned:  ${isAuthenticated}`);
      console.log(`Route: ${this.routerService.current}`);
      console.log(`Root:   ${AppRoutes.Root}`);
      if (isAuthenticated && (this.routerService.current === AppRoutes.Root) || this.routerService.current === undefined) {
        console.log(`Redirecting to profile`);
        this.routerService.navigateTo(AppRoutes.Profile);
      }
    });
  }

  private async checkAuthStatus(): Promise<boolean> {
    this.authStatusIsLoading = true;
    const isAuthenticated = await this.ssoService.isAuthenticatedAsync();
    this.authStatusIsLoading = false;
    return isAuthenticated;
  }

  private async fetchMessages() {
    this.messageService.fetchMessages().then(messages => {
    });
  }

  userAccessUpdatedModalEmitted(event: boolean) {

  }
}
