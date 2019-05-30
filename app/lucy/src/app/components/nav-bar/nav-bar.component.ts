import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// App
import { AppRoutes, AppRoutesParams} from '../../constants/app-routes.enum';
import { UtilityService} from '../../services';
import { SsoService } from 'src/app/services/sso.service';
import { UserService } from 'src/app/services/user.service';
import { UserAccessType } from 'src/app/models';

declare const location: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public userInitials: string = ""
  public accessType: UserAccessType = UserAccessType.view

  public get isAuthenticated(): boolean {
    return this.ssoService.isAuthenticated();
  }

  public get isAdmin(): boolean {
    return (this.accessType == UserAccessType.admin);
  }

  public get hasDataEntryAccess(): boolean {
    return (
      this.accessType == UserAccessType.admin ||
      this.accessType == UserAccessType.dataEntry
      );
  }

  // Input
  @Input() hideAddButton = false;

  userName = '';

  constructor(private router: Router, private ssoService: SsoService, private userService: UserService) { }

  ngOnInit() {
    this.setInitials()
    this.listenForRouteChanges()
  }

  /**
   * For refreshing navbar conent that
   * may change based on user's 
   * interactions with the app
  */ 
  private listenForRouteChanges() {
    var listener = this.router.events.subscribe((val) => {
      this.setInitials()
    });
  }

  private setInitials() {
    this.userService.getInitials().then((value) => {
      this.userInitials = value
      }
    );
  }

  private setAccessType() {
    this.userService.getAccess().then((value) => {
      this.accessType = value
      }
    );
  }

  logout() {
    this.ssoService.logout()
  }

  profile() {
    
  }

  onAdd() {
    // this.router.navigate([UtilityService.appRoute(AppRoutes.DetailRef), AppRoutesParams.DetailAdd, -1]);
  }

}
