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
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StringConstants } from 'src/app/constants/string-constants';
import { AppRoutes } from 'src/app/constants';
import { UserAccessType } from 'src/app/models/Role';
import { AlertService } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RolesService } from 'src/app/services/roles.service';
import { SsoService } from 'src/app/services/sso.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  private userAccessType: UserAccessType;

  public get requestDataEntryAccessMessage(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Message;
  }

  public get requestDataEntryAccessTitle(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Title;
  }

  public get showRequestDataEntryAccessMessage(): boolean {
    if (!this.userAccessType) {
      return false;
    }
    if (this.roleService.canCreate(this.userAccessType)) {
      return false;
    } else {
      return this.userService.showRequestDataEntryAccessMessage();
    }
  }

  public userRoleAndOrganization = ``;
  public accessTypeMessage = ``;
  public userFullName = ``;
  public userInitials = ``;

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  /////////////////


  constructor(private userService: UserService, private router: RouterService, private alertService: AlertService, private loadingService: LoadingService, private roleService: RolesService, private ssoService: SsoService) {
    this.lottieConfig = {
      //path: 'https://assets3.lottiefiles.com/datafiles/cS8pm9FZK13Qo6e/data.json',
      path: '../../../../assets/cS8pm9FZK13Qo6e_data.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initialize();
  }

  async initialize() {
    if (!this.ssoService.isAuthenticated()) {
      return;
    }
    this.loadingService.add();
    const basicInfoExists = await this.userService.basicInformationExists();
    if (!basicInfoExists) {
      this.loadingService.remove();
      this.navigateToUserInfo();
      return;
    }
    this.userFullName = await this.userService.getFullName();

    this.userInitials = await this.userService.getInitials();

    this.userRoleAndOrganization = await this.userService.getOrganizationAndRole();

    this.userAccessType = await this.userService.getAccess();
    this.loadingService.remove();
  }

  /////////// Lottie ///////////
  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  /////////// End Lottie ///////////

	/**
	 * Uses UserService -> setShowRequestDataEntryAccessMessage()
	 * to create a cookie to save the user preference.
	 */
  public hideRequestDataEntryAccessMessage() {
    this.userService.setShowRequestDataEntryAccessMessage(false);
  }

  // TODO:
  public requestDataEntryAccess() {
    const success = this.userService.submitDataEntryRequest(`Let me in please.`);
    if (success) {
      this.alertService.show(`Success`, `Your Data Entry Access request has been sent.`, null);
    } else {
      this.alertService.show(`Failed`, `Could not create request.`, null);
    }
  }

  public navigateToUserInfo() {
    this.router.navigateTo(AppRoutes.UserInfo);
  }
}
