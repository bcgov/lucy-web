import { Component, OnInit } from '@angular/core';
import { SsoService, SSOLoginProvider } from '../../../services/sso.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StringConstants } from 'src/app/constants/string-constants';
import { RouterService } from 'src/app/services/router.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public appTitle = ``;

  constructor(private loadingService: LoadingService, private ssoService: SsoService, private router: RouterService, private cookieService: CookieService) { }

  ngOnInit() {
    this.setAppTitle();
  }

  loginWithBCeID() {
    if (this.ssoService) {
      this.loadingService.add();
      this.ssoService.login(SSOLoginProvider.BCeID);
    }
  }

  private async setAppTitle() {
    this.appTitle = StringConstants.app_Title;
  }

  loginWithIDIR() {
    this.router.storeCurrentRouteInSession();
    if (this.ssoService) {
      this.loadingService.add();
      this.ssoService.login(SSOLoginProvider.idir);
    }
  }
}
