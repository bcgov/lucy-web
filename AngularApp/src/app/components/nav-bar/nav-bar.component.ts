import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// App
import { AppRoutes, AppRoutesParams} from '../../constants/app-routes.enum';
import { UtilityService} from '../../services';

declare const location: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  // Input
  @Input() hideAddButton = false;

  // Local state
  isLogin = false;

  userName = '';


  constructor(private router: Router) { }

  ngOnInit() {
    this.isLogin = UtilityService.isUserLogin;
  }

  logout() {
    location.reload();
  }

  onAdd() {
    this.router.navigate([UtilityService.appRoute(AppRoutes.DetailRef), AppRoutesParams.DetailAdd, -1]);
  }

}
