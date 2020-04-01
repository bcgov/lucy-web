/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit } from '@angular/core';
import { SsoService, SSOLoginProvider } from 'src/app/services/sso.service';
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

  loginWithBCeID() {
    if (this.ssoService) {
      this.loadingService.add();
      this.ssoService.login(SSOLoginProvider.BCeID);
    }
  }
}
