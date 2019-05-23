import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// App
import { AppRoutes, AppRoutesParams} from '../../constants/app-routes.enum';
import { UtilityService} from '../../services';
import { SsoService } from 'src/app/services/sso.service';
import { UserService } from 'src/app/services/user.service';

declare const location: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public get isAuthenticated() : boolean {
    return this.ssoService.isAuthenticated();
  }

  public userInitials: string = ""

  // Input
  @Input() hideAddButton = false;

  userName = '';

  constructor(private router: Router, private ssoService: SsoService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getInitials().then((value) => {
      this.userInitials = value
      }
    );
  }

  logout() {
    this.ssoService.logout()
  }

  profile() {
    
  }

  onAdd() {
    this.router.navigate([UtilityService.appRoute(AppRoutes.DetailRef), AppRoutesParams.DetailAdd, -1]);
  }

}
