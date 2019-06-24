import { Component } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { UserService } from '../services/user.service';
import { AppRoutes } from '../constants';
import { RouterService } from '../services/router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public get isAuthenticated() : boolean {
    return this.ssoService.isAuthenticated();
  }

  constructor(private routerService: RouterService, private ssoService: SsoService, private userService: UserService) {}

  ngOnInit() {

  }
  ngAfterViewInit() {
    if (this.ssoService.isAuthenticated()) {
      this.userService.basicInformationExists().then((exists) => {
        if (!exists) {
          this.routerService.navigateTo(AppRoutes.UserInfo)
        } else {
          if (this.routerService.current == AppRoutes.Root) {
            this.routerService.navigateTo(AppRoutes.Profile)
          }
        }
      });
      
    }
  }
}
