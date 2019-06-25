import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { UserService } from '../services/user.service';
import { AppRoutes } from '../constants';
import { RouterService } from '../services/router.service';

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

  constructor(private routerService: RouterService, private ssoService: SsoService, private userService: UserService) {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.checkAuthStatus().then((isAuthenticated) => {
      console.log(`CheckAuthStatus returned:  ${isAuthenticated}`);
      console.log(`Route: ${this.routerService.current}`);
      console.log(`Root:   ${AppRoutes.Root}`);
      if (isAuthenticated && (this.routerService.current === AppRoutes.Root) || this.routerService.current === undefined) {
        console.log(`Redirecting to profile`);
        this.routerService.navigateTo(AppRoutes.Profile);
      }
    });
    // console.log("\n\n*** AT APP COMPONENT AFTER VIEW INIT")
    // if (this.ssoService.isAuthenticated()) {
    //   console.log("\n\n*** USER IS AUTHENTICATED")
    //   this.userService.basicInformationExists().then((exists) => {
    //     if (!exists) {
    //       this.routerService.navigateTo(AppRoutes.UserInfo)
    //     } else {
    //       if (this.routerService.current == AppRoutes.Root) {
    //         this.routerService.navigateTo(AppRoutes.Profile)
    //       }
    //     }
    //   });
      
    // }
  }

  private async checkAuthStatus(): Promise<boolean> {
    this.authStatusIsLoading = true
    const isAuthenticated = await this.ssoService.isAuthenticatedAsync()
    this.authStatusIsLoading = false
    return isAuthenticated
  }
}
