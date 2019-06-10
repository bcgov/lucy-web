import { Component } from '@angular/core';
import { SsoService } from '../services/sso.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AppRoutes } from '../constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public get isAuthenticated() : boolean {
    return this.ssoService.isAuthenticated();
  }

  constructor(private router: Router, private ssoService: SsoService, private userService: UserService) {}

  ngOnInit() {
    if (this.ssoService.isAuthenticated()) {
      this.router.navigate([AppRoutes.Profile])
    }
  }
}
