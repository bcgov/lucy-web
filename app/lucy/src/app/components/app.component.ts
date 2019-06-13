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
    if (this.ssoService.isAuthenticated()) {
      if (this.routerService.current == AppRoutes.Root) {
        this.routerService.navigateTo(AppRoutes.Profile)
      }
    }
  }
}
